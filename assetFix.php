<?php

$fix = new AssetFixer();
$fix->loadExistingAssets();
$fix->transmogrify();

class AssetFixer
{
    public $allowed_tags = null;
    public $map          = null;

    function __construct( $allowed_tags=true )
    {
        $this->allowed_tags = ['a','strong','ul','ol','li','p','h3','h4','br'];
        $this->map          = [];
        /*
            $this->map[uuid] = [
                'html' => asdfasdfa
                'text' => [ asdklfjasd;flja ]
            ]
        */
    }

    function loadExistingAssets()
    {
//node_delete(999);
        $efq = new EntityFieldQuery();
        $efq->entityCondition('entity_type', 'node')
            ->entityCondition('bundle', 'html_content_type')
->entityCondition('entity_id','186583')
            ///->propertyCondition( 'status', NODE_PUBLISHED)
            ->range(0, 1);
        $result = $efq->execute();
        if (isset($result['node'])) 
        {
            $html_nids = array_keys($result['node']);
            $html_entities = entity_load('node', $html_nids);
            foreach ( $html_entities as $entity )
            {
                $meta = entity_metadata_wrapper('node', $entity);
                if ( empty($map[$meta->uuid->value()]) ) 
                { 
                    $this->map[$meta->uuid->value()] = [
                        'html' => ['entity'=>null,'meta'=>null], 
                        'text' => [] // ['entity'=>null,'meta'=>null] 
                    ]; 
                }
                $this->map[ $meta->uuid->value() ]['html'] = [ 'entity'=>clone $entity, 'meta'=>clone $meta ]; 
            }
        }
    }

    function transmogrify()
    {
        foreach ( $this->map as &$asset )
        {
            $this->fixForUseBy($asset);
            $this->textify($asset);
            //$text_asset = $this->html2text( $asset );
        }
    }
    function fixForUseBy(&$asset)
    {
        if ( $asset['html']['meta']->field_for_use_by_text->value() !== $asset['html']['meta']->field_for_use_by->value() )
        {
            $asset['html']['meta']->field_for_use_by_text->set( $asset['html']['meta']->field_for_use_by->value() );
            //$asset['html']['meta']->save();
        }
    }

    function textify( &$asset )
    {
        $html = $asset['html']['meta']->field_html->value();
        if ( empty($html) || empty($html['value']) )
        {
            return false;
        }

/*{{{* /
$html['value'] = <<<END
  <div class="rxbodyfield">
    <h1>Wars</h1>
  </div>

  <div class="rxbodyfield">
    <div class="frth_columnbox_container">
      <h2>Find on This Page</h2>

      <div class="frth_columnbox_container_content">
        <ul class="two_clmn_bullets">
          <li><a href="#revolution">Revolutionary War</a></li>
          <li><a href="#civil">Civil War</a></li>
        </ul>

        <ul class="two_clmn_bullets">
          <li><a href="#vietnam">Vietnam War</a></li>
        </ul>

        <div class="more_link">
          &nbsp;
        </div>
      </div>
    </div>
  </div>

  <div class="rxbodyfield">
    <h2><a id="revolution" name="revolution"></a>Revolutionary War
    (1775&ndash;1783)&nbsp;</h2>

    <ul>
      <li><a href="http://www.loc.gov/rr/program/bib/ourdocs/NewNation.html">American
      Revolution and The New Nation</a> - Find important documents from the Revolutionary
      War from the Library of Congress.</li>

      <li><a href="http://www.nps.gov/revwar/about_the_revolution/overview.html">American
      Revolution - Lighting Freedoms Flame</a> - Find a timeline, revolutionary stories
      and biographies from the National Park Service.</li>

      <li><a href=
      "http://amhistory.si.edu/militaryhistory/printable/section.asp?id=1">War of
      Independence</a> - Americans went to war to win their independence from Great
      Britain.</li>
    </ul>

    <h2><a id="civil" name="civil"></a>Civil War (1861-1865)&nbsp;</h2>

    <ul>
      <li><a href="http://www.americaslibrary.gov/jb/civil/jb_civil_subj.html">Civil War
      - Americas Story</a> - After Abraham Lincoln was elected president in 1860, 11
      Southern states withdrew from the Union and set up an independent government--the
      Confederate States of America; these events led to the outbreak of the Civil
      War.</li>

    </ul>
  </div>
END;

/*}}}*/

        $html_value = "<p>{$html['value']}</p>";

        $dom  = new DOMDocument();
        $dom->strictErrorChecking = FALSE;
        @$dom->loadHTML( $html_value, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
        $xpath = new DOMXpath($dom);

        /// if no div.rxbodyfield then this is legit html: return false; 
        $has_rxbodyfield = $xpath->query('//div[contains(@class,"rxbodyfield")]'); 
        if ( !$has_rxbodyfield ) 
        {
            return false;
        } 

        /// complex items (videos and articles) should be left as html items
        $iframe_tags = $xpath->query('//iframe'); 
        $img_tags    = $xpath->query('//img'); 
        $social_tags = $xpath->query('//a[contains(@href,"twitter.com")'.
                                     ' or contains(@href,"facebook.com")'.
                                     ' or contains(@href,"pintrest.com")]');
        if ( $iframe_tags->length>0 || $img_tags->length>0 || $social_tags->length>0 ) 
        {
            return false;
        } 

        $box_links = $xpath->query('//div[contains(@class,"frth_columnbox_container_content")]//a/@href');
        if ( $box_links->length>0 )
        {
            $this->splitHtmlAsset( $asset ); 
        }
die();
        /*
        foreach ( $dom->getElementsByTagName('div') as $div )
        {
            if ( preg_match('/\bfrth_columnbox_container\b/i',$div->getAttribute('class')) )
            {
                $div->parentNode->removeChild($div);
            }
        }
        */

        //$html_value = $dom->saveHTML();

        /// translate h2 tags - ? or are they just titles?
        $html_value = str_replace( '<h2',  '<h3',  $html_value );
        $html_value = str_replace( '</h2', '</h3', $html_value );
        /// remove all divs - keep content
        $html_value = preg_replace('/\<\/?div[^\>]*\>/i','',$html_value);
        /// remove all h1s
        $html_value = preg_replace('/\<h1[^\>]*\>.*?\<\/h1[^\>]*\>/i','',$html_value);

        /// check for allowed tags
        @$dom->loadHTML( $html_value, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
        $xpath = new DOMXpath($dom);
        $all_tags = $xpath->query('//*');
        $bad_tags = [];
        foreach ( $all_tags as $t ) 
        {
            if ( !in_array($t->tagName,$this->allowed_tags) ) 
            {
                $bad_tags[$t->tagName]++;
            }
        }
        if ( count($bad_tags) ) 
        {
            return false;
        }

        $html_value = preg_replace('/^\s*\<p\>\s*', '', $html_value);
        $html_value = preg_replace('/\<\/p\>\s*$/', '', $html_value);

        /// generate the text asset here and replace the original html asset

        return $html_value;

    }

    function splitHtmlAsset( &$asset )
    {
        $html = $asset['html']['meta']->field_html->value();
        if ( empty($html) || empty($html['value']) )
        {
            return false;
        }

        $html_value = $html['value'];

        $dom  = new DOMDocument();
        $dom->strictErrorChecking = FALSE;
        @$dom->loadHTML( $html_value, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
        $xpath = new DOMXpath($dom);

        $sub_assets = []; 
        $box_links = $xpath->query('//div[contains(@class,"frth_columnbox_container_content")]//a/@href');
        foreach( $box_links as $a )
        {
            if ( $a->value{0} == '#' )
            {
                $id = substr($a->value,1);
                $ref = $xpath->query('//h1/a[@id="'.$id.'"]/..');
                if ( $ref->length )
                {
                    $sub_asset = [
                        'name' => $ref->item(0)->nodeValue,
                        'dom'  => $dom->createDocumentFragment(),
                        'topic' => $asset['html']['meta']->field_asset_topic_taxonomy->value()
                    ];
                    /// all nextSibling elements should be in textAsset version ( until we hit start of new textAsset or end of document) 
                    $s = $ref->item(0);
                    while( $s = $s->nextSibling )
                    {
                        if ( !in_array($s->tagName,$this->allowed_tags) ) { break;  } 
                        $sub_asset['dom']->appendChild( $s->cloneNode(true) );
                    }
                    /// flatten dom into html 
                    /// clean tags
                }
            }
        }
        /// lookup site buliding terms referencing htmlAsset
        /// replace each reference to htmlAsset with ordered reference to children
    }

    function html2text( $asset )
    {
        $text_values = [
            'nid'       => 999, 
            'type'      => 'text_content_type',
            'language'  => $asset['html']['entity']->language,
            'title'     => 'DAN+'. $asset['html']['entity']->title,
            'created'   => $asset['html']['entity']->created,
            'changed'   => $asset['html']['entity']->changed,
            'uid'       => $asset['html']['entity']->uid,
            'status'    => $asset['html']['entity']->status,
            'comment'   => $asset['html']['entity']->comment,
            'promote'   => $asset['html']['entity']->promote,
            'sticky'    => $asset['html']['entity']->sticky,
            'tnid'      => $asset['html']['entity']->tnid,
            'translate' => $asset['html']['entity']->translate,
            'uuid'      => 'FAKE'.substr($asset['html']['entity']->uuid,4),
            'deleted'            => $asset['html']['entity']->deleted,
            'deletion_uid'       => $asset['html']['entity']->deletion_uid,
            'deletion_timestamp' => $asset['html']['entity']->deletion_timestamp,
        ];
        $entity = entity_create('node', $text_values);
        $wrap   = entity_metadata_wrapper('node', $entity);
        $wrap->field_priority->set( $asset['html']['meta']->field_priority->value() );
        $wrap->field_language->set( $asset['html']['meta']->field_language->value() );
        $wrap->field_description->set( $asset['html']['meta']->field_description->value() );
        $wrap->field_comments->set( $asset['html']['meta']->field_comments->value() );
        $wrap->body->set( ['value'=>$asset['html']['meta']->field_html->value()] );
        $wrap->path->set( $asset['html']['meta']->path->value() );
        $wrap->field_owner->set( $asset['html']['meta']->field_owner->value() );
        $wrap->field_schedule_publish->set( $asset['html']['meta']->field_schedule_publish->value() );
        $wrap->field_archive_date->set( $asset['html']['meta']->field_archive_date->value() );
        if ( !empty($asset['html']['meta']->field_for_use_by_text->value()) )
        {
            $wrap->field_for_use_by_text->set( $asset['html']['meta']->field_for_use_by_text->value() );
        } else {
            $wrap->field_for_use_by_text->set( $asset['html']['meta']->field_for_use_by->value() );
        }
        $wrap->field_date_last_reviewed->set( $asset['html']['meta']->field_date_last_reviewed->value() );
        $wrap->field_workflow_notification_emai->set( $asset['html']['meta']->field_workflow_notification_emai->value() );
        $wrap->field_content_tags->set( $asset['html']['meta']->field_content_tags->value() );
        $wrap->field_asset_topic_taxonomy->set( $asset['html']['meta']->field_asset_topic_taxonomy->value() );
        $wrap->field_workflow_state_search->set( $asset['html']['meta']->field_workflow_state_search->value() );
        //$wrap->save();
        
     }
    
}
