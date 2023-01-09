<?php

/*
 * Project: Senbazuru
 * Author: Jan Kossick, https://jankossick.de/cv/
 */

// working directory
$dirImages = getcwd() . '/images';
$dirOutput = getcwd() . '/output/data';

// statistics
$blocks = [];

// read comparison info
$files = scandir($dirImages);
foreach($files as $f) {
    if(strpos($f, '_pixel.json') === false) continue;

    print "read $f\n";
    $pixels = json_decode(file_get_contents("$dirImages/$f"), true);
    $aName = substr($f, 0, -11);

    foreach($pixels as $key => $values) {
        if($key == '000000000') continue;
        
        $count = count($values);
        if($count == 0) continue;
        
        if(! isset($blocks[$key])) $blocks[$key] = 0;
        $blocks[$key] += $count;
    }
}

// save statistics
file_put_contents("$dirOutput/blocks.json", json_encode($blocks));
print "file $dirOutput/blocks.json saved\n";