<?php

$files = array(
    '../../DIRECTORYINFO/usagov_english_titles.xml',
    '../../DIRECTORYINFO/usagov_spanish_titles.xml',
);

$import = new DirectoryRecordImporter();
$import->fromXMLFiles($files);

class DirectoryRecordImporter 
{
    var $records = array();
    var $collisions = array();

    public function __construct()
    {
    }

    public function save()
    {
        echo "\nSaving\n";
        foreach ( $this->records as $record )
        {
            echo ".";
            $record['meta']->save();
        }
        echo "\nDone Saving\n";
    }

    public function fromXMLFiles( $files )
    {
        foreach ( $files as $file )
        {
            echo "Loading XML File: $file\n";
            $xml = simplexml_load_file($file);
            /// grab from xml file
            foreach ( $xml as $contact )
            {
                if ( !empty($records[(string)$contact->Id]) )
                {
                    echo "Dupe    : {$contact->Id} {$contact->Name} \n";
                    /*
                    if ( $contact->Name === $records[(string)$contact->Id]['contact']->Name )
                    {
                        echo "Dupe    : {$contact->Name} \n";
                    } else {
                        echo "Collide : {$contact->Name} != ". (string)$records[(string)$contact->Id]['contact']->Name ."\n";
                    }
                    */
                    continue;
                }

                $this->checkNameCollision( $contact );

                $existing = $this->findExistingDirectoryRecord( $contact );
                if ( $existing )
                {
                    #echo "Exists  : {$contact->Name} \n";
                    $existing['contact'] = $contact;
                    $this->records[(string)$contact->Id] = $existing;
                    continue;
                }

                $record = $this->createDirectoryRecord( $contact );
                if ( $record ) 
                {
                    #echo "Created : {$contact->Name} \n";
                    $this->records[(string)$contact->Id] = array( 'contact'=>$contact, 'record'=>$existing );
                    continue;
                }
                echo "Error   : {$contact->Name} \n";

            }
        }
        //$this->setRelations();
        //$this->save();
print_r($this->collisioans['category']);
asort($this->collisions['name']);
foreach ( $this->collisions['name'] as $n=>$c )
{
    if ( $c > 1 ) { echo $c .' > '. $n ."\n"; }
}

    } 

    public function checkNameCollision( $contact )
    {
        $category      = trim((string)$contact->Category);
        $name          = trim((string)$contact->Name);
        $sys_title     = isset($contact->Sys_Title)     ? trim((string)$contact->Sys_Title)     : '';
        $display_title = isset($contact->Display_Title) ? trim((string)$contact->Display_Title) : '';

        if (!empty($this->collisions['name'][$name])) 
        {
            $this->collisions['category'][$category]++;
            $this->collisions['name'][$name]++;
        } else {
            $this->collisions['name'][$name] = 1;
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
            if ( $record['meta']->__isset('relation_relation_languages_toggle_node')  
              && !empty($record['meta']->relation_relation_languages_toggle_node->value()) ) 
            {
                echo "~";
                continue; /// already set
            }
            if ( $record['meta']->getIdentifier() == $this->records[$cpid]['meta']->getIdentifier() )
            {
                echo "(==".$record['meta']->getIdentifier().")";
                continue;
            }
            $endpoints = array(
                array('entity_type' => 'node', 'entity_id' => $record['meta']->getIdentifier() ),
                array('entity_type' => 'node', 'entity_id' => $this->records[$cpid]['meta']->getIdentifier() )
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
                print_r([$record['meta']->getIdentifier(),$this->records[$cpid]['meta']->getIdentifier(),$rid,$e]);
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
                    echo "(=$cpid)";
                    continue;
                }
                if ( ! isset($this->records[$clid]) )
                {
                    echo "(!$clid,{$record['contact']->Id})";
                    continue;
                }
                if ( $record['meta']->__isset('relation_relation_languages_toggle_node')  
                    && !empty($record['meta']->relation_relation_languages_toggle_node->value()) ) 
                {
                    echo "~";
                    continue; /// already set
                }
                $endpoints = null;
                if ( $l->Language == 'es' )
                {
                    $endpoints = array(
                        array('entity_type' => 'node', 'entity_id' => $record['meta']->getIdentifier() ),              # ENGLISH SIDE
                        array('entity_type' => 'node', 'entity_id' => $this->records[$clid]['meta']->getIdentifier() ) # SPANISH SIDE
                    );
                } else if ( $l->Language == 'en' ) {
                    $endpoints = array(
                        array('entity_type' => 'node', 'entity_id' => $this->records[$clid]['meta']->getIdentifier() ), # ENGLISH SIDE
                        array('entity_type' => 'node', 'entity_id' => $record['meta']->getIdentifier() )                # SPANISH SIDE
                    );
                }
                if ( ! $endpoints ) 
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
                    print_r([$record['meta']->getIdentifier(),$this->records[$cpid]['meta']->getIdentifier(),$rid,$e]);
                    die('Exception');
                }
            }
        }
        echo "\nDone Language Toggles\n";
    }

    public function createDirectoryRecord( $contact )
    { 
        $values = array(
            'type'    => 'directory_record_content_type',
            'uid'     => 1,
            'status'  => 0,
            'comment' => 1,
            'promote' => 0
        );

        $entity = entity_create('node', $values);
        $meta   = entity_metadata_wrapper('node',$entity);



        //$meta->title->set( (trim((string)$contact->Category)=='Better Business Buerau') ? (string)$contact->Sys_Title : (string)$contact->Name );
        $meta->title->set( $this->filterTitle($contact) );
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
        $meta->field_contact_links->set(   array("value"=>$this->listifyLinks( $contact->Contact_Url   )) );
        $meta->field_in_person_links->set( array("value"=>$this->listifyLinks( $contact->In_Person_Url )) );
        $meta->field_website_links->set(   array("value"=>$this->listifyLinks( $contact->Web_Url   )) );

        $meta->field_cfo_agency->set( trim((string)$contact->CFO_Agency) );
        $meta->field_government_branch->set( $this->filterBranch(trim((string)$contact->Fed_Branch)) );

        $meta->field_directory_type->set(   trim((string)$contact->Category) );
        $meta->field_alpha_order_name->set( $this->filterTitle($contact) );

        $meta->field_show_on_az_index->set( $this->filterAZIndex(trim((string)$contact->ShowOnFederalAZIndex)) );
        $meta->field_group_by->set( trim((string)$contact->Groupby) );
        $meta->field_donated_money->set( $this->filterDonatedMoney(trim((string)$contact->Donated_Money)) );
        $meta->field_for_use_by_text->set( $this->filterForUseBy(trim((string)$contact->RecordUse), trim((string)$contact->Language)) );

        #$meta->save();

        return array( 'entity'=>&$entity, 'meta'=>&$meta );
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

    public function filterForUseBy( $recordUse, $language )
    {
        if ( $lang == 'en' ) 
        { 
            if ( $recordUse=='Both' )
            {
                return array( 'USA.gov', 'Kids.USA.gov', 'NCC Knowledge Base', 'Contact Center', 'Print CAH');
            } else if ( $recordUse=='Web Only' ) {
                return array( 'USA.gov', 'Kids.USA.gov', 'NCC Knowledge Base', 'Contact Center');
            } else if ( $recordUse=='Print Only' ) {
                return array('Print CAH');
            } 
        } else if ( $lang == 'es' ) { 
            if ( $recordUse=='Both' )
            {
                return array('GobiernoUSA.gov', 'NCC Knowledge Base', 'Contact Center', 'Print Guia');
            } else if ( $recordUse=='Web Only' ) {
                return array('GobiernoUSA.gov', 'NCC Knowledge Base', 'Contact Center');
            } else if ( $recordUse=='Print Only' ) {
                return array('Print Guia');
            } 
        }
        return array($recordUse);
    }

    public function filterTitle( $contact )
    {
        $category      = trim((string)$contact->Category);
        $name          = trim((string)$contact->Name);
        $sys_title     = isset($contact->Sys_Title)     ? trim((string)$contact->Sys_Title)     : '';
        $display_title = isset($contact->Display_Title) ? trim((string)$contact->Display_Title) : '';

        /// some BBB items have a display_title which looks better than the sys_title, so 
        /// we will do precedence of Display_Title,Sys_Title,name
        $bbb = 'Better Business Bureau';
        if ( $category == $bbb )
        {
            if ( $name == $bbb && !empty($sys_title) ) 
            {
                if ( $sys_title == $bbb && !empty($display_title) ) 
                {
                    return $display_title;
                }
                return $sys_title;
            }
        }

        /// Some names actually look ok, but might as well just be consisitant
        $sir = 'State Insurance Regulators';
        #$ins = array('Bureau of Insurance','Department of Insurance','Insurance Department');
        if ( $category == $sir )
        {
            if ( !empty($sys_title) )
            {
                return $sys_title;
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
