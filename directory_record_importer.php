<?php

die();

$files = array(
    '/home/ubuntu/directory_api.xml',
    '/home/ubuntu/directory_api_ES.xml',
    '/home/ubuntu/corporate.xml'
);
//$cor_es = '/home/ubuntu/corporate_ES.xml';


$import = new DirectoryRecordImporter();
$import->fromXMLFiles($files);

class DirectoryRecordImporter 
{
    var $records = array();

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
                    if ( $contact->Name === $records[(string)$contact->Id]['contact']->Name )
                    {
                        echo "Dupe    : {$contact->Name} \n";
                    } else {
                        echo "Collide : {$contact->Name} != ". (string)$records[(string)$contact->Id]['contact']->Name ."\n";
                    }
                    continue;
                }
                $existing = $this->findExistingDirectoryRecord( $contact );
                if ( $existing )
                {
                    echo "Exists  : {$contact->Name} \n";
                    $existing['contact'] = $contact;
                    $this->records[(string)$contact->Id] = $existing;
                    continue;
                }
                $record = $this->createDirectoryRecord( $contact );
                if ( $record ) 
                {
                    echo "Created : {$contact->Name} \n";
                    $this->records[(string)$contact->Id] = array( 'contact'=>$contact, 'record'=>$existing );
                    continue;
                }
                echo "Error   : {$contact->Name} \n";
            }
        }
        $this->setRelations();
        //$this->save();
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
        $meta->title->set( (string)$contact->Name );
        $meta->field_description->set( (string)$contact->Description );
        $meta->field_email->set(       (string)$contact->Email );	
        $meta->field_street_1->set( (string)$contact->Street1 );
        $meta->field_street_2->set( (string)$contact->Street2 );
        $meta->field_city->set(  (string)$contact->City );
        $meta->field_state->set( (string)$contact->StateTer );
        $meta->field_zip->set(   (string)$contact->Zip );
        $meta->field_language->set( $this->filterLanguage((string)$contact->Language) );
        $meta->field_phone_number->set(     [(string)$contact->Phone] );	
        $meta->field_toll_free_number->set( [(string)$contact->Tollfree] );
        $meta->field_tty_number->set(       [(string)$contact->TTY] );
        $meta->field_contact_links->set(   array("value"=>$this->listifyLinks( $contact->Contact_Url   )) );
        $meta->field_in_person_links->set( array("value"=>$this->listifyLinks( $contact->In_Person_Url )) );
        $meta->field_website_links->set(   array("value"=>$this->listifyLinks( $contact->Website_Url   )) );

        $meta->field_cfo_agency->set( (string)$contact->CFO_Agency );
        $meta->field_government_branch->set( $this->filterBranch((string)$contact->Fed_Branch) );

        $meta->field_show_on_az_index->set('yes');
        $meta->field_group_by->set('State');
        $meta->field_directory_type->set('State Government Agency');
        $meta->field_alpha_order_name->set( (string)$contact->Name );
        $meta->field_donated_money->set( 'No' );
        $meta->field_for_use_by->set( ['USA.gov','GobiernoUSA.gov','Contact Center'] );

        $meta->save();

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
