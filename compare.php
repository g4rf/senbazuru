<?php

/*
 * Project: Senbazuru
 * Author: Jan Kossick, https://jankossick.de/cv/
 */

// working directory
$dirImages = getcwd() . '/images';
$dirOutput = getcwd() . '/output/data';

// read directory
$pixelinfos = [];
$files = scandir($dirImages);
foreach($files as $f) {
    if(strpos($f, '_pixel.json') === false) continue;
    $pixelinfos[] = $f;
}

// number of black pixels in comparing nodes
$ONES = 5;

// go through pixelinfos
$a = 0; $b = 0; $c = count($pixelinfos);

// eta calc
$numberOfCompares = $c * $c; $current = 0; $elapsed = []; $etaStart = microtime(true);

// lists
$comparisonlist = [];
$filelist = [];
if(file_exists("$dirOutput/filelist{$ONES}.js")) {
    $js = file_get_contents("$dirOutput/filelist{$ONES}.js");
    $filelist = json_decode(substr($js, 24, -1));
}

do {
    print "\ncomparing ".($a+1)."/$c with ".($b+1)."/$c "
        . "-- '{$pixelinfos[$a]}' with '{$pixelinfos[$b]}' \n";

    // file names
    $aName = substr($pixelinfos[$a], 0, -11);
    $bName = substr($pixelinfos[$b], 0, -11);
    $aNameComparison = "$dirImages/{$aName}_comparison{$ONES}.json";
    $bNameComparison = "$dirImages/{$bName}_comparison{$ONES}.json";

    // check if file already exists
    if(file_exists($aNameComparison)) {
        // go on
        $current = $current + 1000;
        $b = 0;
        $a++;
        $comparisonlist = [];
        print "-- image comparison already done\n";
        continue;
    }

    // check if already done
    if(file_exists($bNameComparison)) {
        $bList = json_decode(
            file_get_contents($bNameComparison), true);
        $similarity = $bList[$aName]['similarity'];

    } else {
        // read scanned image pixel data
        $pa = json_decode(file_get_contents("$dirImages/{$pixelinfos[$a]}"), true);
        $pb = json_decode(file_get_contents("$dirImages/{$pixelinfos[$b]}"), true);

        $similarity = 0;

        // go through all possible bits: 000 000 000 -> 111 111 111
        for($i = 0; $i < 512; $i++) {
            $bits = str_pad(decbin($i), 9, '0', STR_PAD_LEFT);

            // which nodes we want to compare?
            if(substr_count($bits, '1') < $ONES) continue;

            $ca = 0; $cb = 0;

            // both don't have this nodes
            if(empty($pa[$bits]) && empty($pb[$bits])) {
                $ca = 1; $cb = 1;
            } else { // one have this nodes
                if(! empty($pa[$bits])) $ca = count($pa[$bits]);
                if(! empty($pb[$bits])) $cb = count($pb[$bits]);
            }

            $similarity = ($similarity + min($ca, $cb) / max($ca, $cb)) / 2;

            //print "| checking $bits, similarity: $similarity\n";
        }
    }

    // add result to comparison list
    $comparisonlist[$bName] = [
        'name' => $bName,
        'similarity' => $similarity
    ];

    // finished
    print "-- image comparison completed\n";

    // check next
    if(++$b == count($pixelinfos)) {
        // all bs checked, next a

        // write comparison info
        $json = json_encode($comparisonlist);

        // as json in images folder
        print "|save comparison infos to {$aName}_comparison{$ONES}.json\n";
        file_put_contents($aNameComparison, $json);

        // as javascript for html output
        print "|save comparison infos for javascript\n";

        copy($aNameComparison, "$dirOutput/{$aName}_comparison{$ONES}.json");
        // file list
        $filelist[] = [
            'image' => $aName,
            'comparison' => "{$aName}_comparison{$ONES}.json"
        ];
        $js = "var SenbazuruFileList{$ONES} = " . json_encode($filelist) . ';';
        file_put_contents("$dirOutput/filelist{$ONES}.js", $js);

        // reset b
        $b = 0;
        $a++;
        $comparisonlist = [];
    }

    // calc ETA
    $elapsed[] = microtime(true) - $etaStart; // time elapsed
    $etaStart = microtime(true); // start counting
    $remainingCompares = $numberOfCompares - ++$current;
    $remainingTime = array_sum($elapsed) / count($elapsed) * $remainingCompares;
    $elapsed = array_slice($elapsed, -1000);

    print "\ncompares: $current/$numberOfCompares (remaining: $remainingCompares)\n";
    print "ETA: " . gmdate('z\d G\h i\m s\s', $remainingTime) . "\n";

} while($a < $c);

print "\n";

print "\nfertig! 🥳\n"; // here is a hidden party unicode character