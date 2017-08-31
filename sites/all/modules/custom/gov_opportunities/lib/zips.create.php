<?php
/**
 * This file is used to pull down data from several different places
 * and merge the datasets into one hash keyed to 5 digit zip
 * The hash is then saved as a php-loadable variable called $zips
 **/
die();

$c     = getCensusData(2010);
$c2012 = getCensusData(2012);
$c2013 = getCensusData(2013);
$c2014 = getCensusData(2014);
$c2015 = getCensusData(2015);
$c2016 = getCensusData(2016);
$f     = getFZCData();
$u     = getUSZCData();

mergeDataSets($c, $c2012);
mergeDataSets($c, $c2013);
mergeDataSets($c, $c2014);
mergeDataSets($c, $c2015);
mergeDataSets($c, $c2016);
mergeDataSets($c, $f);
mergeDataSets($c, $u);

ksort($c);
file_put_contents(
    'zips.php',
    "<?php \n\$zips = ".var_export($c, true).";"
);

function mergeDataSets(&$a, $b)
{
    foreach ($b as $z => $bb) {
        if (!isset($a[$z])) {
            $a[$z] = $bb;
        } else {
            $a[$z]['cities'] = array_unique(array_merge($a[$z]['cities'], $bb['cities']));
            array_walk($a[$z]['cities'], function (&$a) {
                $a = trim($a);
            });
            if (empty($a[$z]['state'])) {
                $a[$z]['state'] = $bb['state'];
            }
            $a[$z]['state'] = $bb['state'];
            $a[$z]['lat'] = (float)$a[$z]['lat'] + (float)$bb['lat'];
            if (!empty($a[$z]['lat']) && !empty($bb['lat'])) {
                $a[$z]['lat'] = $a[$z]['lat'] / 2;
            }
            $a[$z]['lon'] = (float)$a[$z]['lon'] + (float)$bb['lon'];
            if (!empty($a[$z]['lon']) && !empty($bb['lon'])) {
                $a[$z]['lon'] = $a[$z]['lon'] / 2;
            }
        }
    }
}

function getFZCData()
{
    /// unitedstates zipcodes org
    $fzc_raw = 'free-zipcode-database.csv';
    $fzc_url = 'http://federalgovernmentzipcodes.us/free-zipcode-database.csv';

    if (!file_exists($fzc_raw)) {
        echo "FZC DB not found\n";
        if ( file_put_contents(
            $fzc_raw,
            file_get_contents($fzc_url)
        ) ) {
          echo "FZC DB downloaded\n";
        } else {
          echo "FZC DB failed to Download\n";
          return [];
        }
    } else {
        echo "FZC DB found\n";
    }
    $zips = [];
    $fp = fopen($fzc_raw, 'r');
    while (!feof($fp)) {
        $line = fgets($fp, 2048);
        $data = str_getcsv($line, ",");
        if (!isset($data[0]) || !is_numeric($data[0])) {
            continue;
        }
        $zip    = str_pad($data[1], 5, '0', STR_PAD_LEFT);
        $cities = [];
        if (!empty($data[3])) {
            $cities[] = $data[3];
        }
        $zips[$zip] = [
            'zip'    => $zip,
            'cities' => $cities,
            'state'  => !empty($data[4]) ? $data[4]  : '',
            'lat'    => !empty($data[6]) ? $data[6] : '',
            'lon'    => !empty($data[7]) ? $data[7] : '',
        ];
    }
    fclose($fp);
    echo "FZC DB processed\n";
    return $zips;
}

function getUSZCData()
{
    /// unitedstates zipcodes org
    $uszc_raw = 'zip_code_database.csv';

    if (!file_exists($uszc_raw)) {
        echo "USZC DB not found\n";
    } else {
        echo "USZC DB found\n";
    }
    $zips = [];
    $fp = fopen($uszc_raw, 'r');
    while (!feof($fp)) {
        $line = fgets($fp, 2048);
        $data = str_getcsv($line, ",");
        if (!isset($data[0]) || !is_numeric($data[0])) {
            continue;
        }
        $zip    = str_pad($data[0], 5, '0', STR_PAD_LEFT);
        $cities = [];
        if (!empty($data[3])) {
            $cities = explode(',', $data[3]);
        }
        if (!empty($data[4])) {
            $cities = array_unique(array_merge(
                $cities,
                explode(',', $data[4])
            ));
        }
        $zips[$zip] = [
            'zip'    => $zip,
            'cities' => $cities,
            'state'  => !empty($data[6])  ? $data[6]  : '',
            'lat'    => !empty($data[12]) ? $data[12] : '',
            'lon'    => !empty($data[13]) ? $data[13] : '',
        ];
    }
    fclose($fp);
    echo "USZC DB processed\n";
    return $zips;
}

function getCensusData( $year=2010 )
{
    if ( !preg_match('/^\d{4}$/',$year) ) {
      echo "GAZ Invalid year '$year'\n";
      return [];
    }
    $gaz_zip  = ($year==2010) ? 'Gaz_zcta_national.zip' : "{$year}_Gaz_zcta_national.zip";
    $gaz_dl   = ($year==2010) ? $gaz_zip : "{$year}_Gazetteer/{$gaz_zip}";
    $gaz_url  = "http://www2.census.gov/geo/docs/maps-data/data/gazetteer/{$gaz_dl}";
    $gaz_raw  = str_replace('.zip','.txt',$gaz_zip);

    if (!file_exists($gaz_raw)) {
        echo "GAZ $year Data not found\n";
        if (!file_exists($gaz_zip)) {
            echo "GAZ $year Zip download\n";
            file_put_contents(
                $gaz_zip,
                file_get_contents($gaz_url)
            );
        }
        $zip = new ZipArchive;
        if ($zip->open($gaz_zip) === true) {
            $zip->extractTo('./');
            $zip->close();
            echo "GAZ $year Unzipped\n";
        } else {
            echo "GAZ $year Unzip failed\n";
            return [];
        }
    } else {
        echo "GAZ $year Data found\n";
    }
    $zips = [];
    $fp = fopen($gaz_raw, 'r');
    while (!feof($fp)) {
        $line = fgets($fp, 2048);
        $data = str_getcsv($line, "\t");
        if (!isset($data[0]) || !is_numeric($data[0])) {
            continue;
        }
        $zip  = str_pad($data[0], 5, '0', STR_PAD_LEFT);
        $zips[$zip] = [
            'zip'    => $zip,
            'cities' => [],
            'state'  => '',
            'lat'    => !empty($data[7])? $data[7] : '',
            'lon'    => !empty($data[8])? $data[8] : '',
        ];
    }
    fclose($fp);
    echo "GAZ $year Data processed\n";
    return $zips;
}
