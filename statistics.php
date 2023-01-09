<?php

/*
 * Project: Senbazuru
 * Author: Jan Kossick, https://jankossick.de/cv/
 */

// working directory
$dirImages = getcwd() . '/images';
$dirOutput = getcwd() . '/output/data';

// statistics
$statistics = [];
for($i = 0; $i <= 100; $i++) {
    $statistics[$i] = [];
}

// read comparison info
$files = scandir($dirImages);
foreach($files as $f) {
    if(strpos($f, '_comparison.json') === false) continue;

    print "read $f\n";
    $compares = json_decode(file_get_contents("$dirImages/$f"), true);
    $aName = substr($f, 0, -16);

    foreach($compares as $c) {
        $key = intval( floor( $c['similarity'] * 100 ) );

        if(! in_array([$c['name'], $aName], $statistics[$key])) {
            $statistics[$key][] = [$aName, $c['name']];
        }
    }
}

// save statistics
file_put_contents("$dirOutput/statistics.json", json_encode($statistics));
print "file $dirOutput/statistics.json saved\n";