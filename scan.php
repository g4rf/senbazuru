<?php

/*
 * Project: Senbazuru
 * Author: Jan Kossick, https://jankossick.de/cv/
 */

// working directory
$dir = getcwd() . '/images/';

// read info about previously scanned images from .scanned
$scanned = [];
if(file_exists("$dir/.scanned")) {
    $scanned = json_decode(file_get_contents("$dir/.scanned"), true);
}

// read directory
$images = scandir($dir);
if(count($images) < 3) {
    print "no images in $dir found\n";
    exit;
}

// go through images
foreach($images as $img) {
    if(in_array($img,
        ['.', '..', '.scanned', 'comparison.json'])) continue;
    if(strpos($img, '_raw.png') || strpos($img, '_pixel.json')) continue;

    $filename = "$dir/$img";

    print "\nprocessing $img\n";

    // check file date in .scanned
    if(! empty($scanned[$img])) {
        if($scanned[$img] == filectime($filename)) {
            print "-- file already scanned\n";
            continue;
        }
    }

    // get image ressource
    $src = imagecreatefromstring(file_get_contents($filename));

    // scale to 200x200
    print "| downscale image\n";
    list($width, $height) = getimagesize($filename);
    $raw = imagecreatetruecolor(200, 200);
    imagecopyresized($raw, $src, 0, 0, 0, 0, 200, 200, $width, $height);

    // set value for black & white
    $whiteblack = [
        imagecolorallocate($raw, 255, 255, 255),
        imagecolorallocate($raw, 0, 0, 0)
    ];

    // walk though pixels (omit an one pixel border as it'll be covered by the 3x3 blocks)
    $pixelcache = [];
    $pixelinfo = [];
    print "| scan pixel\n";
    for ($h = 1; $h < 200 - 1; $h++) {
        for ($w = 1; $w < 200 - 1; $w++) {

            $bits = '';

            $i = -1; $j = -1;
            do {
                $w9 = $w + $i; $h9 = $h + $j;

                $bit = 1; // black
                if(empty($pixelcache[$w9][$h9])) { // calc value
                    // get the rgba value for current pixel
                    $rgba = imagecolorat($raw, $w9, $h9);
                    $c = imagecolorsforindex($raw, $rgba);

                    // ! alpha won't work reliable, maybe check imagealphablending()
                    // alpha is transparency from 0 (opaque) to 127 (transparent)
                    //if($c['alpha'] > 127 / 2) $bit = 0;
                    //else { // set treshold for white here
                    //    if(($c['red'] + $c['green'] + $c['blue']) / 3 > 200) $bit = 0;
                    //}

                    $grey = ($c['red'] + $c['green'] + $c['blue']) / 3;
                    //readline($grey);
                    if($grey > 200) $bit = 0;
                    $pixelcache[$w9][$h9] = $bit;
                } else { // get value from cache
                    $bit = $pixelcache[$w9][$h9];
                }

                // add bit to bits
                $bits .= $bit;

                // set the color value
                imagesetpixel($raw, $w9, $h9, $whiteblack[$bit]);

                if(++$i == 2) {
                    $i = -1;
                    $j++;
                }
            } while ($j < 2);

            // drop pixels with 000000000
            //if($bits == '000000000') continue;

            // add pixel info
            $pixelinfo[$bits][] = [
                'color' => $bits, 'x' => $w, 'y' => $h
            ];
        }
    }

    // save pixelinfo in FILENAME_pixel.json
    print "| save pixelinfo to {$img}_pixel.json\n";
    file_put_contents($filename . '_pixel.json',
            json_encode($pixelinfo, JSON_FORCE_OBJECT));

    // save scaled image as FILENAME_raw.png
    print "| save down- and greyscaled image to {$img}_raw.png\n";
    imagepng($raw, $filename . '_raw.png');

    // save file name and date to .scanned
    print "| add file info to scanned images\n";
    $scanned[$img] = filectime($filename);

    // free memory
    imagedestroy($raw);
    imagedestroy($src);

    print "-- image successfully processed\n";
}

print "\n";

// save .scanned
print "save file infos to .scanned\n";
file_put_contents("$dir/.scanned", json_encode($scanned, JSON_FORCE_OBJECT));

print "\nfertig! ?\n";