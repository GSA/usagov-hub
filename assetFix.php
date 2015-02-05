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
        $this->allowed_tags = ['a','strong','ul','ol','li','p','h3','h4','br']; /// ,'p'
        $this->map          = [];
    }

    function loadExistingAssets()
    {
node_delete(999);
        $efq = new EntityFieldQuery();
        $efq->entityCondition('entity_type', 'node')
            ->entityCondition('bundle', 'html_content_type')
            ///->propertyCondition( 'status', NODE_PUBLISHED)
            ->range(0, 2);
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
                    $this->map[$meta->uuid->value()] = ['html'=>['entity'=>null,'meta'=>null], 'text'=>['entity'=>null,'meta'=>null] ]; 
                }
                $this->map[$meta->uuid->value()]['html'] = [ 'entity'=>clone $entity, 'meta'=>clone $meta ]; 
            }
        }
    }

    function transmogrify()
    {
        foreach ( $this->map as &$asset )
        {
            $this->fixForUseBy($asset);
            if ( $this->isTextable($asset) ) 
            {
                //$text_asset = $this->html2text( $asset );
            }
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

    function isTextable( &$asset )
    {
        $html = $asset['html']['meta']->field_html->value();
        if ( empty($html) || empty($html['value']) )
        {
            return false;
        }
//$html['value'] = '<div class="rxbodyfield"><h1><span class="yyy xxx">H1</span><a><h1>H1</h1></a></h1><h2>h2h2</h2></div>';
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

          <li><a href="#ww1">World War I</a></li>

          <li><a href="#ww2">World War II</a></li>
        </ul>

        <ul class="two_clmn_bullets">
          <li><a href="#korean">Korean War</a></li>

          <li><a href="#vietnam">Vietnam War</a></li>

          <li><a href="#recent">Recent Wars</a></li>
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
      "http://www.americaslibrary.gov/jb/revolut/jb_revolut_subj.html">Revolutionary
      Period</a> - Find out the American Revolution got started.</li>

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

      <li><a href="http://www.civilwar.si.edu/">Civil War @ Smithsonian</a> - An
      extraordinary array of Civil War artifacts in nearly a dozen of its museums and
      archives; also includes a timeline.</li>

      <li><a href=
      "http://amhistory.si.edu/militaryhistory/printable/section.asp?id=5">Civil War -
      The Price of Freedom</a> - Americans battled over preserving their Union and ending
      slavery.</li>

      <li><a href=
      "http://americanhistory.si.edu/presidency/timeline/pres_era/3_656.html">Civil War
      and Reconstruction</a> - National Museum of American History - A short summary of
      the Civil War featuring objects from this era.</li>
    </ul>

    <h2><a id="ww1" name="ww1"></a>World War I (1914-1918)&nbsp;</h2>

    <ul>
      <li><a href="http://www.americaslibrary.gov/jb/jazz/jb_jazz_peace_1.html">Paris
      Peace Conference</a> - On January 18, 1919, diplomats from more than two dozen
      countries gathered in Paris for a conference to discuss how to end the war
      permanently.</li>

      <li><a href="http://www.americaslibrary.gov/jb/jazz/jb_jazz_wwi_1.html">U.S.
      Entered World War I</a> - On April 6, 1917, the U.S. joined its allies--Britain,
      France, and Russia--to fight in World War I; see what was going on at this
      time.</li>

      <li><a href=
      "http://amhistory.si.edu/militaryhistory/printable/section.asp?id=8">World War I -
      The Price of Freedom</a> - Americans reluctantly entered Europes "Great War" and
      tipped the balance to Allied victory.</li>
    </ul>

    <h2><a id="ww2" name="ww2"></a>World War II (1939-1945)&nbsp;</h2>

    <ul>
      <li><a href="http://www.americaslibrary.gov/jb/wwii/jb_wwii_dday_1.html">D-Day</a>
      - The morning of June 6, 1944, Americans heard on their radios that thousands of
      American and British soldiers had landed on the beaches of northern France. They
      were fighting German soldiers.</li>

      <li><a href=
      "http://amhistory.si.edu/ourstory/activities/internment/more.html">Daily Life in
      the Internment Camps</a> - Life was challenging for Japanese Americans living
      inside the internment camps. Find quotes and photographs on this page.</li>

      <li><a href=
      "http://www.americaslibrary.gov/jb/wwii/jb_wwii_pearlhar_1.html">Japanese Attacked
      Pearl Harbor</a> - Japanese planes attacked the U. S. Naval Base at Pearl Harbor,
      Hawaii Territory. The bombing killed more than 2,300 Americans.</li>

      <li><a href=
      "http://amhistory.si.edu/militaryhistory/printable/section.asp?id=9">World War II -
      The Price of Freedom</a> - After Japanese air forces attacked Pearl Harbor on
      December 7, 1941, the United States entered a global war.</li>
    </ul>

    <h2><a id="korean" name="korean"></a>Korean War (1950-1953)&nbsp;</h2>

    <ul>
      <li><a href="http://history.state.gov/milestones/1945-1952/korean-war-2">Korean War
      - Office of the Historian</a>&nbsp;- The Korean War began as a civil war between
      North and South Korea, but the conflict became international when, under U.S.
      leadership, the United Nations joined to support South Korea.</li>

      <li><a href=
      "http://amhistory.si.edu/militaryhistory/printable/section.asp?id=10">Korean War -
      The Price of Freedom</a> - Soviet-supported North Korean leader Kim Il Sung
      launched an invasion of South Korea. President Harry Truman interpreted the
      invasion as an attempt by Moscow to expand its Communist domain.</li>
    </ul>

    <h2><a id="vietnam" name="vietnam"></a>Vietnam War (1956-1975)&nbsp;</h2>

    <ul>
      <li><a href="http://www.loc.gov/vets//stories/">Experiencing War: Personal Stories
      from the Vietnam War</a> - Personal stories from veterans who experienced the war
      in a unique, individual way; no two stories are the same.</li>

      <li><a href=
      "http://amhistory.si.edu/militaryhistory/printable/section.asp?id=12">Vietnam - The
      Price of Freedom</a> - Americans fought a long war against Communist &nbsp; &nbsp;
      expansion in Southeast Asia.</li>
    </ul>

    <h2><a id="recent" name="recent"></a>Recent Wars (1989 - present)&nbsp;</h2>

    <ul>
      <li><a href=
      "http://amhistory.si.edu/militaryhistory/printable/section.asp?id=13">New American
      Roles</a> - Americans struggled to define the roles they should play in the
      community of nations and fought to defend their interests against threats at home
      as well as abroad.</li>
    </ul>
  </div>
END;
/*
$html['value'] = <<<END
<div class="rxbodyfield">
  <div class="frth_columnbox_container">
    <h2>Find on This Page</h2>

    <div class="frth_columnbox_container_content">
      <ul class="two_clmn_bullets">
        <li><a href="#art">Art</a></li>
      </ul>

      <ul class="two_clmn_bullets">
        <li><a href="#music">Music</a></li>
      </ul>
    </div>
  </div>

  <div class="rxbodyfield">
    <h2><a id="art" name="art"></a>Art</h2>

    <ul>
      <li><a href=
      "http://www.postalmuseum.si.edu/artofthestamp/SubPage%20table%20images/artwork/artwork.html">
      Art of the Stamp</a> - View 100 original drawings and artworks that were used to
      create postage stamps.</li>

      <li><a href="/watch-videos/art-and-music-videos/art-of-video-games/index.shtml"
      inlinetype="rxhyperlink" rxinlineslot="301" sys_contentid="3232" sys_dependentid=
      "3232" sys_dependentvariantid="335" sys_relationshipid="55976" sys_variantid="335"
      title="The Art of Video Games">Art of Video Games</a> - Meet Georgina Goodlander,
      an exhibition coordinator for the Smithsonian American Art Museum. Learn about this
      exhibit and how video games are an art form.</li>

      <li><a href="http://americanart.si.edu/education/insights/cappy/">Bottlecaps to
      Brushes</a> - Cappy, the skateboarding giraffe will show you some of the other
      works of art in the American Art Museums collection.</li>

      <li><a href="http://www.nga.gov/kids/zone/brushster.htm">BRUSHster - NGA Kids</a> -
      BRUSHster is an online painting machine, that includes more than forty brushes and
      customizable size, texture, and stroke options.(Shockwave required)</li>

      <li><a href="http://www.moma.org/interactives/destination/">Destination Modern
      Art</a> - A gallery that offers an introduction to The Museum of Modern Art (MoMA).
      Look carefully at works of art and learn about artists and their techniques.</li>

      <li><a href="http://americanart.si.edu/exhibitions/online/cottingham/">Eyeing
      America - Prints of Robert Cottingham</a> - Take a tour across America with artist
      Robert Cottingham.</li>

      <li><a href="http://www.nga.gov/content/ngaweb/education/kids/kids-flow.html">Flow
      - NGA Kids</a> - Flow is a motion painting machine. Choose a picture and create a
      path for the motion. (Shockwave required)</li>

      <li><a href=
      "http://americanart.si.edu/exhibitions/online/cottingham/tour-index.html">On the
      Road - Eyeing America</a> - During these travels, Robert
      Cottingham&nbsp;photographed cities and trains, which he later used as the source
      material for his paintings and prints.</li>

      <li><a href=
      "http://www.nga.gov/content/ngaweb/education/kids/kids-pixelface.html">Pixel Face -
      NGA Kids</a> - Choose a portrait and use different colors and brushes to change the
      picture. (Shockwave required)</li>

      <li><a href="http://americanart.si.edu/research/tools/art/">Researching Your
      Art</a> - Do you have a question about American art and dont know how to find the
      answer? This shows you how to investigate and learn about art.</li>

      <li><a href="http://americanart.si.edu/collections/search">Search Collections -
      American Art Museum</a> - Search and Browse by art type including painting,
      sculpture, drawings, and photography to name a few.</li>

      <li><a href="http://americanart.si.edu/collections/search/">Search for Artists in
      the American Art Museum</a> - An alphabetical list of artists and their works.</li>

      <li><a href=
      "http://www.nga.gov/content/ngaweb/education/kids/kids-seasaws.html">Sea-Saws - NGA
      Kids</a> - Select photographs of natural and man-made objects, then assemble the
      pieces to create a seascape or an abstract composition. The BUILD tool helps you
      construct animated characters and set them in motion.</li>

      <li><a href="http://smithsonianeducation.org/students/index.html">Smithsonian
      Education For Students</a> - This is a place for kids to explore, discover and
      learn. Find out about art, science, history and the secrets of the museums.</li>

      <li><a href="http://www.usa.gov/Topics/Graphics.shtml">U.S. Government Photos and
      Graphics</a> - This page has a list of links of to all the images and graphics
      available from various Government agencies.</li>
    </ul>

    <div class="rxbodyfield">
      <h2><a id="music" name="music"></a>Music</h2>
    </div>

    <div class="rxbodyfield">
      <ul>
        <li><a href=
        "http://www.sfskids.org/templates/instorchframe.asp?pageid=3">Instruments of the
        Orchestra</a> - Youre introduced to four families: Strings, Woodwinds, Brass and
        Percussion. Discover how they make their sounds, how they are constructed and the
        materials used to make them.</li>

        <li><a href="http://www.loc.gov/families/index.html">Kids and Families Page -
        Library of Congress</a> - View the collections, stories, videos and find out what
        happened today in history.</li>

        <li><a href="http://latino.si.edu/KidsCorner/">Latino Centers Kids Corner -
        Smithsonian</a> - View three major galleries: 1) a Kids Gallery; 2) the Son Clave
        Lounge featuring Latino music; 3) Meso Time, a virtual visit through Mexicos
        pre-Columbian past. (Flash required)</li>

        <li><a href=
        "http://memory.loc.gov/diglib/ihas/html/instruments/instruments-home.html">Musical
        Instruments - Library of Congress</a> - Gives information about the instrument
        collections, as well as photos and audio.</li>

        <li><a href="http://www.nyphilkids.org/">New York Philharmonic Kids Page</a> -
        Check out the instrument lab, the composition workshop, and the musicians lounge
        of the New York Philharmonic. (Shockwave required)</li>

        <li><a href=
        "http://www.whitehouse.gov/photos-and-video/video/2013/05/28/catching-curator-steinway-piano">
        Piano at the White House</a> -&nbsp;Learn about the famous Steinway Piano, one of
        the White Houses most recognized items.</li>

        <li><a href="http://kids.niehs.nih.gov/music.htm">Sing-Along</a> - Learn about
        environmental health science through song.</li>

        <li><a href=
        "http://www.americaslibrary.gov/sh/oddball/sh_oddball_subj.html">Uncommon
        Instruments - Americas Library</a> - You might play the trumpet, the violin, or
        the flute, but how about the marimba, the oud, or the zurna?</li>
      </ul>
    </div>
  </div>
END;
*/
        $dom  = new DOMDocument();
        $dom->strictErrorChecking = FALSE;
        $dom->loadHTML( $html['value'], LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
        $xml = simplexml_import_dom($dom);
        $xpath = new DOMXpath($dom);

        /// if no div.rxbodyfield then this is legit html: return false; 
        $has_rxbodyfield = $xml->xpath('//div[contains(@class,"rxbodyfield")]'); 
        if ( !$has_rxbodyfield ) 
        {
echo "NO RXBODY DIV\n";
            return false;
        } 

        /// complex items (videos and articles) should be left as html items
        $has_iframe = $xml->xpath('//iframe'); 
        $has_imgs   = $xml->xpath('//img'); 
        $has_social = $xml->xpath('//a[contains(@href,"twitter.com")'.
                                  ' or contains(@href,"facebook.com")'.
                                  ' or contains(@href,"pintrest.com")]');
        if ( $has_iframe || $has_imgs || $has_socail ) 
        {
echo "HAS IFRAME, IMG, or SOCIAL MEDIA LINKS\n";
            return false;
        } 

        /// if it has a .frth_columnbox_container it might be more than one asset on this page
        $assets_on_page = 0;
        $box_links = $xml->xpath('//div[contains(@class,"frth_columnbox_container_content")]//a[starts-with(@href,"#")]/@href');
        foreach( $box_links as $a )
        {
            $id  = substr($a,1);
            $ref = $xpath->query('//h2/a[@id="'.$id.'"]/..')->item(0)->nodeValue;
        }
        /// move h1 to asset title - get rid of it
        /// convert h2->h3
        /*
        foreach ( $dom->getElementsByTagName('h2') as $h ) 
        {
            $n = $dom->createElement('h3');
            foreach ( $h->childNodes as $c )
            {
                $n->appendChild($c->cloneNode(true));
            }
            $h->parentNode->replaceChild($n,$h);
        }
    */

//        echo $dom->saveHTML()."\n\n";

        /// convert "div.rxbodyfield > div.frth_columnbox_container a" to a ul-li-a
        /// remove "div.feeds clearfix"
        /// unwrap remaining div.rxbodyfield 
        /// move iframe to multimedia asset
        /// move img to file asset
        /// if only allowed tags left : true

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
