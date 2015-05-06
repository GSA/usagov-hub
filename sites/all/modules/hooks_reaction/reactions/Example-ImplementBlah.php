<?php /*

    [--] PURPOSE [--]
    
    The purpose of this script is to provide an example on how to create reactions files in 
    this "reactions" directory. In your [newly created] reactions file(s), please follow this file as a template - please 
    include a "PURPOSE" section at the top of your file.
    
    Generally this area should contain a high-level, non-technical, description as to why this script/file was made. 

    [--] TECHNICAL NOTES [--]

    In your [newly created] reactions file(s), please also include this area in the first comment block as well.
    This is the same thing as the "purpose" section, but should be more technical.

    [!!] WARNING [!!]

    If you have any important information that that other developers must know about this script, please 
    include it in a [!!] WARNING [!!] section, also, please list this section ABOVE the "purpose" and 
    "technical notes" section.
        
*/

/**
 * Implements HOOK_views_query_alter().
 * Alters the view query to return only results within range of latitude/longitude.
 * Latitude, Longitude, and Range, will be pulled from the View's arguments.
 * This change will not be applied when arguments are not given to the view
 *
 * COPIED FROM BUSINESS-USA
 */
hooks_reaction_add("views_query_alter",
    function (&$view, &$query) {
    
        // Only do this for the useac_location_exporting_wizards View
        if ( $view->name === 'useac_location_exporting_wizards' ) {
        
            // Only do this if all 3 arguments were past to this view
            if ( !empty($view->args) && !empty($view->args[0]) && !empty($view->args[1]) && !empty($view->args[2]) ) {
            
                list( $lat, $ln, $range ) = $view->args;
                
                ensureMySqlDistanceFunctionsExist();
                $distLatLongFunct = "distLatLong($lat, $ln, field_data_field_appoffice_lat.field_appoffice_lat_value + 0.0, field_data_field_appoffice_long.field_appoffice_long_value + 0.0)";
                $query->add_where_expression(0, $distLatLongFunct . " < $range");
                
                $query->add_field('field_data_field_appoffice_lat', 'field_appoffice_lat_value');
                $query->add_field('field_data_field_appoffice_long', 'field_appoffice_long_value');
                
                $query->fields['node_title'] = array(
                            'field' => "CONCAT( node.title, ' ', convert($distLatLongFunct, DECIMAL) ) ",
                            'table' => '',
                            'alias' => 'node_title'
                );
                $query->orderby = array(
                    array(
                        'field' => $distLatLongFunct,
                        'direction' => 'ASC'
                    )
                );
                
            }
        }
    }
);
