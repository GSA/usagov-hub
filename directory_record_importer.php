<?php
die('Nope nope nope');
$files = array(
    '../../DIRECTORYINFO/usagov_english_titles.xml',
    '../../DIRECTORYINFO/usagov_spanish_titles.xml',
);

$import = new DirectoryRecordImporter();
$import->testRun    = false;
$import->fromXMLFiles($files);

class DirectoryRecordImporter
{
    var $fullReload;
    var $testRun;

    var $federalAgencyRegex;
    var $abbrRegex;
    var $records;
    var $collisions;
    var $users;
    var $russell;
    var $ownersNotFound;
    var $categories;
    var $alphas;
    var $sys_titles;

    public function __construct()
    {
        $this->fullReload = true;
        $this->testRun    = true;
        $this->federalAgencyRegex = '/^\s*(.*?)\s*\(\s*([A-Z]+[a-zA-Z]+|[A-Z \/]+)\s*\)\s*$/';
        $this->abbrRegex          = "/\b(Apt|Ave|Bldg|Blvd|Cir|Ct|Dr|Expy|Jct|Ln|Rte|St|Ste|Tpke)(?!\.)\b/";
        $this->records    = array();
        $this->collisions = array();
        $this->categories = array();
        $this->alphas     = array();
        $this->sys_titles = array();
        $this->findExistingUsersAssoc();
    }

    public function fromXMLFiles( $files )
    {
        if ( $this->fullReload )
        {
            $this->deleteAllDirectoryRecords();
        }
        foreach ( $files as $file )
        {
            echo "Loading XML File: $file\n";
            $xml = simplexml_load_file($file);
            /// grab from xml file

            /// loop once to prep for reports
            foreach ( $xml as $contact )
            {
                $this->checkNameCollision( $contact );
            }

            /// loop once to prep for reports - must run after checkNameCollision
            foreach ( $xml as $contact )
            {
                $this->checkUniqueCollision( $contact );
            }

            /// loop another time to do parameter mapping
            foreach ( $xml as $contact )
            {
                // if ( (string)$contact->Id != '208089' ) { continue; }
                $category = $this->filterCategory(trim((string)$contact->Category));

                if ( empty($category) || $category=='None' )
                {
                    continue;
                }
                if ( !empty($records[(string)$contact->Id]) )
                {
                    continue;
                }

                $existing = $this->findExistingDirectoryRecord( $contact );
                if ( $existing )
                {
                    // if ( $exiting['meta']->nid->value != '208089' ) { continue; }

                    $this->setMetaFromContact( $existing['meta'], $contact );
                    if ( ! $this->testRun )
                    {
                        $existing['meta']->save();
                    }

                    $this->records[(string)$contact->Id] = array( 'contact'=>$contact, 'record'=>$existing );

                    echo ':'; flush();
                } else {
                    $record = $this->createDirectoryRecord( $contact );
                    if ( $record )
                    {
                        $this->records[(string)$contact->Id] = array( 'contact'=>$contact, 'record'=>$record );
                        echo '.'; flush();


                        /// add misising english state goverment records
                        if ( $category == 'State Government Agencies'
                            && trim((string)$contact->Language) == 'es' )
                        {
                            if ( !empty($records[(string)$contact->Id.'EN']) )
                            {
                                continue;
                            }
                            /// basic field mappings
                            $contact->Language  = 'en';
                            if ( isset($contact->English_Translation_Name) )
                            {
                                $contact->Name = $contact->English_Translation_Name;
                            }
                            $en_record = $this->createDirectoryRecord( $contact );
                            if ( $en_record )
                            {
                                echo ';'; flush();
                                $this->records[(string)$contact->Id.'EN'] = array( 'contact'=>$contact, 'record'=>$en_record );
                            }
                        }

                        continue;
                    }
                    echo "Error   : {$contact->Name} \n";
                }
            }
            echo "\n";
        }
        $this->setRelations();
        $this->nameCollisionReport();
        $this->alphaReport();
        //$this->sysTitleReport();
        $this->categoryReport();
        $this->uniqueReport();
    }

    public function findExistingUsersAssoc()
    {
        $this->users = db_select('users', 'u')
                        ->fields('u', array('mail','uid'))
                        ->execute()
                        ->fetchAllAssoc('mail');
        if ( !empty($this->users['russell.oneill']) )
        {
            $this->russell =& $this->users['russell.oneill'];
        }
        if ( !empty($this->users['russell.oneill@gsa.gov']) )
        {
            $this->russell =& $this->users['russell.oneill@gsa.gov'];
        }
    }
    public function deleteAllDirectoryRecords()
    {
        if ( $this->testRun ) { return 0; }
        $results = db_select('node', 'n')
              ->fields('n', array('nid'))
              ->condition('type', 'directory_record_content_type')
              ->execute();
        $nids = [];
        foreach ($results as $result)
        {
            $nids[] = $result->nid;
        }
        echo "\nDeleting ".count($nids)." directory records\n";
        if (!empty($nids))
        {
            node_delete_multiple($nids);
        }
        return count($nids);
    }
    public function findExistingDirectoryRecord( $contact )
    {
        $query = new EntityFieldQuery();
        $result = $query->entityCondition('entity_type', 'node')
            ->entityCondition('bundle', 'directory_record_content_type')
            ->propertyCondition('title', $this->filterTitle($contact) )
            ->fieldCondition('field_directory_type', 'value', $this->filterCategory(trim((string)$contact->Category)) )
            ->propertyOrderBy('created','DESC')
            ->execute();
        if ( isset($result['node']) && count($result['node'])>0 )
        {
            $nids = array_keys( $result['node'] );
            $entities = entity_load('node', [$nids[0]] );
            if ( count($entities)>0 )
            {
                $meta = entity_metadata_wrapper('node',array_shift($entities));
                return array( 'entity'=>&$entities[0], 'meta'=>&$meta );
            }
        }
        return null;
    }

    public function setRelations()
    {
        echo "Setting Parent/Child Relations\n";
        if ( $this->testRun ) { return; }
        /// build parent/child relations
        foreach ( $this->records as $record )
        {
            if ( empty($record['contact']->Parent) || empty($record['contact']->Parent->Id) )
            {
                echo "_";
                continue;
            }
            $cpid = (string)$record['contact']->Parent->Id;
            if ( empty($cpid) )
            {
                echo "-";
                continue;
            }
            if ( $cpid==$record['contact']->Id )
            {
                echo "(=$cpid)";
                continue;
            }
            if ( ! isset($this->records[$cpid]) )
            {
                echo "(!$cpid,{$record['contact']->Id})";
                continue;
            }

            if ( !empty($record['record']['meta']) && $record['record']['meta']->__isset('relation_relation_languages_toggle_node')
              && !empty($record['record']['meta']->relation_relation_languages_toggle_node->value()) )
            {
                echo "~";
                continue; /// already set
            }

            if ( !empty($record['record']['meta'])
              && $record['record']['meta']->getIdentifier() == $this->records[$cpid]['record']['meta']->getIdentifier() )
            {
                echo "(==".$record['record']['meta']->getIdentifier().")";
                continue;
            }
            $endpoints = array(
                array('entity_type' => 'node', 'entity_id' => $record['record']['meta']->getIdentifier() ),
                array('entity_type' => 'node', 'entity_id' => $this->records[$cpid]['record']['meta']->getIdentifier() )
            );
            $rid = null;
            try {
                if ( $rids = relation_relation_exists($endpoints, 'relation_parent_record') )
                {
                    echo "#".count($rids);
                } else {
                    $rid = relation_insert( 'relation_parent_record', $endpoints );
                    echo "+$rid";
                }
            } catch ( Exception $e ) {
                print_r([$record['record']['meta']->getIdentifier(),$this->records[$cpid]['record']['meta']->getIdentifier(),$rid]);
                die('Exception');
            }
        }
        echo "\nDone Parent/Child\n";

        /// language toggles
        echo "Setting Language Toggles\n";
        foreach ( $this->records as $record )
        {
            if ( empty($record['contact']->Alt_Language) )
            {
                echo "_";
                continue;
            }
            foreach ( $record['contact']->Alt_Language as $l )
            {
                $clid = (string)$l->Id;
                if ( empty($clid) )
                {
                    echo "-";
                    continue;
                }
                if ( $clid==$record['contact']->Id )
                {
                    echo "(=:$cpid)";
                    continue;
                }
                if ( ! isset($this->records[$clid]) )
                {
                    echo "(!$clid,{$record['contact']->Id})";
                    continue;
                }
                if ( $record['record']['meta']->__isset('relation_relation_languages_toggle_node')
                    && !empty($record['record']['meta']->relation_relation_languages_toggle_node->value()) )
                {
                    echo "~";
                    continue; /// already set
                }
                $endpoints = null;

                if ( $l->Language == 'es' )
                {
                    $endpoints = array(
                        array('entity_type' => 'node', 'entity_id' => $record['record']['meta']->getIdentifier() ),              # ENGLISH SIDE
                        array('entity_type' => 'node', 'entity_id' => $this->records[$clid]['record']['meta']->getIdentifier() ) # SPANISH SIDE
                    );
                } else if ( $l->Language == 'en' ) {
                    $endpoints = array(
                        array('entity_type' => 'node', 'entity_id' => $this->records[$clid]['record']['meta']->getIdentifier() ), # ENGLISH SIDE
                        array('entity_type' => 'node', 'entity_id' => $record['record']['meta']->getIdentifier() )                # SPANISH SIDE
                    );
                }
                if ( empty($endpoints) )
                {
                    echo "*";
                    continue;
                }
                try {
                    if ( $rids = relation_relation_exists($endpoints, 'relation_languages_toggle') )
                    {
                        echo "#".count($rids);
                    } else {
                        $rid = relation_insert( 'relation_languages_toggle', $endpoints );
                        echo "+$rid";
                    }
                } catch ( Exception $e ) {
                    print_r([$record['record']['meta']->getIdentifier(),$this->records[$cpid]['record']['meta']->getIdentifier(),$rid]);
                    die('Exception');
                }
            }
        }
        echo "\nDone Language Toggles\n";
    }

    public function createDirectoryRecord( $contact )
    {
        $values = array(
            'type'     => 'directory_record_content_type',
            'uid'      => 1,
            'status'   => 1,
            'comment'  => 1,
            'promote'  => 0,
        );

        $entity = entity_create('node', $values);
        $meta   = entity_metadata_wrapper('node',$entity);

        $this->setMetaFromContact( $meta, $contact );

        if ( ! $this->testRun )
        {
            $meta->save();
        }

        return array( 'entity'=>&$entity, 'meta'=>&$meta );
    }

    public function setMetaFromContact( &$meta, $contact )
    {
        $meta->language->set(               trim(strtolower((string)$contact->Language)) );
        $meta->title->set(                  html_entity_decode($this->filterTitle($contact)) );
        $meta->field_acronym->set(          html_entity_decode($this->filterAcronym($contact)) );
        $meta->field_description->set(      $this->abbr(trim((string)$contact->Description)) );
        $meta->field_email->set(            trim((string)$contact->Email) );
        $meta->field_street_1->set(         $this->abbr(trim((string)$contact->Street1)) );
        $meta->field_street_2->set(         $this->abbr(trim((string)$contact->Street2)) );
        $meta->field_city->set(             trim((string)$contact->City) );
        $meta->field_state->set(            trim((string)$contact->StateTer) );
        $meta->field_zip->set(              trim((string)$contact->Zip) );
        $meta->field_language->set(         $this->filterLanguage(trim((string)$contact->Language)) );
        $meta->field_phone_number->set(     $this->filterList($contact->Phone) );
        $meta->field_toll_free_number->set( $this->filterList($contact->Tollfree) );
        $meta->field_tty_number->set(       $this->filterList($contact->TTY) ); 
        $meta->field_synonym->set(          $this->filterList($contact->Synonym) ); 
        $meta->field_contact_links->set(    array("value"=>$this->listifyLinks( $contact->Contact_Url   ), "format"=>"filtered_html" ) );
        $meta->field_in_person_links->set(  array("value"=>$this->listifyLinks( $contact->In_Person_Url ), "format"=>"filtered_html" ) );
        $meta->field_website_links->set(    array("value"=>$this->listifyLinks( $contact->Web_Url       ), "format"=>"filtered_html" ) );

        $meta->field_cfo_agency->set(        trim((string)$contact->CFO_Agency) );
        $meta->field_government_branch->set( $this->filterBranch(trim((string)$contact->Fed_Branch)) );
        $meta->field_subdivision->set(       trim((string)$contact->Subdivision) );

        $meta->field_directory_type->set(   $this->filterCategory(trim((string)$contact->Category)) );
        $meta->field_alpha_order_name->set( trim((string)$contact->Alphaordername) );

        $meta->field_show_on_az_index->set( $this->filterAZIndex(trim((string)$contact->ShowOnFederalAZIndex)) );
        $meta->field_group_by->set(         trim((string)$contact->Groupby) );
        $meta->field_donated_money->set(    $this->filterDonatedMoney(trim((string)$contact->Donated_Money)) );
        $meta->field_for_use_by_text->set(  $this->filterForUseBy($contact) );
        $meta->field_scoap_member->set(     $this->filterSocapMember(trim((string)$contact->SOCAP_Member)) );
        $meta->field_comments->set(         trim((string)$contact->Comments) );

        $meta->field_owner->set(  $this->filterOwner((string)$contact->Page_Owner) );
    }

    public function abbr( $value )
    {
        return preg_replace( $this->abbrRegex, '$1.', $value );
    }

    /// FILTERS

    public function filterList( $fields )
    {
        $list = array();
        foreach ( $fields as $field )
        {
            $list[] = trim((string)$field);
        }
        return $list;
    }
    public function filterCategory ( $category )
    {
        if ( in_array($category, array(
    		 'Better Business Bureau'
    		,'Car Manufacturer'
    		,'Consumer Organization' 
    		,'Corporation'
    		,'Government Consumer Protection Office'
    		,'Trade Association'
    		,'State Utility Commission'
    		,'State Insurance Regulator'
    		,'State Securities Administrator')) )
	    {
	    	return $category.'s';	
        }
        if ( $category == 'State Government Agency' )
    	{
    		return 'State Government Agencies';
	    }
        if ( $category == 'Federal Agency' )
    	{
    		return 'Federal Agencies';
	    }
        if ( $category == 'State DMV' )
	    {
    		return 'State DMVs';
    	}
        if ( $category == 'State Banking Authority')
	    {
	    	return 'State Banking Authorities';
        }	
        return $category;
    }
    public function filterOwner( $page_owner )
    {
        /// try owner directly as email
        if ( !empty($this->users[$page_owner]) )
        {
            return $this->users[$page_owner];
        }

        /// try and force email
        if ( !empty($this->users[$page_owner.'@gsa.gov']) )
        {
            return $this->users[$page_owner.'@gsa.gov'];
        }

        /// log not-found for this owner
        if ( !isset($this->ownerNotFound[$page_owner]) )
        {
            $this->ownerNotFound[$page_owner] = 0;
        }
        $this->ownerNotFound[$page_owner]++;

        /// give to russell
        if ( !empty($this->russell) )
        {
            return $this->russell;
        }
        // ok fine, give to admin
        return 1;
    }
    public function filterSocapMember( $socap_member )
    {
        if ( strtolower($socap_member) == 'n' ) { return 'No'; }
        if ( strtolower($socap_member) == 'y' ) { return 'Yes'; }
        return 'No';
    }
    public function filterAZIndex( $index )
    {
        if ( strtolower($index) == 'n' ) { return 'No'; }
        if ( strtolower($index) == 'y' ) { return 'Yes'; }
        return 'No';
    }
    public function filterDonatedMoney( $donatedMoney )
    {
        if ( strtolower($donatedMoney) == 'n' ) { return 'No'; }
        if ( strtolower($donatedMoney) == 'y' ) { return 'Yes'; }
        return 'N/A';
    }
    public function filterForUseBy( $contact )
    {
        $category = $this->filterCategory(trim((string)$contact->Category));
        $forUseBy = trim((string)$contact->RecordUse);
        $language = trim((string)$contact->Language);

        if ( empty($category) || $category=='None' )
        {
            return [];
        }

        if ( in_array($category,['Better Business Bureaus']) )
        {
            return ['Print CAH','Contact Center'];
        }

        if ( in_array($category,['Car Manufacturers',
                                 'Corporations',
                                 'Trade Associations']) )
        {
            return ['Print CAH'];
        }

        if ( in_array($category,['Consumer Organizations']) )
        {
            if ( $language == 'en' )
            {
                return ['Print CAH'];
            } else if ( $language == 'es' ) {
                return ['Print Guia'];
            }
        }

        if ( in_array($category,['Federal Agencies']) )
        {
            if ( $language == 'en' )
            {
                if ( $forUseBy == 'Print Only' )
                {
                    return ['Print CAH','Contact Center'];
                } else if ( $forUseBy == 'Web Only' ) {
                    return ['USA.gov','Contact Center'];
                } else if ( $forUseBy == 'Both' ) {
                    return ['USA.gov','Print CAH','Contact Center'];
                }
            } else if ( $language == 'es' ) {
                if ( $forUseBy == 'Print Only' )
                {
                    return ['Print Guia','Contact Center'];
                } else if ( $forUseBy == 'Web Only' ) {
                    return ['GobiernoUsa.gov','Contact Center'];
                } else if ( $forUseBy == 'Both' ) {
                    return ['GobiernoUsa.gov','Print Guia','Contact Center'];
                }
            }
        }

        if ( in_array($category,['Government Consumer Protection Offices',
                                 'State Banking Authorities',
                                 'State Insurance Regulators',
                                 'State Securities Administrators',
                                 'State Utility Commissions']) )
        {
            if ( $language == 'en' )
            {
                return ['USA.gov','Print CAH','Contact Center'];
            } else if ( $language == 'es' ) {
                return ['GobiernoUsa.gov','Print Guia','Contact Center'];
            }
        }

        if ( in_array($category,['State Government Agencies']) )
        {
            if ( $language == 'en' )
            {
                return ['USA.gov','Contact Center'];
            } else if ( $language == 'es' ) {
                return ['GobiernoUSA.gov','Contact Center'];
            }
        }

        return [];
    }
    public function filterAcronym( $contact )
    {
        $category = $this->filterCategory(trim((string)$contact->Category));
        if ( $category == 'Federal Agencies' )
        {
            $name = trim((string)$contact->Name);
            $matches = array();
            preg_match($this->federalAgencyRegex,$name,$matches);
            if ( !empty($matches[2]) )
            {
                return $matches[2];
            }
        }
        return '';
    }
    public function filterTitle( $contact )
    {
        $category = $this->filterCategory(trim((string)$contact->Category));
        $name     = trim((string)$contact->Name);

        /// strip off acronym
        if ( $category == 'Federal Agencies' )
        {
            $matches = array();
            preg_match($this->federalAgencyRegex,$name,$matches);
            if ( !empty($matches[2]) )
            {
                $name = $matches[1];
            }
        }

        if ( in_array($category,['Corporations','Federal Agencies']) )
        {
            return $name;
        }

        /// not Corporations - not Federal Agency

        $sys_title     = isset($contact->Sys_Title)     ? trim((string)$contact->Sys_Title)     : '';
        $display_title = isset($contact->Display_Title) ? trim((string)$contact->Display_Title) : '';

        /// if the name is a duplicate
        if ( !empty($this->collisions['name'][$name]) )
        {
            /// try sys_title
            if ( !empty($sys_title) )
            {
                /// remove id from tail
                $clean_sys_title = preg_replace('/\[\#\d+\]$/','',$sys_title);
                /// clean up city state
                $clean_sys_title = preg_replace('/\-([^\-]+)\-([^\-]+)$/',', $1, $2',$clean_sys_title);
                if ( !empty($clean_sys_title) )
                {
                    return $clean_sys_title;
                }
            /// maybe there is a display_title?
            } else if ( !empty($display_title) ) {
                return $display_title;
            }
        }
        return $name;
    }
    public function filterLanguage( $lang )
    {
        if ( strtolower($lang) == 'es' ) { return 'Spanish'; }
        if ( strtolower($lang) == 'en' ) { return 'English'; }
        return $lang;
     }
    public function filterBranch( $branch )
    {
        if ( $branch == 'EXEC' ) { return 'Executive'; }
        if ( $branch == 'JUD'  ) { return 'Judicial'; }
        if ( $branch == 'LEG'  ) { return 'Legislative'; }
        return $branch;
    }
    public function listifyLinks( $links )
    {
        $list = "";
        foreach ( $links as $link )
        {
            $description = $this->abbr($link->Description);
            $list .= "<li><a href=\"{$link->Url}\">{$description}</a></li>";
        }
        return !empty($list) ? "<ul>{$list}</ul>" : "";
    }

    //// reports

    public function checkUniqueCollision( $contact )
    {
        $category = $this->filterCategory(trim((string)$contact->Category));
        $title = html_entity_decode($this->filterTitle($contact));

        $uniq = $title . $category;

        if ( !empty($uniq) && empty($this->uniqs[$uniq]) )
        {
            $this->uniqs[$uniq] = array( 'contacts'=>[], 'count'=>0 );
        }
        $this->uniqs[$uniq]['count']++;
        $this->uniqs[$uniq]['contacts'][] = $contact;
    }
    public function checkNameCollision( $contact )
    {
        $category      = $this->filterCategory(trim((string)$contact->Category));
        $name          = trim((string)$contact->Name);
        $alpha         = trim((string)$contact->Alphaordername);
        $display_title = isset($contact->Display_Title) ? trim((string)$contact->Display_Title) : '';
        $sys_title     = isset($contact->Sys_Title)     ? trim((string)$contact->Sys_Title)     : '';

        if ( !empty($category) && empty($this->categories[$category]) )
        {
            $this->categories[$category] = 0;
        }
        $this->categories[$category]++;

        if ( $category == 'Federal Agencies' )
        {
            if ( !empty($alpha) && empty($this->alphas[$alpha]) )
            {
                $this->alphas[$alpha] = array( 'contacts'=>[], 'count'=>0 );
            }
            $this->alphas[$alpha]['count']++;
            $this->alphas[$alpha]['contacts'][] = $contact;

        }

        /** /
        if ( !empty($sys_title) && empty($this->sys_titles[$sys_title]) )
        {
            $this->sys_titles[$sys_title] = array( 'contacts'=>[], 'count'=>0 );
        }
        $this->sys_titles[$sys_title]['count']++;
        $this->sys_titles[$sys_title]['contacts'][] = $contact;
        /**/

        if (isset($this->collisions['name'][$name]))
        {
            $this->collisions['name'][$name]++;

            if ( !isset($this->collisions['category'][$category]) )
            {
                $this->collisions['category'][$category] = array(
                    'count' => array(
                        'name'    => 0,
                        'display' => 0,
                        'sys'     => 0,
                    ),
                    'value' => array(
                        'name'    => array(),
                        'display' => array(),
                        'sys'     => array(),
                    )
                );
            }

            if (isset($this->collisions['category'][$category]['value']['name'][$name]))
            {
                $this->collisions['category'][$category]['count']['name']++;
                $this->collisions['category'][$category]['value']['name'][$name]++;
            } else {
                $this->collisions['category'][$category]['value']['name'][$name] = 0;
            }

            if ( !empty($display_title) )
            {
                if (isset($this->collisions['category'][$category]['value']['display'][$display_title]))
                {
                    $this->collisions['category'][$category]['count']['display']++;
                    $this->collisions['category'][$category]['value']['display'][$display_title]++;
                } else {
                    $this->collisions['category'][$category]['value']['display'][$display_title] = 0;
                }
            }

            if ( !empty($sys_title) )
            {
                if (isset($this->collisions['category'][$category]['value']['sys'][$sys_title]))
                {
                    $this->collisions['category'][$category]['count']['sys']++;
                    $this->collisions['category'][$category]['value']['sys'][$sys_title]++;
                } else {
                    $this->collisions['category'][$category]['value']['sys'][$sys_title] = 0;
                }
            }

        } else {
            $this->collisions['name'][$name] = 0;
        }

    }

    public function nameCollisionReport()
    {
        echo "\nCATEGORY COLLISION REPORT:\n";
        foreach ( $this->collisions['category'] as $category => $category_data )
        {
            if ( $category_data['count']['name'] > 1 )
            {
                asort($category_data['value']['name']);
                #asort($category_data['value']['display']);
                #asort($category_data['value']['sys']);
                echo "    category: {$category}\n";
                echo "        name collisions:      {$category_data['count']['name']}\n";
                foreach ( $category_data['value']['name'] as $name=>$count )
                {
                    if ( $count < 1 ) { continue; }
                    echo "          ". str_pad($count,4,' ',STR_PAD_LEFT) ." : $name\n";
                }
                if ( $category_data['count']['display'] )
                {
                    echo "        name + display_title: {$category_data['count']['display']}\n";
                }
                if ( $category_data['count']['sys'] )
                {
                    echo "        name + sys_title:     {$category_data['count']['sys']}\n";
                }
            }
            echo "\n";
        }
    }
    public function categoryReport()
    {
        echo "\nCATEGORY REPORT:\n";
        foreach ( $this->categories as $category => $category_count )
        {
            echo "    category: ". str_pad($category_count,5,' ',STR_PAD_LEFT) ." : {$category}\n";
        }
    }
    public function alphaReport()
    {
        echo "\nALPHA-NAME-ORDER COLLISION REPORT:\n";
        foreach ( $this->alphas as $alpha => $data )
        {
            if ( $data['count'] > 1 )
            {
                echo "\n    ". str_pad($data['count'],3,' ',STR_PAD_RIGHT) ." : {$alpha}\n";
                foreach ( $data['contacts'] as $contact )
                {

                    echo "\n        Name : ". (string)$contact->Name           ."\n".
                         "            alphaordername = ". (string)$contact->Alphaordername ."\n".
                         "            sys_title      = ". (string)$contact->Sys_Title      ."\n";
                }
            }
        }
    }
    public function sysTitleReport()
    {
        echo "\nSYS-TITLE COLLISION REPORT:\n";
        foreach ( $this->sys_titles as $sys_title => $data )
        {
            if ( $data['count'] > 1 )
            {
                echo "\n        Sys_Title : ". str_pad($data['count'],3,' ',STR_PAD_RIGHT) ." ". (string)$contact->Sys_Title ."\n";
                foreach ( $data['contacts'] as $contact )
                {
                    echo "                 ID:". (string)$contact->Id ." ". $this->filterCategory((string)$contact->Category) ."\n";
                }
            }
        }
    }
    public function uniqueReport()
    {
        echo "\nUNIQUE COLLISION REPORT:\n";
        foreach ( $this->uniqs as $uniq => $data )
        {
            if ( $data['count'] > 1 )
            {
                echo "\n        Sys_Title : ". str_pad($data['count'],3,' ',STR_PAD_RIGHT) ." ". $uniq ."\n";
                foreach ( $data['contacts'] as $contact )
                {
                    echo "                 ID:". (string)$contact->Id ." ". $this->filterCategory((string)$contact->Category) ."\n";
                }
            }
        }
    }
}
