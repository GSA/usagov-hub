<?php

die();

ini_set('max_execution_time',0);
set_time_limit(0);

$urls = array(
);

$import = new FCICImporter();
//$import->fromCSV($urls);
//echo tt(true);
die("\n\nFIN\n\n");

class FCICImporter 
{
    var $node_uuids = array();
    var $text_assets = array(
        'nodes' => array(),
        'by_uuid' => array(),
    );

    var $tax_uuids  = array();
    var $asset_topics_vid = 57;
    var $asset_topics = array(
        'terms' => array(),
        'by_uuid' => array(),
        'by_name' => array(),
    );

    var $agency_tags_vid = 37;
    var $agency_tags = array(
        'terms' => array(),
        'by_uuid' => array(),
    );

    var $site_pages_vid = 42;
    var $site_pages = array(
        'terms' => array(),
        'by_uuid' => array(),
    );


    public function __construct()
    {
        tt(__FUNCTION__);
        echo __CLASS__." Created\n";

//        $this->removeAssetTopics();
//        $this->removeAgencyTags();

//        $this->truncateTaxonomies();

//        $this->importAgencyTags();
//        $this->importAssetTopics();

//        $this->cacheTaxonomyUUIDs();
//        $this->cacheExistingAgencyTags();
//        $this->cacheExistingAssetTopics();
//        $this->cacheTextAssetUUIDs();
//        $this->cacheExistingTextAssets();

        echo "END ".__CLASS__." : ".tt(__FUNCTION__)."\n";
    }

    /** DO STUFF **/

    public function importAgencyTags()
    {
        echo '+'.__FUNCTION__."\n"; tt(__FUNCTION__);
        $urls = array( 'http://fciccontentmigrationtool.smileytech.net/agency-tags.csv' );
        foreach ( $urls as $url )
        {
            if (($handle = fopen($url, "r")) !== FALSE) 
            {
                while (($row = fgetcsv($handle, 0, ",")) !== FALSE) 
                {
                    $term = new stdClass();
                    $term->vid  = $this->agency_tags_vid;
                    $term->name = $row[1];
                    $term->uuid = $row[2]; 
                    if ( taxonomy_term_save($term) == SAVED_NEW )
                    {
                        db_update('taxonomy_term_data')
                            ->fields(['tid'=>$row[0]])
                            ->condition('tid', $term->tid)
                            ->execute();
                        db_update('taxonomy_term_hierarchy')
                            ->fields(['tid'=>$row[0]])
                            ->condition('tid', $term->tid)
                            ->execute();
                        $term->tid = $row[0];
                    }
                    $entities = entity_load('taxonomy_term', [$term->tid] );
                    foreach ( $entities as $entity )
                    {   
                        $meta = entity_metadata_wrapper('taxonomy_term',$entity);
                        $this->cacheAgencyTag($entiy,$meta,$term->uuid);
                    }
                }
            }
        }
        echo '/'.__FUNCTION__. " : ". tt(__FUNCTION__)."\n";
    }

    public function importAssetTopics()
    {
        echo '+'.__FUNCTION__."\n"; tt(__FUNCTION__);
        $urls = array( 'http://fciccontentmigrationtool.smileytech.net/asset-topics.csv' );
        foreach ( $urls as $url )
        {
            if (($handle = fopen($url, "r")) !== FALSE) 
            {
                while (($row = fgetcsv($handle, 0, ",")) !== FALSE) 
                {
                    db_insert('taxonomy_term_data')
                        ->fields(array(
                            'vid'    => $this->asset_topics_vid,
                            'tid'    => $row[0],
                            'name'   => $row[1],
                            'uuid'   => $row[2],
                        ))->execute();
                    db_insert('taxonomy_term_hierarchy')
                        ->fields(array(
                            'tid'    => $row[0],
                            'parent' => $row[3],
                        ))->execute();
                    $entities = entity_load('taxonomy_term', [$row[0]] );
                    foreach ( $entities as $entity )
                    {   
                        $meta = entity_metadata_wrapper('taxonomy_term',$entity);
                        $this->cacheAssetTopic($entiy,$meta,$row[1]);
                    }
                }
            }
        }
        echo '/'.__FUNCTION__. " : ". tt(__FUNCTION__)."\n";
    }

    public function importUsers()
    {
        echo '+'.__FUNCTION__."\n"; tt(__FUNCTION__);
/*
        $urls = array( 'http://fciccontentmigrationtool.smileytech.net/users_with_roles.csv' );
        foreach ( $urls as $url )
        {
            if (($handle = fopen($url, "r")) !== FALSE) 
            {
                fgetcsv($handle, 0, ","); /// pop header
                while (($row = fgetcsv($handle, 0, ",")) !== FALSE) 
                {
                    db_insert('user')
                        ->fields(array(
                            'uid'    => $row[4], 
                            'name'   => $row[0],
                            'pass'   => 'i$S$DxmoXX1exKUHij1.Dx5jtQAfUW3NVCb8u.lZ0r4QsyvkPUYBSqzD', /// changeme
                            'mail'   => $row[1],
                            'uuid'   => $row[3],
                        ))->execute();
                    $roles_query = db_insert('user_roles')->fields(array('uid','rid'));
                    if ( stristr($row[2],'topic manager') ) { $roles_query->values(array('uid'=>,'rid'=>)); }
                    $entities = entity_load('taxonomy_term', [$row[0]] );
                    foreach ( $entities as $entity )
                    {   
                        $meta = entity_metadata_wrapper('taxonomy_term',$entity);
                        $this->cacheAssetTopic($entiy,$meta,$row[1]);
                    }
                }
            }
        }
// '1', 'admin', '$S$DM1Q27zZgl0/PGbuAP76Bix6Xcd1WUo97Qcruu5tKhaFuIJhLyE4', 'admin@example.com', '', '', '', '1414463960', '1420045636', '1420043696', '1', 'America/New_York', 'en', '72', 'admin@example.com', ?, '11d111aa-5fa1-43d2-a324-95b2775f9142'
*/
        echo '/'.__FUNCTION__. " : ". tt(__FUNCTION__)."\n";
    }



    public function importTextAssets()
    {
        echo __FUNCTION__." Called\n";
        $urls = array( 'http://fciccontentmigrationtool.smileytech.net/text_assets_tree.csv' );
        foreach ( $urls as $url )
        {
            echo "Begin Loading CSV File: $file\n";
            if (($handle = fopen($url, "r")) !== FALSE) 
            {
                $cols = fgetcsv($handle, 0, ",");
                while (($row = fgetcsv($handle, 0, ",")) !== FALSE) 
                {
                    $data = array(
                        'nuuid'    => $this->filterNuuid($row[0]),
                        'nid'      => $this->filterNid($row[1]),
                        'title'    => $this->filterTitle($row[2]),
                        'summary'  => $this->filterSummary($row[3]),
                        'body'     => $this->filterBody($row[4]),
                        'language' => $this->filterLanguage($row[5]),
                        'tags'         => $this->filterTags($row[6]),
                        'taxonomy'     => $this->filterTaxonomy($row[7]),
                        'taxonomyPath' => $this->filterTaxonomyPath($row[8]),
                        'auuid'  => $this->filterAuthorUuid($row[9]),
                        'auid'   => $this->filterAuthorUid($row[10]),
                        'aemail' => $this->filterAuthorEmail($row[11]),
                        'aname'  => $this->filterAuthorName($row[12]),
                    ); 
                   
                    /// do tags already exist?
                    foreach ( $data['tags'] as $t=>$tag )
                    {
                        $existing_tag = $this->findExistingTag($tag);
                        if ( !empty($existing_tag['entity']) )
                        {
echo " FOUND TAG : {$tag['uuid']} : {$tag['name']} \n ";
                            if ( !empty($tag['name']) && $tag['name']!==$existing_tag['meta']->name->value() )
                            {/// tag name has changed
                                $existing_tag['meta']->name->set( $name );
                                $existing_tag['meta']->save();
echo " UPDATE TAG : {$tag['uuid']} : {$tag['name']} \n ";
                            }
                        } else {
                            /// create tag
                            $existing_tag = $this->createAgencyTag($tag);
echo " CREATE TAG : {$tag['uuid']} : {$tag['name']} \n ";
                        }
                        if ( !empty($existing_tag['entity']) ) 
                        {
                            $data['tags'][$t]['existing'] = $existing_tag;
                        } else {
echo " ERROR TAG : {$tag['uuid']} : {$tag['name']} \n ";
                        }
                    }
/*
                    foreach ( $data['taxonomyPath'] as $t=>$tax )
                    {
                        $existing_tag = $this->findExistingTaxonomy($tag);
                        if ( $existing_tag && $tag['name']!==$existing['meta']->name->value() )
                        {   /// tag name has changed
                            $existing_tag['meta']->name->set( $name );
                            $existing_tag['meta']->save();
                        } else {
                            /// create tag
                            $existing_tag = $this->createAgencyTag($tag);
                        }
                        $data['tags'][$t]['existing'] = $existing_tag;
                    }
                    /// does taxonomy already exist?
                    /// does author already exist?
                    /// does asset already exist?
                    $existing_asset = $this->findExistingAsset($data);
 */
                }
                fclose($handle);
            }
            echo "Done  Loading CSV File: $file\n";
        }
    } 


    /** FILTER INCOMING DATA **/

    public function filterNuuid( $nuuid )
    {
        return (int)trim($nuuid);
    }
    public function filterNid( $nid )
    {
        return (int)trim($nid);
    }
    public function filterTitle( $title )
    { 
        return trim($title);
    }
    public function filterSummary( $summary )
    { 
        return trim($summary);
    }
    public function filterBody( $body )
    { 
        return trim($body);
    }
    public function filterLanguage( $language )
    { 
        if ( $language == 'es' ) { return 'Spanish'; }
        if ( $language == 'en' ) { return 'English'; }
        return $language;
    }

    public function filterTags( $tags )
    {
        $list = split('==',$tags);
        $filtered_tags = [];
        foreach ( $list as $tag )
        {
            $data = array( 
                'uuid' => null,
                'name' => '',
                'existing' => null
            );
            if ( stripos($tag,'~~') === false )
            {
                $data['name'] = $tag;
            } else {
                list($data['uuid'],$data['name']) = split('~~',$tag);
            } 
            $filtered_tags[] = $data;
        }
        return $filtered_tags;
    }

    public function filterTaxonomy( $taxonomy )
    {
    }
    public function filterTaxonomyPath( $path )
    {
    }

    public function filterAuthorUuid( $uid )
    {
    }
    public function filterAuthorUid( $uuid )
    {
    }
    public function filterAuthorEmail( $email )
    {
    }
    public function filterAuthorName( $name )
    {
    }


    /** CREATE MATCHING LOCAL DATA **/
 
    public function createAuthor( $data ) 
    {
    }

    public function createAgencyTag( $data ) 
    {
        $uuid = null;
        $values = array(
            'type' => 'taxonomy_term',
            'name' => $data['name'],
            'vid'  => $this->agency_tags_vid,
        );
        if ( !empty($data['uuid']) )
        {
            $values['uuid'] = $data['uuid'];
            $uuid = $data['uuid'];
        }

        $entity = entity_create('taxonomy_term', $values);
        $meta   = entity_metadata_wrapper('taxonomy_term',$entity);
        $meta->save();

        $result = db_select('taxonomy_term_data', 't')
            ->fields('t',array('tid','uuid'))
            ->condition('tid', $meta->tid->value(),'=')->condition('vid', $vid,'=')
            ->execute();
        while ( $record = $result->fetchAssoc() )
        {
            $this->tax_uuids[$record['tid']] = $record['uuid'];
        }

        return array( 'entity'=>&$entity, 'meta'=>&$meta, 'uuid'=>$uuid, 'i'=>null );
    }

    public function createAssetTopic( $data )
    {
    }

    public function createTextAsset( $data )
    { 
return null;
        $values = array(
            'type'    => 'text_content_type',
            'uid'     => 1, /// this needs to be from the author
            'status'  => 0,
            'comment' => 1,
            'promote' => 0
        );

        $entity = entity_create('node', $values);
        $meta   = entity_metadata_wrapper('node',$entity);
/*
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
*/
        return array( 'entity'=>&$entity, 'meta'=>&$meta );
    }


    /** LOOKUP MATCHING LOCAL DATA **/

    public function &findExistingTag( $tag )
    {
        $not_found = null;
        /// check cache by uuid
        if ( !empty($this->agency_tags['by_uuid'][$tag['uuid']]) )
        {
           return $this->agency_tags['by_uuid'][$tag['uuid']];
        }

        /// check db by term name
        $term_query = new EntityFieldQuery();
        $result = $term_query->entityCondition('entity_type', 'taxonomy_term')
            ->entityCondition('bundle', 'agency_tags')
            ->propertyCondition('name',  $tag['name'])
            ->execute();
        if ( isset($result['taxonomy_term']) && count($result['taxonomy_term'])==1 )
        {
            $nids = array_keys( $result['taxonomy_term'] );
            $entities = entity_load('taxonomy_term', [$nids[0]] );
            if ( count($entities)>0 )
            {   
                $meta = entity_metadata_wrapper('taxonomy_term',array_shift($entities));
                if ( !empty($tag['uuid']) )
                {
                    /// update db with new uuid
                    /// update cache with new uuid
                }
                return $this->cacheAgencyTag($entity,$meta);
            }
        }
        return $not_found;
    }  
    public function &findExistingTaxonomyPath( $tag )
    {
        $not_found = null;
        /// check cache by uuid
        if ( !empty($this->asset_topics['by_uuid'][$tag['uuid']]) )
        {
           return $this->asset_topics['by_uuid'][$tag['uuid']];
        }
        /*
        /// check by uuid
        $uuid_query = new EntityFieldQuery();
        $result = $uuid_query->entityCondition('entity_type', 'taxonomy_term')
            ->entityCondition('bundle', 'asset_topics')
            ->propertyCondition('uuid',  $tag['uuid'])
            ->execute();
        if ( isset($result['taxonomy_term']) && count($result['taxonomy_term'])==1 )
        {
            $nids = array_keys( $result['taxonomy_term'] );
            $entities = entity_load('taxonomy_term', [$nids[0]] );
            if ( count($entities)>0 )
           {   
                $meta = entity_metadata_wrapper('taxonomy_term',array_shift($entities));
                return array( 'entity'=>&$entities[0], 'meta'=>&$meta, 'uuid'=>null, 'parent'=>null, 'children'=>array(), 'i'=>$end  );
            }
        }

        /// check by term name
        $uuid_query = new EntityFieldQuery();
        $result = $uuid_query->entityCondition('entity_type', 'taxonomy_term')
            ->entityCondition('bundle', 'asset_topics')
            ->propertyCondition('name',  $tag['name'])
            ->execute();
        if ( isset($result['taxonomy_term']) && count($result['taxonomy_term'])==1 )
        {
            $nids = array_keys( $result['taxonomy_term'] );
            $entities = entity_load('taxonomy_term', [$nids[0]] );
            if ( count($entities)>0 )
            {   
                $meta = entity_metadata_wrapper('taxonomy_term',array_shift($entities));
                return array( 'entity'=>&$entities[0], 'meta'=>&$meta );

                $this->asset_topics['terms'][$end] = $existing;
                $this->asset_topics['by_uuid'][$existing['meta']->uuid->value()] =& $this->asset_topics['terms'][$end];
                return $existing;

            }
        }
        */
        return $not_found;
    }
    public function &findExistingAsset( $data )
    {
        $not_found = null;
        /// check cache by uuid
        if ( !empty($this->text_assets['by_uuid'][$data['meta']->uuid->value()]) )
        {
           return $this->text_assets['by_uuid'][$data['meta']->uuid->value()];
        }
        /*
        /// check by uuid
        $uuid_query = new EntityFieldQuery();
        $result = $uuid_query->entityCondition('entity_type', 'node')
            ->entityCondition('bundle', 'text_content_type')
            ->propertyCondition('uuid',  $data['nuuid'])
            ->execute();
        if ( isset($result['node']) && count($result['node'])==1 )
        {
            $nids = array_keys( $result['node'] );
            $entities = entity_load('node', [$nids[0]] );
            if ( count($entities)>0 )
            {   
                $meta = entity_metadata_wrapper('node',array_shift($entities));
                return array( 'entity'=>&$entities[0], 'meta'=>&$meta );
            }
        }

        /// check by title
        $title_query = new EntityFieldQuery();
        $result = $title_query->entityCondition('entity_type', 'node')
            ->entityCondition('bundle', 'text_content_type')
            ->propertyCondition('title', $data['title'])
            ->execute();
        if ( isset($result['node']) && count($result['node'])>0 )
        {
            $nids = array_keys( $result['node'] );
            $entities = entity_load('node', [$nids[0]] );
            if ( count($entities)==1 )
            {   
                $meta = entity_metadata_wrapper('node',array_shift($entities));
                return array( 'entity'=>&$entities[0], 'meta'=>&$meta );
            } else if ( count($entities)==0 ) {
                return null;
            } else {
                echo "[ambiguity]";
                return null;
            }
        }
        */
        return $not_found;
    }
    
    /** REMOVE DB **/

    public function removeTextAssets()
    {
        $result = db_select('node', 'n')
            ->fields('n',array('nid'))
            ->condition('type','text_content_type','=')
            ->execute();
        node_delete($result->fetchCol());
    }
    public function removeAssetTopics()
    {
        $query = db_select('taxonomy_term_data', 't');
        $query->join('taxonomy_term_hierarchy', 'h', 't.tid = h.tid');
        $result = $query->fields('t',array('tid'))
            //->condition('h.parent',0,'=')
            ->condition('t.vid',$this->asset_topics_vid,'=')
            ->execute();
        $this->_delete_terms($result->fetchCol());
    }
    public function removeSiteBuilder()
    {
        /// get all taxonomy terms not under KIDS.GOV
        $query = db_select('taxonomy_term_data', 't');
        $query->join('taxonomy_term_hierarchy', 'h', 't.tid = h.tid');
        $result = $query->fields('t',array('tid'))
            //->condition('h.parent',0,'=')
            ->condition('t.vid',$this->site_pages_vid,'=')
            //->condition('t.name','Kids.gov','<>')
            ->execute();
        $this->_delete_terms($result->fetchCol());
    } 
    public function removeAgencyTags()
    {
        $query = db_select('taxonomy_term_data', 't');
        $query->join('taxonomy_term_hierarchy', 'h', 't.tid = h.tid');
        $result = $query->fields('t',array('tid'))
            //->condition('h.parent',0,'=')
            ->condition('t.vid',$this->agency_tags_vid,'=')
            ->execute();
        $this->_delete_terms($result->fetchCol());
    }
    public function truncateTaxonomies()
    { 
        db_query("truncate table taxonomy_term_data");
        db_query("truncate table taxonomy_term_hierarchy");
    } 

    public function _delete_terms($tids, $options = array()) 
    {
        if (!is_array($tids)) array($tids);
        if (count($tids) > 0) {
            foreach ($tids as $tid) {
                if ($children = taxonomy_get_children($tid)) {
                    foreach ($children as $child) {
                        $this->_delete_terms([$child->tid]);
                    }
                }
                $term = taxonomy_term_load($tid);
                if ($term) {
                    $deleted_terms[] = $term;
                    db_delete('taxonomy_term_data')
                        ->condition('tid', $tid)
                        ->execute();
                    db_delete('taxonomy_term_hierarchy')
                        ->condition('tid', $tid)
                        ->execute();
                    field_attach_delete('taxonomy_term', $term);
                    module_invoke_all('taxonomy_term_delete', $term);
                    taxonomy_terms_static_reset();
                }
            }
        }
     }

    /** CACHE FROM DB INTO MEMORY **/

    public function cacheTextAssetUUIDs()
    {
        echo '+'.__FUNCTION__."\n";
        tt(__FUNCTION__);
        $result = db_select('node', 'n')
            ->fields('n',array('nid','uuid'))
            ->condition('type','text_content_type','=')
            ->execute();
        while ( $record = $result->fetchAssoc() )
        {
            $this->node_uuids[$record['nid']] = $record['uuid'];
        }
        echo '/'.__FUNCTION__. " : ". tt(__FUNCTION__)."\n";
    }
    public function cacheExistingTextAssets()
    {
        echo '+'.__FUNCTION__."\n";
        tt(__FUNCTION__);
        $query = new EntityFieldQuery();
        $result = $query->entityCondition('entity_type', 'node')
            ->entityCondition('bundle', 'text_content_type')
            ->execute();
        if ( !empty($result['node']) )
        {
            $ids = array_keys( $result['node'] );
            $nodes = node_load_multiple($ids); 
            foreach ( $nodes as $node )
            {   
                $meta = entity_metadata_wrapper('node',$node);
                $this->cacheTextAsset($node,$meta);
            }
        }
        ;
        echo '/'.__FUNCTION__. " : ". tt(__FUNCTION__)."\n";
    }
    public function cacheTextAsset($node,$meta,$uuid=null)
    {
        if ( empty($uuid) )
        {
            if ( !empty($this->node_uuids[$node->nid]) )
            {
                $uuid = $this->node_uuids[$node->nid];
            }
        }
        if ( empty($uuid) ) 
        {
            return false;
        }
        $end = count($this->text_assets['nodes']);
        $asset = array( 'entity'=>$node, 'meta'=>$meta, 'uuid'=>$uuid, 'i'=>$end );
        $this->text_assets['nodes'][$end] = $asset;
        $this->text_assets['by_uuid'][ $uuid ] =& $this->text_assets['nodes'][$end];
        return true;
     }

    public function cacheTaxonomyUUIDs()
    {
        echo '+'.__FUNCTION__."\n";
        tt(__FUNCTION__);
        $result = db_select('taxonomy_term_data', 't')
            ->fields('t',array('tid','uuid'))
            ->execute();
        while ( $record = $result->fetchAssoc() )
        {
            $this->tax_uuids[$record['tid']] = $record['uuid'];
        }
        echo '/'.__FUNCTION__. " : ". tt(__FUNCTION__)."\n";
    }

    public function cacheExistingAgencyTags()
    {
        echo '+'.__FUNCTION__."\n";
        tt(__FUNCTION__);
        $query = new EntityFieldQuery();
        $result = $query->entityCondition('entity_type', 'taxonomy_term')
            ->entityCondition('bundle', 'agency_tags')
            ->execute();
        if ( !empty($result['taxonomy_term']) )
        {
            $ids = array_keys( $result['taxonomy_term'] );
            $entities = entity_load('taxonomy_term', $ids );
            foreach ( $entities as $entity )
            {   
                $meta = entity_metadata_wrapper('taxonomy_term',$entity);
                $this->cacheAgencyTag($entiy,$meta);
            }
        }
        echo '/'.__FUNCTION__. " : ". tt(__FUNCTION__)."\n";
    }
    public function &cacheAgencyTag($entity,$meta,$uuid=null)
    {
        if ( empty($uuid) )
        {
            if ( !empty($this->tax_uuids[$entity->tid]) )
            {
                $uuid = $this->tax_uuids[$entity->tid];
            }/* else {
                $result = db_select('taxonomy_term_data', 't')
                    ->fields('t',array('tid','uuid'))
                    ->condition('tid', $entity->tid,'=')
                    ->condition('vid', $this->agency_tags_vid,'=')
                    ->execute();
                while ( $record = $result->fetchAssoc() )
                {
                    $this->tax_uuids[$record['tid']] = $record['uuid'];
                    $uuid = $record['uuid'];
                }
            }*/
        }

        $end = count($this->agency_tags['terms']);
        $term = array( 'entity'=>$entity, 'meta'=>$meta, 'uuid'=>$uuid, 'parent'=>null, 'children'=>array(), 'i'=>$end );
        if ( !empty($this->tax_uuids[$entity->tid]) )
        {
            $term['uuid'] = $this->tax_uuids[$entity->tid];
        }
        $this->agency_tags['terms'][$end] = $term;
        $this->agency_tags['by_uuid'][$term['uuid']] =& $this->agency_tags['terms'][$end];
        return $this->agency_tags['terms'][$end];
    }

    public function cacheExistingAssetTopics()
    {
        echo '+'.__FUNCTION__."\n";
        tt(__FUNCTION__);
        $query = new EntityFieldQuery();
        $result = $query->entityCondition('entity_type', 'taxonomy_term')
            ->entityCondition('bundle', 'asset_topic_taxonomy')
            ->execute();
        if ( !empty($result['taxonomy_term']) )
        {
            $ids = array_keys( $result['taxonomy_term'] );
            $entities = entity_load('taxonomy_term', $ids );
            foreach ( $entities as $entity )
            {   
                $meta = entity_metadata_wrapper('taxonomy_term',$entity);
                $this->cacheAssetTopic($entity,$meta);
             }
        }
        echo '/'.__FUNCTION__. " : ". tt(__FUNCTION__)."\n";
    }   
    public function cacheAssetTopic($entity,$meta,$uuid=null)
    {
        if ( empty($uuid) )
        {
            if ( !empty($this->tax_uuids[$entity->tid]) )
            {
                $uuid = $this->tax_uuids[$entity->tid];
            }/* else {
                $result = db_select('taxonomy_term_data', 't')
                    ->fields('t',array('tid','uuid'))
                    ->condition('tid', $entity->tid,'=')
                    ->condition('vid', $this->asset_topics_vid,'=')
                    ->execute();
                while ( $record = $result->fetchAssoc() )
                {
                    $this->tax_uuids[$record['tid']] = $record['uuid'];
                    $uuid = $record['uuid'];
                }
            }*/
        }

        $end = count($this->asset_topics['terms']);
        $term = array( 'entity'=>$entity, 'meta'=>$meta, 'uuid'=>$uuid, 'parent'=>null, 'children'=>array(), 'i'=>$end );
        if ( !empty($this->tax_uuids[$entity->tid]) )
        {
            $term['uuid'] = $this->tax_uuids[$entity->tid];
        }
        $this->asset_topics['terms'][$end] = $term;
        $this->asset_topics['by_uuid'][$term['uuid']] =& $this->asset_topics['terms'][$end];
        $this->asset_topics['by_name'][$meta->name->value()] =& $this->asset_topics['terms'][$end];
        /*
        $parents = $meta->parent->value();
        if ( count($parents) )
        {
            foreach ( $parents as $parent )
            {
                if ( !empty($this->asset_topics['by_uuid'][$parent->uuid]) )
                {
                    $this->asset_topics['terms'][$end]['parent'] =& $this->asset_topics['by_uuid'][$parent->uuid];
                    $this->asset_topics['by_uuid'][$parent->uuid]['children'][$existing['meta']->uuid->value()] =& $this->asset_topics['terms'][$end];
                }
            }
        }
        */
    }

}

function tt($c=null)
{
    $m = microtime(true);
    if ( empty($GLOBALS['__timers']) )
    {
        $GLOBALS['__timers'] = [];
        $GLOBALS['__timer_start'] = $m;
    }
    if ( $c===true ) /// display all times
    {
        $l = 10;
        foreach ( $GLOBALS['__timers'] as $k=>$v ) 
        {
            $kl = strlen($k);
            if ( $kl > $l ) 
            {
                $l=$kl;
            }
        }
        $s = '';
        foreach ( $GLOBALS['__timers'] as $k=>$v ) 
        {
            foreach ( $v[1] as $e ) 
            {
                $s = str_pad($k,$l) ." : ". sprintf("%02.2f",$e-$v[0]) ."s\n";
            }
        }
        return $s;
    } else if ( $c===false ) { /// end current timer
        $t =& end($GLOBALS['__timers']);
        if ( !empty($t[0]) )
        {
            $t[1][] = $m;
        }
        return $t[0]-$m;
    } else if ( !empty($c) ) { /// start new timer, or end existing timer
        if ( empty($GLOBALS['__timers'][$c]) )
        {
            $GLOBALS['__timers'][$c] = [$m,[]];
            return sprintf("%02.2f",$m-$GLOBALS['__timer_start']);
        } else {
            $GLOBALS['__timers'][$c][1][] = $m;
            return sprintf("%02.2f",$m-$GLOBALS['__timers'][$c][0]);
        }
    }
    return false;
}
