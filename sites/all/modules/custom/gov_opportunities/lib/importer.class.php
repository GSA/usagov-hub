<?php

class FBOXMLImport
{

    var $top_level_tags = 'PRESOL|SRCSGT|COMBINE|AMDCSS|MOD|JA|AWARD|ARCHIVE|UNARCHIVE|SNOTE|NOTICES';

    var $mid_level_tags = 'DATE|YEAR|AGENCY|OFFICE|LOCATION|ZIP|CLASSCOD|NAICS|OFFADD|SUBJECT|SOLNBR|NTYPE|RESPDATE|ARCHDATE|CONTACT|DESC|LINK|URL|DESC|EMAIL|SETASIDE|POPCOUNTRY|POPZIP|POPADDRESS|CHANGES|RECOVERY_ACT|DOCUMENT_PACKAGES|PACKAGE|ADDRESS|AWDNBR|AWDAMT|AWDDATE|SNOTE|LINENBR|STAUTH|SSALE|FAIROPP|DONBR|FSTD|ITB|CORRECTION';

    var $included_tags = ['COMBINE', 'PRESOL', 'SRCSGT', 'MOD', 'NOTICES'];

    var $es_batch = '';

    var $es_results = [];

    var $es_host = '';

    var $es_index = 'opportunities';

    var $es_type = 'opportunity';

    var $opportunities = [];

    var $mods = [];

    var $awards = [];

    var $curr_field = null;

    var $curr_item = null;

    var $closed = null;

    var $tags = [];

    var $ignore_tag = null;

    var $ftp_server = 'ftp.fbo.gov';

    var $ftp_user = 'anonymous';

    var $ftp_pass = '';

    var $filename = '';

    var $tmp_file = '';

    var $file_date = '';

    var $fbo_map = [];

    var $commandline = false;

    var $z = 0;

    var $y = 0;

    public function __construct()
    {
    }

    public function loadMappings()
    {
        if ( empty($this->fbo_map) ) {
            require dirname(__FILE__) . '/mappings.php';
            require dirname(__FILE__) . '/zips.php';
            $this->fbo_map = $fbo_map;
        }
    }

    public function setCommandline($commandline = true)
    {
        $this->commandline = $commandline;
    }

    public function listFBODailyFiles()
    {
        $conn_id = ftp_connect($this->ftp_server);
        ftp_login($conn_id, $this->ftp_user, $this->ftp_pass);
        ftp_pasv($conn_id, true);
        $files = ftp_nlist($conn_id, '/');
        ftp_close($conn_id);
        $f = [];
        foreach ($files as $i => $filename) {
            $m = [];
            if (preg_match('/^\/?(FBOFeed\d{4}\d{2}\d{2})$/', $filename, $m)) {
                $f[$m[1]] = $m[1];
            }
        }
        krsort($f);
        return $f;
    }

    public function dailiesSince($date=null)
    {

        $conn_id = ftp_connect($this->ftp_server);
        ftp_login($conn_id, $this->ftp_user, $this->ftp_pass);
        ftp_pasv($conn_id, true);
        $files = ftp_nlist($conn_id, '/');
        $today_date = strtotime(date('Y-m-d'));
        if ( $date===null ) {
            $since_date = ftp_mdtm($conn_id, '/datagov/FBOFullXML.xml' )-(86400*1);
        } else if ( is_string($date) ) {
            $since_date = strtotime($date);
        } else {
            $since_date = intval($date);
        }
        ftp_close($conn_id);
        $f = [];
        foreach ($files as $i => $filename) {
            $m = [];
            if (preg_match('/^\/?(FBOFeed(\d{4})(\d{2})(\d{2}))$/', $filename, $m)) {
                $date = "{$m[2]}-{$m[3]}-{$m[4]}";
                $file_date  = strtotime($date);
                if ( $file_date <= $today_date && $file_date >= $since_date ) {
                    $f[$m[1]] = $filename;
                }
            }
        }
        ksort($f);
        return $f;
    }

    public function remoteFileExists()
    {
        // is remote file readable
        $conn_id = ftp_connect($this->ftp_server);
        ftp_login($conn_id, $this->ftp_user, $this->ftp_pass);
        ftp_pasv($conn_id, true);
        $size = ftp_size($conn_id, $this->filename);
        ftp_close($conn_id);
        return ($size>0);
    }

    public function downloadFile($force = false)
    {
        $conn_id = ftp_connect($this->ftp_server);
        ftp_login($conn_id, $this->ftp_user, $this->ftp_pass);
        ftp_pasv($conn_id, true);
        $ftp_date = ftp_mdtm($conn_id, $this->filename);
        $ftp_size = ftp_size($conn_id, $this->filename);

        // if a tmp file alread exists from today and is the correct size - don't download again
        $size_match = false;
        $date_match = false;
        if (!$force && is_readable($this->tmp_file)) {
            // $date_match = date('Ymd') == date('Ymd', filemtime($this->tmp_file));
            // if remote file matches local file
            $local_size = filesize($this->tmp_file);
            $local_date = filemtime($this->tmp_file);
            $size_match = $ftp_size==$local_size;
            $date_match = $ftp_date<=$local_date;
            if ( $size_match && $date_match) {
                if ($this->commandline) {
                    $this->log("FBO No Download: {$this->tmp_file} matches server file from ".date('Y-m-d',$ftp_date)."\n");
                }
                return true;
            }
        }
        $this->log("FBO Needs Download: {$this->tmp_file} "
            ." ftp_date=". date('Y-m-d',$ftp_date) ." local_date=".date('Y-m-d',$local_date)
            ." date_match=". ($date_match?'Y':'N')
            ." ftp_size=". $this->getNiceSize($ftp_size) ." local_size=". $this->getNiceSize($local_size)
            ." size_match=". ($size_match?'Y':'N'));
        $user = !empty($_SERVER['USER']) ? $_SERVER['USER'] : 'www-data';
        touch( $this->tmp_file, $ftp_date );
        chown( $this->tmp_file, $user );
        if (ftp_get($conn_id, $this->tmp_file, $this->filename, FTP_BINARY)) {
            touch( $this->tmp_file, $ftp_date );
            return true;
        } else {
            return false;
        }
        ftp_close($conn_id);
        return is_readable($this->tmp_file);
    }

    public function removeAllDownloadedFiles()
    {
        foreach (glob("/tmp/*FBO*") as $filename) {
            unlink($filename);
        }
    }

    public function removeOldDownloadedFiles()
    {
        $full_date = strtotime(date('Y-m-d'));
        if ( is_readable('/tmp/datagov_FBOFullXML.xml') ) {
            $full_date = strtotime(date('Y-m-d',filemtime('/tmp/datagov_FBOFullXML.xml')));
        }
        foreach (glob("/tmp/*FBO*") as $filename) {
            $m = [];
            if ( preg_match('/(\d{4})(\d{2})(\d{2})/',$filename,$m) ) {
                $file_date = strtotime("{$m[1]}-{$m[2]}-{$m[3]}");
                if ( $file_date < $full_date ) {
                    unlink($filename);
                }
            }
        }
    }

    public function setFilename($filename = null)
    {
        if (stristr($filename, 'Full') !== false) {
            $this->filename = 'datagov/FBOFullXML.xml';
            $this->file_date = date("Y-m-d");
        } else {
            $this->filename = $filename;
            $m = [];
            if ( preg_match('/(\d{4})(\d{2})(\d{2})/',$filename,$m) ) {
                $this->file_date = "{$m[1]}-{$m[2]}-{$m[3]}";
            }
        }
        if (!empty($this->filename)) {
            $this->tmp_file =  '/tmp/'. str_replace('/', '_', $this->filename);
        }
    }

    public function setElasticsearchHost($es_host)
    {
        $this->es_host = $es_host;
    }

    public function getId(&$item)
    {
        if (!empty($item['solnbr'])) {
            return trim($item['solnbr']);
        }
        if (!empty($item['SOLNBR'])) {
            return trim($item['SOLNBR']);
        }
        if (!empty($item['FundingOppNumber'])) {
            return trim($item['FundingOppNumber']);
        }
        return null;
    }

    public function getType(&$item)
    {
        if (!empty($item['type'])) {
            return trim($item['type']);
        }
        if (!empty($item['TYPE'])) {
            return trim($item['TYPE']);
        }
        return null;
    }

    public function convertToCommonFormat(&$item, $type)
    {
        $this->loadMappings();

        $this->changeKeyCase($item, CASE_LOWER);
        $item['type'] = $type;
        /// walk through any changes and update our main record (we should index only final form)
        if ($item['type']=='PRESOL' && !empty($item['document_packages']) && !empty($item['document_packages']['package'])) {
            foreach ($item['document_packages']['package'] as $key => $package) {
                if ( $package == 'Solicitation 1' ) {
                    $item['type'] = 'SOL';
                }
            }
        }
        if (!empty($item['changes']) && !empty($item['changes']['mod'])) {
            foreach ($item['changes']['mod'] as $key => $mod) {
                $mod = (array)$mod;
                $this->changeKeyCase($mod, CASE_LOWER);
                if (isset($mod['email']) && is_array($mod['email'])
                    && isset($mod['email']['address']) && isset($mod['email']['desc'])
                ) {
                    $mod['emaildesc'] = $mod['email']['desc'];
                    $mod['email'] = $mod['email']['address'];
                }
                if (!empty($mod['desc'])) {
                    if ( is_array($item['desc']) ) { $item['desc'] = implode('',$item['desc']); }
                    if (!empty($item['desc']) && substr($item['desc'], 11, 25)!=='This text is from the opp') {
                        $item['desc'] = "<i><strong>This text is from the opportunity's original synopsis:</strong></i><br />\r\n". $item['desc'];
                    }
                    $mod_date = '';
                    if (isset($mod['date'])) {
                        $matches = [];
                        if (preg_match('/^(\d\d)(\d\d)(\d{4})$/', $mod['date'], $matches)) {
                            if (!empty($matches[1]) && !empty($matches[2]) && !empty($matches[3])) {
                                $mod_date = " dated {$matches[1]}-{$matches[2]}-{$matches[3]}";
                            }
                        } else {
                            if (preg_match('/^(\d\d)(\d\d)(\d\d)$/', $mod['date'], $matches)) {
                                if (!empty($matches[1]) && !empty($matches[2]) && !empty($matches[3])) {
                                    $mod_date = " dated {$matches[1]}-{$matches[2]}-20{$matches[3]}";
                                }
                            }
                        }
                    }
                    $item['desc'] .= "<br />\r\n<br />\r\n<i><strong>This text is from a change to the opportunity{$mod_date}:</strong></i><br />\r\n";
                    $item['desc'] .= $mod['desc'];
                    if ( $item['type']=='PRESOL' && !empty($mod['document_packages']) && !empty($mod['document_packages']['package'])) {
                        foreach ($mod['document_packages']['package'] as $key => $package) {
                            if ( $package == 'Solicitation 1' ) {
                                $item['type'] = 'SOL';
                            }
                        }
                    }
                }
                unset($mod['desc']);
                if (!empty($mod['setaside'])) {
                    if (!is_array($item['setaside'])) {
                        $item['setaside'] = [$item['setaside']];
                    }
                    if (!in_array(trim($mod['setaside']), $item['setaside'])) {
                        $item['setaside'][] = trim($mod['setaside']);
                    }
                }
                unset($mod['setaside']);
                unset($mod['date']);
                unset($mod['document_packages']);
                $item = array_merge($item, $mod);
            }
        }
        if (!empty($item['changes']) && !empty($item['changes']['award'])) {
            foreach ($item['changes']['award'] as $award) {
                if (!empty($award['awddate'])) {
                    $item['awarddate'] = $award['awddate'];
                }
            }
        }
        if ( isset($item['awddate']) ) {
            $item['awarddate'] = $item['awddate'];
        }
        if (is_array($item['setaside'])) {
            $item['setaside'] = implode(', ', array_unique($item['setaside']));
        }
        unset($item['changes']);
        unset($item['document_packages']);

        if (isset($item['email_email'])) {
            $item['email'] = $item['email_email'];
            unset($item['email_email']);
        }
        if (isset($item['email_desc'])) {
            $item['emaildesc'] = $item['email_desc'];
            unset($item['email_desc']);
        }
        if (isset($item['email']) && is_array($item['email']) &&
            isset($item['email']['address']) && isset($item['email']['desc'])
        ) {
            $item['emaildesc'] = $item['email']['desc'];
            $item['email'] = $item['email']['address'];
        }
        if (isset($item['link_url'])) {
            $item['link'] = $item['link_url'];
            unset($item['link_url']);
        }
        unset($item['link_desc']);
        /// create state fields
        $zip = '';
        if (!empty($item['popzip'])) {
            $zip = (string)$item['popzip'];
        } else {
            if (!empty($item['zip'])) {
                $zip = (string)$item['zip'];
            }
        }
        if (empty($item['zip']) && !empty($item['popzip'])) {
            $item['zip'] = (string)$item['popzip'];
            if (strlen($item['zip']) > 5) {
                $item['zip'] = substr($item['zip'], 0, 5);
            }
        }
        if (strlen($zip) > 5) {
            $zip = substr($zip, 0, 5);
        }
        if (!empty($zip)) {
            $item['state'] = '';
            $item['cities'] = [];
            $item['geoloc'] = [];
            if (!empty($zip) && !empty($this->fbo_map['zips'][$zip])) {
                $item['state'] = $this->fbo_map['zips'][$zip]['state'];
                $item['cities'] = $this->fbo_map['zips'][$zip]['cities'];
                $item['geoloc'] = [
                    $this->fbo_map['zips'][$zip]['lon'],
                    $this->fbo_map['zips'][$zip]['lat'],
                ];
            }
        }
        /// Dates
        if (isset($item['awarddate'])) {
            $matches = [];
            if (preg_match('/^(\d\d)(\d\d)(\d{4})$/', $item['awarddate'],
                $matches)) {
                if (!empty($matches[1]) && !empty($matches[2]) && !empty($matches[3])) {
                    $item['awarddate'] = "{$matches[3]}-{$matches[1]}-{$matches[2]}";
                }
            } else {
                if (preg_match('/^(\d\d)(\d\d)(\d\d)$/', $item['awarddate'],
                    $matches)) {
                    if (!empty($matches[1]) && !empty($matches[2]) && !empty($matches[3])) {
                        $item['awarddate'] = "20{$matches[3]}-{$matches[1]}-{$matches[2]}";
                    }
                }
            }
        }
        if (isset($item['respdate'])) {
            $matches = [];
            if (preg_match('/^(\d\d)(\d\d)(\d{4})$/', $item['respdate'],
                $matches)) {
                if (!empty($matches[1]) && !empty($matches[2]) && !empty($matches[3])) {
                    $item['responsedate'] = "{$matches[3]}-{$matches[1]}-{$matches[2]}";
                }
            } else {
                if (preg_match('/^(\d\d)(\d\d)(\d\d)$/', $item['respdate'],
                    $matches)) {
                    if (!empty($matches[1]) && !empty($matches[2]) && !empty($matches[3])) {
                        $item['responsedate'] = "20{$matches[3]}-{$matches[1]}-{$matches[2]}";
                    }
                }
            }
        }
        unset($item['respdate']);
        if (isset($item['archdate'])) {
            $matches = [];
            if (preg_match('/^(\d\d)(\d\d)(\d{4})$/', $item['archdate'],
                $matches)) {
                if (!empty($matches[1]) && !empty($matches[2]) && !empty($matches[3])) {
                    $item['archivedate'] = "{$matches[3]}-{$matches[1]}-{$matches[2]}";
                }
            } else {
                if (preg_match('/^(\d\d)(\d\d)(\d\d)$/', $item['archdate'],
                    $matches)) {
                    if (!empty($matches[1]) && !empty($matches[2]) && !empty($matches[3])) {
                        $item['archivedate'] = "20{$matches[3]}-{$matches[1]}-{$matches[2]}";
                    }
                }
            }
        }
        unset($item['archdate']);

        $item['closedate'] = !empty($item['responsedate']) ? $item['responsedate'] : null;
        if ( !empty($item['archivedate']) && ( empty($item['closedate']) || strtotime($item['archivedate']) < strtotime($item['closedate']) ) ) {
            $item['closedate'] = $item['archivedate'];
        }
        if ( !empty($item['awarddate']) && ( empty($item['closedate']) || strtotime($item['awarddate']) < strtotime($item['closedate']) ) ) {
            $item['closedate'] = $item['awarddate'];
        }

        if (!empty($item['year']) && !empty($item['date'])) {
            $item['postdate'] = '';
            $matches = [];
            if (preg_match('/^(\d\d)(\d\d)$/', $item['date'], $matches)) {
                if (!empty($matches[1]) && !empty($matches[2])) {
                    $item['postdate'] = "20{$item['year']}-{$matches[1]}-{$matches[2]}";
                }
            }
        } elseif (empty($item['year']) && !empty($item['date'])) {
            $item['postdate'] = '';
            $matches = [];
            if (preg_match('/^(\d\d)(\d\d)(\d{4})$/', $item['date'],
                $matches)) {
                if (!empty($matches[1]) && !empty($matches[2]) && !empty($matches[3])) {
                    $item['postdate'] = "{$matches[3]}-{$matches[1]}-{$matches[2]}";
                }
            }
        }
        unset($item['year']);
        unset($item['date']);
        /// lookup NAICS
        if (isset($item['naics'])) {
            $item['naicsvalue'] = '';
            if (!empty($item['naics']) && !empty($this->fbo_map['naicsCodes'][$item['naics']])) {
                $item['naicsvalue'] = $this->fbo_map['naicsCodes'][$item['naics']];
            }
        }
        if (isset($item['offadd'])) {
            $item['officeaddress'] = $item['offadd'];
            unset($item['offadd']);
        }
        /// lookup CLASSCOD
        if (isset($item['classcod'])) {
            $item['classcode'] = $item['classcod'];
            unset($item['classcod']);
        }
        if (isset($item['classcode'])) {
            $item['classvalue'] = '';
            if (!empty($item['classcode']) && !empty($this->fbo_map['classCodes'][$item['classcode']])) {
                $item['classvalue'] = $this->fbo_map['classCodes'][$item['classcode']];
            }
        }
        // $item['email'] = $item['email_email'];
        // unset($item['email_email']);
        // $item['link_url'] = $item['link'];
        // unset($item['link']);
        /// data conversions
        $item['source'] = basename($this->filename);
        $this->changeEncoding($item);
    }

    public function convertToJson($item)
    {
        $_id = $this->getId($item);
        if (empty($_id)) {
            return '';
        }
        $action = 'index';
        if (isset($item['type']) && $item['type'] == 'MOD') {
            $action = 'update';
            unset($item['type']);
            $item = ["doc" => $item];
        } else if (isset($item['type']) && $item['type'] == 'AWARD') {
            $action = 'delete';
        }

        $batchPrefix = '{"' . $action . '":{"_id":' . json_encode($_id,JSON_PARTIAL_OUTPUT_ON_ERROR) . '}}';
        if ( $action == 'delete' ) {
            return $batchPrefix . "\n";
        }
        $encodedItem = json_encode($item, JSON_PARTIAL_OUTPUT_ON_ERROR);
        if (empty($encodedItem)) {
            return '';
        }
        return $batchPrefix . "\n" . $encodedItem . "\n";
    }


    public function processFile()
    {
        if (stristr($this->filename, 'Full') !== false) {
            $success = $this->processFullFile();
            $dailyFiles = $this->dailiesSince();
            foreach ( $dailyFiles as $dailyFile ) {
                $this->setFilename($dailyFile);
                if ( !$this->processDailyFile() ) {
                    $success = false;
                }
            }
            return $success;
        } else {
            return $this->processDailyFile();
        }
    }

    public function processFullFile()
    {
        if (!$this->downloadFile()) {
            $this->log('FBO Import: cannot download file ' . $this->filename);
            return false;
        }
        // return true;

        $this->startProcess();
        $startTime = time();
        $pid = getmypid();
        // $filename = "ftp://ftp.fbo.gov/datagov/FBOFullXML.xml";
        // if (!($handle = fopen('ftp://'. $this->ftp_server . '/' . $this->filename, "rb"))) {
        if (!($handle = fopen($this->tmp_file, "rb"))) {
            $this->log('FBO Import: cannot open ' . $this->tmp_file);
            return;
        }
        $this->es_batch = '';

        $parser = xml_parser_create();
        xml_parser_set_option($parser, XML_OPTION_CASE_FOLDING, true);
        xml_parser_set_option($parser, XML_OPTION_SKIP_WHITE, true);
        xml_parser_set_option($parser, XML_OPTION_TARGET_ENCODING, "UTF-8");

        xml_set_element_handler($parser, [&$this, "saxStartTag"], [&$this, "saxEndTag"]);
        xml_set_character_data_handler($parser, [&$this, "saxTagData"]);
        while ($data = fread($handle, 4096)) {
            xml_parse($parser, $data);
        }
        @fclose($handle);
        xml_parser_free($parser);
        if ($this->commandline) {
            echo ' : '. $this->y ." / ". $this->z ." (".( count($this->opportunities) + count($this->mods) + count($this->awards) ).")\n";
        }

        // $this->touchProcess();
        $this->processAllItems();

        $this->finishProcess();
        return true;
    }

    public function saxStartTag($parser, $name, $attrs)
    {
        if (empty($name) || $name == 'NOTICES') {
            return;
        }

        if (preg_match("/({$this->top_level_tags}|{$this->mid_level_tags})/", $name)) {
            if (count($this->tags) == 0) {
                $this->opportunities[] = ['TYPE' => $name];
                $this->curr_item =& $this->opportunities[count($this->opportunities) - 1];
            } else {
                $this->curr_field =& $this->curr_item;
                $par = null;
                foreach (array_slice($this->tags, 1) as $t => $tag) {
                    if (in_array($par, ['CHANGES', 'DOCUMENT_PACKAGES'])) {
                        $this->curr_field =& $this->curr_field[$tag][max(0, count($this->curr_field[$tag]) - 1)];
                    } else {
                        $this->curr_field =& $this->curr_field[$tag];
                    }
                    $par = $tag;
                }
                if (!isset($this->curr_field[$name])) {
                    $this->curr_field[$name] = [];
                }

                if (in_array($par, ['CHANGES', 'DOCUMENT_PACKAGES'])) {
                    $this->curr_field[$name][] = [];
                    $this->curr_field =& $this->curr_field[$name][0];
                } else {
                    $this->curr_field =& $this->curr_field[$name];
                }
            }
            $this->ignore_tag = false;
            $this->tags[] = $name;
        } else {
            $this->ignore_tag = true;
        }
    }

    public function saxEndTag($parser, $name)
    {
        if (empty($name) || $name == 'NOTICES') {
            return;
        }
        if (preg_match("/({$this->top_level_tags}|{$this->mid_level_tags})/", $name)) {
            array_pop($this->tags);
        }
        // done an item
        if (count($this->tags) == 0) {
            // if ( $this->getId($this->curr_item) == 'N4008517B3034' ) {
            //     print_r($this->curr_item);
            // }
            if ($this->isItemClosed($this->curr_item)) {
                $closed = array_pop($this->opportunities);
                //$this->y--;
                $this->closed[$this->getId($closed)] = true;
                $this->curr_item = null;
                if ($this->commandline) {
                    echo " ";
                }
            } elseif (!in_array($this->curr_item['TYPE'], $this->included_tags)) {
                array_pop($this->opportunities);
                // $this->y--;
                $this->curr_item = null;
                if ($this->commandline) {
                    echo "-";
                }
            } else {
                $this->y++;
                /// we are finished building this item
                $this->convertToCommonFormat($this->curr_item, $name);
                if ($this->gettype($this->curr_item) === 'MOD') {
                    $this->mods[] = $this->curr_item;
                } elseif ($this->gettype($this->curr_item) === 'AWARD') {
                    $this->awards[] = $this->curr_item;
                } else {
                    $this->processItem($this->curr_item);
                }
                if ($this->commandline) {
                    echo "*";
                }
            }
            if ($this->commandline) {
                $this->z++;
                if (($this->z%100)==0) {
                    echo ' : '. $this->y ." / ". $this->z ."\n";
                    // echo ' : '. ( count($this->opportunities) + count($this->mods) + count($this->awards) ) ." / ". $this->z ."\n";
                }
            }
        }
    }

    public function saxTagData($parser, $data)
    {
        if (empty(trim($data)) || $this->ignore_tag) {
            return;
        }
        if (empty($this->curr_field)) {
            $this->curr_field = $data;
        } else {
            $this->curr_field .= $data;
        }
    }


    public function isItemClosed($item)
    {
        $id = $this->getId($item);
        if (!empty($id) && isset($this->closed[$id])) {
            return true;
        }
        $date = null;
        if (!empty($item['closedate'])) {
            $date = $item['closedate'];
        } else {
            if (isset($item['RESPDATE'])) {
                $date = $item['RESPDATE'];
            } elseif (isset($item['ARCHDATE'])) {
                $date = $item['ARCHDATE'];
            }
            if (!empty($item['CHANGES']) && !empty($item['CHANGES']['MOD'])) {
                foreach ($item['CHANGES']['MOD'] as $mod) {
                    $mod = (array)$mod;
                    if (isset($mod['RESPDATE'])) {
                        $date = $mod['RESPDATE'];
                    } elseif (isset($mod['ARCHDATE'])) {
                        $date = $mod['ARCHDATE'];
                    }
                }
            }
            if (!empty($item['CHANGES']) && !empty($item['CHANGES']['AWARD'])) {
                foreach ($item['CHANGES']['AWARD'] as $award) {
                    $award = (array)$award;
                    if (isset($award['AWDDATE'])) {
                        $award = $award['AWDDATE'];
                    }
                }
            }
            if (!empty($date)) {
                $matches = [];
                if (preg_match('/^(\d\d)(\d\d)(\d{4})$/', $date, $matches)) {
                    if (!empty($matches[1]) && !empty($matches[2]) && !empty($matches[3])) {
                        $date = "{$matches[3]}-{$matches[1]}-{$matches[2]}";
                    }
                } else {
                    if (preg_match('/^(\d\d)(\d\d)(\d\d)$/', $date, $matches)) {
                        if (!empty($matches[1]) && !empty($matches[2]) && !empty($matches[3])) {
                            $date = "20{$matches[3]}-{$matches[1]}-{$matches[2]}";
                        }
                    }
                }
            }
        }
        if (!empty($date) && strtotime($date) <= strtotime('tomorrow')) {
            $this->closed[$id] = true;
            return true;
        } else if (empty($date)) {
            if ( !empty($item['POSTDATE']) ) {
                $date = $item['POSTDATE'];
            } else if (!empty($item['postdate'])) {
                $date = $item['postdate'];
            }
            if (!empty($date)) {
                $matches = [];
                if (preg_match('/^(\d\d)(\d\d)(\d{4})$/', $date, $matches)) {
                    if (!empty($matches[1]) && !empty($matches[2]) && !empty($matches[3])) {
                        $date = "{$matches[3]}-{$matches[1]}-{$matches[2]}";
                    }
                } else {
                    if (preg_match('/^(\d\d)(\d\d)(\d\d)$/', $date, $matches)) {
                        if (!empty($matches[1]) && !empty($matches[2]) && !empty($matches[3])) {
                            $date = "20{$matches[3]}-{$matches[1]}-{$matches[2]}";
                        }
                    }
                }
            }
            if (!empty($date) ) {
                $type = null;
                if ( !empty($item['TYPE']) ) {
                    $type = $item['TYPE'];
                } else if ( !empty($item['type']) ) {
                    $type = $item['type'];
                }
                if ( !empty($type) && in_array($type,['PRESOL','SRCSGT']) && strtotime($date) <= strtotime('-1 year') ) {
                    $this->closed[$id] = true;
                    return true;
                } else if ( strtotime($date) <= strtotime('-6 years') ) {
                    $this->closed[$id] = true;
                    return true;
                }
            }
        }
        return false;
    }

    public function processItem(&$item)
    {
        if (is_bool($item)) {
            return null;
        }
        if ($this->isItemClosed($item)) {
            $item = false;
            return false;
        }
        $json = $this->convertToJson($item);
        $item = true;
        $this->es_batch .= $json;
        if (strlen($this->es_batch) > 4000000) {
            // if (strlen($this->es_batch) > 100000) {
            $this->es_results[] = $this->batchToElasticsearch($this->es_batch);
            $this->es_batch = '';
        }
        return true;
    }

    public function processAllItems()
    {
        // process non-MOD items first
        foreach ($this->opportunities as &$item) {
            if (!is_array($item)) {
                continue;
            } elseif ($this->getType($item) === 'MOD') {
                $this->mods[] =& $item;
            } elseif ($this->getType($item) === 'AWARD') {
                $this->awards[] =& $item;
            } else {
                $this->processItem($item);
            }
        }
        // process mods last so we will be sure their orig record has already been processed
        foreach ($this->mods as &$item) {
            if (!is_array($item)) {
                continue;
            }
            $this->processItem($item);
        }
        foreach ($this->awards as &$item) {
            if (!is_array($item)) {
                continue;
            }
            $this->processItem($item);
        }
        // send out last leftover batch
        if (!empty($this->es_batch)) {
            $this->es_results[] = $this->batchToElasticsearch($this->es_batch);
            $this->es_batch = '';
        }
    }


    public function processDailyFile()
    {

        if (!$this->downloadFile()) {
            $this->log('FBO Import: cannot download file ' . $this->filename);
            return false;
        }
        // return true;
        // if (!($handle = fopen('ftp://'. $this->ftp_server . '/' . $this->filename, "rb"))) {
        if (!($handle = fopen($this->tmp_file, "rb"))) {
            $this->log('FBO Import: cannot open ' . $this->tmp_file);
            return false;
        }
        $this->startProcess();
        $this->y = 0;
        $this->z = 0;
        // $startTime = time();
        $this->es_batch = '';
        $chunk = '';
        while ($input = fread($handle, 128)) {
            $chunk .= $input;
            /// if you see an end-tag, try and process this
            if (preg_match("/<\/({$this->top_level_tags})>/", $chunk)) {
                $item = $this->processDailyChunk($chunk);
                if (!empty($item) && isset($item['TYPE'])
                    && in_array($item['TYPE'], $this->included_tags)
                ) {
                    $this->convertToCommonFormat($item, $item['TYPE']);
                    if ($this->isItemClosed($item)) {
                        $this->closed[$this->getId($item)] = true;
                        if ($this->commandline) {
                            echo " ";
                        }
                    } else {
                        $this->opportunities[] = $item;
                        $this->y++;
                        if ($this->commandline) {
                            echo "*";
                        }
                    }
                } else {
                    if ($this->commandline) {
                        echo "-";
                    }
                }
                $this->z++;
                if ($this->commandline && ($this->z%100)==0) {
                    // echo ' : '. count($this->opportunities) ." / ". $this->z ."\n";
                    echo ' : '. $this->y ." / ". $this->z ."\n";
                }
                // save the leftovers from this chunk for next time
                $chunk = preg_replace(
                    "/^.*?<\/({$this->top_level_tags})>/s",
                    "",
                    $chunk,
                    1
                );
            }
        }
        if ($this->commandline) {
            // echo ' : '. count($this->opportunities) ." / ". $this->z ."\n";
            // echo ' : '. $this->y ." / ". $this->z ." (".( count($this->opportunities) + count($this->mods) + count($this->awards) ).")\n";
            echo ' : '. $this->y ." / ". $this->z ."\n";
        }

        // $this->touchProcess();
        $this->processAllItems();

        $this->finishProcess();
        return true;
    }

    public function processDailyChunk($raw)
    {
        /// filter out only one item by trimming around first top level tag
        $match = [];
        preg_match("/^.*?<({$this->top_level_tags})>/s", $raw, $match);
        if (empty($match[1])) {
            return null;
        }
        $tag = $match[1];
        if (!in_array($tag, $this->included_tags)) {
            return null;
        }
        $raw = preg_replace("/^.*?<{$tag}>/s", "", $raw, 1);
        $raw = preg_replace("/<\/{$tag}>.*/s", "", $raw, 1);
        /// convert to hash
        $data = ['TYPE' => $tag];
        $parent = null;
        do {
            preg_match("/<({$this->mid_level_tags})>(.*?)(<(({$this->mid_level_tags})|(\/({$this->top_level_tags})))>|$)/s",
                $raw, $match);
            if (empty($match[1])) {
                continue;
            }
            $raw = preg_replace("/<({$this->mid_level_tags})>(.*?)(<(({$this->mid_level_tags})|(\/({$this->top_level_tags})))>|$)/s",
                "$3", $raw, 1);
            $tag = $match[1];
            $val = $match[2];
            /// only leave main description untrimmed
            if ($tag !== 'DESC' || $parent !== 'NULL') {
                $val = trim($val);
            }
            /// is this tag a sub-tag?
            if (($parent == 'LINK' && !in_array($tag, ['URL', 'DESC']))
                || ($parent == 'EMAIL' && !in_array($tag, ['EMAIL', 'DESC']))
            ) {
                $parent = null;
            }
            /// flatten subtags
            if (($parent == 'LINK' && in_array($tag, ['URL', 'DESC']))
                || ($parent == 'EMAIL' && in_array($tag, ['EMAIL', 'DESC']))
            ) {
                $data["{$parent}_{$tag}"] = $val;
            } elseif (in_array($tag, ['LINK', 'EMAIL'])) {
                $parent = $tag;
            } else {
                $data[$tag] = $val;
            }
        } while (!empty($match));

        return $data;
    }

    public function removeClosedOpportunities($date = null)
    {
        // return true;
        try {
            if ( $date === null ) {
                if ( !empty($this->file_date) ) {
                    $date = $this->file_date;
                } else {
                    $date = 'now';
                }
            }
            if ( !preg_match('/^\d{4}-\d{2}-\d{2}$/',$date) && $date!=='now' ) {
                return false;
            }
            $data = '{
              "query":{
                "range" : {
                  "closedate" : {
                    "lte" : "'.$date.'"
                  }
                }
              }
            }';
            $this->log('FBO Removing opportunities that have been closed before '.$date);
            // $this->log('FBO '.$data);
            $curl = curl_init();
            curl_setopt($curl, CURLOPT_URL, $this->es_host . '/' . $this->es_index . '/' . $this->es_type . '/_delete_by_query' );
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "POST");
            curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
            curl_setopt($curl, CURLOPT_HTTPHEADER,
                ['CONTENT-TYPE: application/json; charset=utf-8']);
            // curl_setopt($curl, CURLOPT_VERBOSE, 1);
            // curl_setopt($curl, CURLOPT_FAILONERROR, true);
            // if ( local AND ssl )
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
            curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
            $result = curl_exec($curl);
            // $this->log(print_r(json_decode($result),1));
            $httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
            curl_close($curl);
            if ($httpcode == '200') {
                return true;
            } elseif ($httpcode == '0') {
                return false;
            }
        } catch (Exception $e) {
            /// pass
        }
        return false;
    }


    public function removeOldOpportunities($date = null)
    {
        // return true;
        try {
            $date1 = '';
            $date2 = '';
            if ( $date === null ) {
                if ( !empty($this->file_date) ) {
                    $date = $this->file_date;
                } else {
                    $date = 'now';
                }
                $date1 = date('Y-m-d', strtotime($date.' - 6 years'));
                $date2 = date('Y-m-d', strtotime($date.' - 1 year'));
            }
            if ( !preg_match('/^\d{4}-\d{2}-\d{2}$/',$date1)
                || !preg_match('/^\d{4}-\d{2}-\d{2}$/',$date2) ) {
                return false;
            }
            $data = '{"query":{"bool":{
                "should":[
                    {"range":{"postdate":{"lte":"'.$date1.'"}}},
                    {"bool":{"must":[
                        {"bool":{"should":[
                            {"term":{"type":"SOL"}},
                            {"term":{"type":"PRESOL"}},
                            {"term":{"type":"SRCSGT"}}
                        ]}},
                        {"range":{"postdate":{"lte":"'.$date2.'"}}}
                    ]}}
                ]
            }}}';
            $this->log('FBO Removing opportunities posted before '.$date1.' and '.$date2);
            // $this->log('FBO '.$data);
            $curl = curl_init();
            curl_setopt($curl, CURLOPT_URL, $this->es_host . '/' . $this->es_index . '/' . $this->es_type . '/_delete_by_query' );
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "POST");
            curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
            curl_setopt($curl, CURLOPT_HTTPHEADER,
                ['CONTENT-TYPE: application/json; charset=utf-8']);
            // curl_setopt($curl, CURLOPT_VERBOSE, 1);
            // curl_setopt($curl, CURLOPT_FAILONERROR, true);
            // if ( local AND ssl )
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
            curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
            $result = curl_exec($curl);
            // $this->log(print_r(json_decode($result),1));
            $httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
            curl_close($curl);
            if ($httpcode == '200') {
                return true;
            } elseif ($httpcode == '0') {
                return false;
            }
        } catch (Exception $e) {
            /// pass
        }
        return false;
    }

    public function batchToElasticsearch(&$batch)
    {
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL,
            $this->es_host . '/' . $this->es_index . '/' . $this->es_type . '/_bulk');
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $batch);
        curl_setopt($curl, CURLOPT_HTTPHEADER,
            ['CONTENT-TYPE: application/json; charset=utf-8']);
        // curl_setopt($curl, CURLOPT_VERBOSE, 1);
        // curl_setopt($curl, CURLOPT_FAILONERROR, TRUE);
        // if ( local AND ssl )
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
        // echo $this->es_host.'/'.$this->es_index.'/'.$this->es_type.'/_bulk'."\n";
        // return $result;
        $result = curl_exec($curl);
        // echo "\n". json_decode($result) ."\n";;
        curl_close($curl);
        if ($result) {
            $r = json_decode($result);
            if (!empty($r->errors)) {
                $errors = [];
                foreach ($r->items as $i) {
                    if (isset($i->index) && $i->index->status != 200 && $i->index->status != 201) {
                        $e = [
                            '_id' => $i->index->_id,
                            'status' => $i->index->status,
                        ];
                        if ($i->index->status != 404) {
                            $e['error'] = $i->index->error;
                        }
                        $errors[] = $e;
                    }
                    if (isset($i->update) && $i->update->status != 200 && $i->update->status != 201) {
                        $e = [
                            '_id' => $i->update->_id,
                            'status' => $i->update->status,
                        ];
                        if ($i->update->status != 404) {
                            $e['error'] = $i->update->error;
                        }
                        $errors[] = $e;
                    }
                }
                $r->errors = $errors;
            }
            if (isset($r->items)) {
                $r->items = count($r->items);
            }
            if ($this->commandline) {
                echo "\n".'Elasticsaerch Batch :'.print_r($r, 1)."\n";
            }
            return $r;
        }
        if ($this->commandline) {
            echo "\n".'Elasticsaerch Batch BAD :'.print_r($result, 1)."\n";
        }
        return false;
    }

    public function setupElasticsearch()
    {
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL,
            $this->es_host . '/' . $this->es_index);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "HEAD");
        curl_setopt($curl, CURLOPT_HEADER, true);
        curl_setopt($curl, CURLOPT_NOBODY, true);
        curl_setopt($curl, CURLOPT_HTTPHEADER,
            ['CONTENT-TYPE: application/json; charset=utf-8']);
        // curl_setopt($curl, CURLOPT_VERBOSE, 1);
        // curl_setopt($curl, CURLOPT_FAILONERROR, TRUE);
        // if ( local AND ssl )
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
        // $result = json_decode(curl_exec($curl));
        $result = curl_exec($curl);
        $httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        curl_close($curl);
        if ($httpcode == '200') {
            return true;
        } elseif ($httpcode == '0') {
            return false;
        }
        /* need fielddata:true for es5.5
                "subject" : {
                  "type": "string",
                  "analyzer": "case_insensitive",
                  "fielddata": true
                },
                "desc" : {
                  "type": "string",
                  "analyzer": "case_insensitive",
                  "fielddata": true
                },
        */
        $data = '{
          "settings" : {
              "analysis": {
                    "normalizer": {
                        "case_insensitive": {
                          "type": "custom",
                          "char_filter": [],
                          "filter": ["lowercase"]
                        }
                    },
                    "analyzer": {
                        "case_insensitive": {
                          "type": "custom",
                          "tokenizer": "standard",
                          "filter": ["lowercase"]
                        }
                    }
                   },
               "index" : {
                   "number_of_shards" : 1,
                   "number_of_replicas" : 0
               }
          },
          "mappings": {
            "' . $this->es_type . '": {
              "properties": {
                "setaside" : {
                  "type": "keyword",
                  "normalizer": "case_insensitive",
                  "fields": {
                    "raw" : {
                      "type": "keyword",
                      "index": true
                    }
                  }
                },
                "classcode" : {
                  "type": "keyword",
                  "normalizer": "case_insensitive"
                },
                "classvalue" : {
                  "type": "keyword",
                  "normalizer": "case_insensitive"
                },
                "naics" : {
                  "type": "keyword",
                  "normalizer": "case_insensitive"
                },
                "agency" : {
                  "type": "keyword",
                  "normalizer": "case_insensitive"
                },
                "office" : {
                  "type": "keyword",
                  "normalizer": "case_insensitive"
                },
                "subject" : {
                    "type": "text",
                    "analyzer": "case_insensitive",
                    "fielddata": true
                },
                "desc" : {
                    "type": "text",
                    "analyzer": "case_insensitive"
                },
                "solnbr" : {
                  "type": "keyword",
                  "normalizer": "case_insensitive"
                },
                "naicscode" : {
                  "type": "keyword",
                  "normalizer": "case_insensitive"
                },
                "naicsvalue" : {
                  "type": "keyword",
                  "normalizer": "case_insensitive"
                },
                "responsedate" : {
                  "type": "date",
                  "format": "yyyy-MM-dd"
                },
                "closedate" : {
                  "type": "date",
                  "format": "yyyy-MM-dd"
                },
                "postdate" : {
                  "type": "date",
                  "format": "yyyy-MM-dd"
                },
                "archivedate" : {
                  "type": "date",
                  "format": "yyyy-MM-dd"
                },
                "awarddate" : {
                  "type": "date",
                  "format": "yyyy-MM-dd"
                },
                "state" : {
                  "type": "keyword",
                  "normalizer": "case_insensitive"
                },
                "geoloc" : {
                  "type": "geo_point"
                }
              }
            }
          }
        }';
        // echo "Elasticsearch Creating ".$this->es_host.'/'.$this->es_index."\n";
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL,
            $this->es_host . '/' . $this->es_index);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PUT");
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
        curl_setopt($curl, CURLOPT_HTTPHEADER,
            ['CONTENT-TYPE: application/json; charset=utf-8']);

        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
        $result = json_decode(curl_exec($curl));
        print_r($result);
        exit;

        curl_close($curl);
        if ($result) {
            if (!empty($result->error)) {
                return false;
            } else {
                return json_decode($result);
            }
        }
        return false;
    }

    public function teardownElasticsearch()
    {
        try {
            $curl = curl_init();
            curl_setopt($curl, CURLOPT_URL,
                $this->es_host . '/' . $this->es_index);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "DELETE");
            curl_setopt($curl, CURLOPT_HEADER, true);
            curl_setopt($curl, CURLOPT_HTTPHEADER,
                ['CONTENT-TYPE: application/json; charset=utf-8']);
            // curl_setopt($curl, CURLOPT_VERBOSE, 1);
            // curl_setopt($curl, CURLOPT_FAILONERROR, TRUE);
            // if ( local AND ssl )
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
            curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
            $result = json_decode(curl_exec($curl));
            $httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
            curl_close($curl);
            if ($httpcode == '404'
                || ($httpcode == '200' && !empty($result->acknowledged))
            ) {
                return true;
            } elseif ($httpcode == '0') {
                return false;
            }
        } catch (Exception $e) {
            return false;
        }
        return false;
    }

    public function validateElasticsearch()
    {
        try {
            $curl = curl_init();
            curl_setopt($curl, CURLOPT_URL, $this->es_host);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "HEAD");
            curl_setopt($curl, CURLOPT_HEADER, true);
            curl_setopt($curl, CURLOPT_NOBODY, true);
            curl_setopt($curl, CURLOPT_HTTPHEADER,
                ['CONTENT-TYPE: application/json; charset=utf-8']);
            // curl_setopt($curl, CURLOPT_VERBOSE, 1);
            // curl_setopt($curl, CURLOPT_FAILONERROR, TRUE);
            // if ( local AND ssl )
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
            curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
            // $result = json_decode(curl_exec($curl));
            $result = curl_exec($curl);
            $httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
            curl_close($curl);
            if ($httpcode == '200') {
                return true;
            } elseif ($httpcode == '0') {
                return false;
            }
        } catch (Exception $e) {
            return false;
        }
        return false;
    }

    public function validateElasticsearchIndex()
    {
        try {
            $curl = curl_init();
            curl_setopt($curl, CURLOPT_URL, $this->es_host . '/' . $this->es_index);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "HEAD");
            curl_setopt($curl, CURLOPT_HEADER, true);
            curl_setopt($curl, CURLOPT_NOBODY, true);
            curl_setopt($curl, CURLOPT_HTTPHEADER,
                ['CONTENT-TYPE: application/json; charset=utf-8']);
            // curl_setopt($curl, CURLOPT_VERBOSE, 1);
            // curl_setopt($curl, CURLOPT_FAILONERROR, TRUE);
            // if ( local AND ssl )
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
            curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
            // $result = json_decode(curl_exec($curl));
            $result = curl_exec($curl);
            $httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
            curl_close($curl);
            if ($httpcode == '200') {
                return true;
            } elseif ($httpcode == '0') {
                return false;
            }
        } catch (Exception $e) {
            return false;
        }
        return false;
    }


    public function changeKeyCase(&$a, $c = CASE_LOWER)
    {
        if (is_object($a)) {
            $a = (array)$a;
        }
        $a = array_change_key_case($a, $c);
        foreach ($a as &$v) {
            if (is_array($v) || is_object($v)) {
                $this->changeKeyCase($v);
            }
        }
    }

    public function changeEncoding(&$a)
    {
        foreach ($a as &$v) {
            if (is_string($v)) {
                $v = utf8_encode($v);
            } elseif (is_array($v)) {
                $this->changeEncoding($v);
            }
        }
    }

    public function getNiceSize($bytes, $binaryPrefix = true)
    {
        if ($binaryPrefix) {
            $unit = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'];
            if ($bytes == 0) {
                return '0 ' . $unit[0];
            }
            return @round($bytes / pow(1024, ($i = floor(log($bytes, 1024)))),
                    2) . ' ' . (isset($unit[$i]) ? $unit[$i] : 'B');
        } else {
            $unit = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
            if ($bytes == 0) {
                return '0 ' . $unit[0];
            }
            return @round($bytes / pow(1000, ($i = floor(log($bytes, 1000)))),
                    2) . ' ' . (isset($unit[$i]) ? $unit[$i] : 'B');
        }
    }


    public function startProcess()
    {
        if ($this->commandline) {
            echo "\n";
        }
        $this->log('FBO Import started file='.$this->filename);
        //    if (function_exists('_govopp_register_process')) {
        //        return _govopp_register_process($this->filename);
        //    }
        return null;
    }

    public function touchProcess()
    {
        if ($this->commandline) {
            echo "\n";
        }
        $this->log('FBO Import progress update on file='.$this->filename);
        //    if (function_exists('_govopp_touch_process')) {
        //        return _govopp_touch_process();
        //    }
        return null;
    }

    public function finishProcess()
    {
        if ($this->commandline) {
            echo "\n";
        }
        $this->log('FBO Import finished file='.$this->filename." imported ". $this->y ." of ".$this->z." records");
        //    if (function_exists('_govopp_unregister_process')) {
        //        return _govopp_unregister_process();
        //    }
        return null;
    }

    public function log($msg, $dest = 'php')
    {
        if (function_exists('_govopp_log')) {
            _govopp_log($msg, $dest);
        }
    }
}
