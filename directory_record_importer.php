<?php
die('Nope nope nope');
$files = array(
    '../../DIRECTORYINFO/usagov_english_titles.xml',
    '../../DIRECTORYINFO/usagov_spanish_titles.xml',
);

$import = new DirectoryRecordImporter();
$import->deleteAllDirectoryRecords();
$import->fromXMLFiles($files);

class DirectoryRecordImporter
{
    var $records;
    var $collisions;

    public function __construct()
    {
        $this->records = array();
        $this->collisions = array();
        $this->fix_collisions_in_categories = array('Better Business Bureau');
    }

    public function fromXMLFiles( $files )
    {
        foreach ( $files as $file )
        {
            echo "Loading XML File: $file\n";
            $xml = simplexml_load_file($file);
            /// grab from xml file

            /// loop once to prep for name collisions
            foreach ( $xml as $contact )
            {
                $category = trim((string)$contact->Category);
                if ( empty($category) || $category=='None' )
                {
                    continue;
                }
                $this->checkNameCollision( $contact );
            }

            /// loop a second time to do parameter mapping
            foreach ( $xml as $contact )
            {
                $category = trim((string)$contact->Category);
                if ( empty($category) || $category=='None' )
                {
                    continue;
                }
                if ( !empty($records[(string)$contact->Id]) )
                {
                    #echo "Dupe    : {$contact->Id} {$contact->Name} \n";
                    continue;
                }

                #$existing = $this->findExistingDirectoryRecord( $contact );
                #if ( $existing )
                #{
                #    #echo "Exists  : {$contact->Name} \n";
                #    $existing['contact'] = $contact;
                #    $this->records[(string)$contact->Id] = array( 'contact'=>$contact, 'record'=>$existing );
                #    continue;
                #}

                $record = $this->saveDirectoryRecord( $contact );
                if ( $record )
                {
                    #echo "Created : ". (string)$record['meta']->Name ." \n";
                    $this->records[(string)$contact->Id] = array( 'contact'=>$contact, 'record'=>$record );

                    /// add misising english state goverment records
                    if ( $category == 'State Government Agencies'
                      && trim((string)$contact->Language) == 'es' )
                     {
                        if ( !empty($records[(string)$contact->Id.'EN']) )
                        {
                            #echo "Dupe    : {$contact->Id} {$contact->Name} \n";
                            continue;
                        }
                        /// basic field mappings
                        $contact->Language  = 'en';
                        if ( isset($contact->English_Translation_Name) )
                        {
                            $contact->Name = $contact->English_Translation_Name;
                        }
                        $en_record = $this->saveDirectoryRecord( $contact );
                        if ( $en_record )
                        {
                            #echo "Created : ".(string)$en_record['meta']->Title ." \n";
                            $this->records[(string)$contact->Id.'EN'] = array( 'contact'=>$contact, 'record'=>$en_record );
                        }
                    }
                    continue;
                }

                #echo "Error   : {$contact->Name} \n";

            }

        }
        $this->setRelations();
        $this->nameCollisionReport();

    }

    public function deleteAllDirectoryRecords()
    {
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
    }

    public function findExistingDirectoryRecord( $contact )
    {
        $query = new EntityFieldQuery();
        $result = $query->entityCondition('entity_type', 'node')
            ->entityCondition('bundle', 'directory_record_content_type')
            ->propertyCondition('title', $contact->Name )
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

    public function checkNameCollision( $contact )
    {
        $category      = trim((string)$contact->Category);
        $name          = trim((string)$contact->Name);
        $display_title = isset($contact->Display_Title) ? trim((string)$contact->Display_Title) : '';
        $sys_title     = isset($contact->Sys_Title)     ? trim((string)$contact->Sys_Title)     : '';

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
        foreach ( $this->collisions['category'] as $category => $category_data )
        {
            if ( $category_data['count']['name'] > 1 )
            {
                asort($category_data['value']['name']);
                #asort($category_data['value']['display']);
                #asort($category_data['value']['sys']);
                echo "Category: {$category}\n";
                echo "  name collisions:      {$category_data['count']['name']}\n";
                foreach ( $category_data['value']['name'] as $name=>$count )
                {
                    if ( $count < 1 ) { continue; }
                    echo "    ". str_pad($count,4,' ',STR_PAD_LEFT) ." : $name\n";
                }
                if ( $category_data['count']['display'] )
                {
                    echo "  name + display_title: {$category_data['count']['display']}\n";
                }
                if ( $category_data['count']['sys'] )
                {
                    echo "  name + sys_title:     {$category_data['count']['sys']}\n";
                }
                echo "\n";
            }
        }
    }

    public function setRelations()
    {
        echo "Setting Parent/Child Relations\n";
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

    public function saveDirectoryRecord( $contact )
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

        $meta->language(trim((string)$contact->Language));

        //$meta->title->set( (trim((string)$contact->Category)=='Better Business Buerau') ? (string)$contact->Sys_Title : (string)$contact->Name );
        $meta->title->set( html_entity_decode($this->filterTitle($contact)) );
        $meta->field_description->set( trim((string)$contact->Description) );
        $meta->field_email->set(       trim((string)$contact->Email) );
        $meta->field_street_1->set( trim((string)$contact->Street1) );
        $meta->field_street_2->set( trim((string)$contact->Street2) );
        $meta->field_city->set(  trim((string)$contact->City) );
        $meta->field_state->set( trim((string)$contact->StateTer) );
        $meta->field_zip->set(   trim((string)$contact->Zip) );
        $meta->field_language->set( $this->filterLanguage(trim((string)$contact->Language)) );
        $meta->field_phone_number->set(     [trim((string)$contact->Phone)] );
        $meta->field_toll_free_number->set( [trim((string)$contact->Tollfree)] );
        $meta->field_tty_number->set(       [trim((string)$contact->TTY)] );
        $meta->field_contact_links->set(   array("value"=>$this->listifyLinks( $contact->Contact_Url )) );
        $meta->field_in_person_links->set( array("value"=>$this->listifyLinks( $contact->In_Person_Url )) );
        $meta->field_website_links->set(   array("value"=>$this->listifyLinks( $contact->Web_Url )) );

        $meta->field_cfo_agency->set( trim((string)$contact->CFO_Agency) );
        $meta->field_government_branch->set( $this->filterBranch(trim((string)$contact->Fed_Branch)) );

        $meta->field_directory_type->set(   trim((string)$contact->Category) );
        $meta->field_alpha_order_name->set( $this->filterTitle($contact) );

        $meta->field_show_on_az_index->set( $this->filterAZIndex(trim((string)$contact->ShowOnFederalAZIndex)) );
        $meta->field_group_by->set( trim((string)$contact->Groupby) );
        $meta->field_donated_money->set( $this->filterDonatedMoney(trim((string)$contact->Donated_Money)) );
        $meta->field_for_use_by_text->set( $this->filterForUseBy($contact) );

        $meta->save();

        return array( 'entity'=>&$entity, 'meta'=>&$meta );
    }

    /// FILTERS

    public function filterAZIndex( $index )
    {
        if ( $index == 'N' ) { return 'No'; }
        if ( $index == 'Y' ) { return 'Yes'; }
        return 'N';
    }

    public function filterDonatedMoney( $donatedMoney )
    {
        if ( $donatedMoney == 'N' ) { return 'No'; }
        if ( $donatedMoney == 'Y' ) { return 'Yes'; }
        return 'N/A';
    }

    public function filterForUseBy( $contact )
    {
        $category = trim((string)$contact->Category);
        $forUseBy = trim((string)$contact->RecordUse);
        $language = trim((string)$contact->Language);

        if ( empty($category) || $category=='None' )
        {
            return [];
        }

        if ( in_array($category,['Better Business Bureau']) )
        {
            return ['Print CAH','Contact Center'];
        }

        if ( in_array($category,['Car Manufacturer',
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

        if ( in_array($category,['Federal Agency']) )
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

        if ( in_array($category,['Government Consumer Protection Office',
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

        return [$forUseBy];
    }

    public function filterTitle( $contact )
    {
        $category      = trim((string)$contact->Category);
        $name          = trim((string)$contact->Name);

        if ( !in_array($category,$this->fix_collisions_in_categories) )
        {
            return $name;
        }

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
        if ( $lang == 'es' ) { return 'Spanish'; }
        if ( $lang == 'en' ) { return 'English'; }
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
            $list .= "<li><a href=\"{$link->Url}\">{$link->Description}</a></li>";
        }
        return !empty($list) ? "<ul>{$list}</ul>" : "";
    }

}
