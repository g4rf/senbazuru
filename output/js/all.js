/*
 * Project: Senbazuru
 * Author: Jan Kossick, https://jankossick.de/cv/
 */

/* global SenbazuruFileList */

var senbazuruAllOutput = function(a, fileName, container) {
    var compares = [];
    var low = $("#low").val() / 100;
    var high = $("#high").val() / 100;
    $.getJSON(fileName, function(data) {
        // convert object to array
        $.each(data, function(b, compare) {
            // sort out self
            if(compare.name == a) return true;
            // sort out > high and < low
            if(compare.similarity > high ||
               compare.similarity < low) return true;
            // add to array
            compares.push({
                "name": compare.name,
                "similarity": compare.similarity,
            });
        });

        // sort
        compares.sort(function(a, b) {
            if(a.similarity < b.similarity) {
                return -1;
            }
            if(a.similarity > b.similarity) {
                return 1;
            }
            return 0;
        });

        // output
        var line = false;
        $.each(compares, function(i, p) {
            if(! line && p.similarity > high) {
                $("<br><hr><br>").insertAfter($(".image.template", container));
                line = true;
            }

            var image = $(".image.template", container).clone()
                    .removeClass("template")
                    .insertAfter($(".image.template", container));

            $("img", image).prop({
                src: "../images/" + p.name,
                title: p.name
            });
            $(".name", image).append(p.name);
            $(".similarity", image).append(
                    p.similarity * 100 + " %");
                    //Math.round(p.similarity * 10000) / 100);
        });
    });
};

var senbazuruAllBlocks = function(pixels, output, blocks) {
    var count = 0;
    $.each(blocks, function(index, key) {
        if(typeof pixels[key] != "undefined") {
            count += Object.keys(pixels[key]).length;            
        }
    });
    $(output).empty().append(count);
};

$(window).on("load", function() {
    // load files
    $.each(SenbazuruFileList, function(index, file) {
        $("<option />").prop("value", "data/" + file.comparison)
                .append(file.image).appendTo($("#filelist"));
    });
    // select first element
    $("#filelist")[0].selectedIndex = 0;
    $("#filelist").trigger("change");
});

$("#filelist, #low, #high").on("change", function() {
    // tidy up
    $(".content .image").not(".template").remove();
    $("img.a").prop({
        src: "",
        title: ""
    });
    $(".a .name").empty();

    // get image name
    var a = $("#filelist option:selected").text();
    $(".a .name").append(a);
    $("img.a").prop({
        src: "../images/" + a,
        title: a
    });
    
    // blocks & crosses
    $.getJSON("../images/" + a + "_pixel.json", function(pixels) {
        // crosses
        senbazuruAllBlocks(pixels, ".crosses", [
            "101010101", "010111010", "111010010", "100111100", "010010111",
            "001111001"
        ]);
        
        // blocks: frei count
        countBlocksFrei(pixels);
    });

    // one pixel
    var fileName = $("#filelist option:selected").val();
    senbazuruAllOutput(a, fileName, $("div.pixel1"));
    
    // five pixel
    var fileName5 = fileName.substr(0, fileName.length - 5) + "5.json";
    senbazuruAllOutput(a, fileName5, $("div.pixel5"));
});


var countBlocksFrei = function(pixels) {
    // 1
    senbazuruAllBlocks(pixels, ".block1", [
        "100010000", "100010001", "010010010", "000111000", "001010000", 
        "000011000", "000110000", "000010100", "000010001", "000010010",
        "010010000", "001010100"
    ]);
    // 2
    senbazuruAllBlocks(pixels, ".block2", [
        "100010010", "100010100", "100011000", "100110000", "101010000",
        "110010000", "010011000", "000110010", "000011001", "001011000",
        "001010010", "011010000", "000110100", "000010011", "000011100",
        "001110000", "000110001", "010010001", "000010110", "000011010", 
        "010110000", "010010100", "001010001"
    ]);
    // 3
    senbazuruAllBlocks(pixels, ".block3", [
        "100010011", "100010110", "100011001", "100110001", "100110010", 
        "100110100", "100111000", "101010010", "101010100", "101011000",
        "101110000", "101110001", "110010001", "110010010", "110010100",
        "110011000", "110110000", "111010000", "011010010", "001011010",
        "010010011", "010010110", "010110100", "010011001", "001011001", 
        "010110010", "000011011", "000110110", "010011010", "000111100",
        "001111000", "000011110", "011110000", "000111001", "000110011",
        "011011000", "000111010", "000010111", "010111000", "001110100",
        "001011100", "001010110", "011010100", "010011100", "000011101",
        "000110101", "011010001", "001010011", "001110001", "010110001"
    ]);
    // 4
    senbazuruAllBlocks(pixels, ".block4", [
        "100010111", "100011011", "100011101", "100011110", "100110011",
        "100110101", "100110110", "100111001", "100111010", "100111100",
        "101010011", "101010101", "101010110", "101011001", "101011010",
        "101011100", "101110010", "101110100", "101111000", "110010011",
        "110010101", "110010110", "110011001", "110011010", "110011100",
        "110110001", "110110010", "110110100", "110111000", "111010001",
        "111010010", "111010100", "111011000", "111110000", "001011011",
        "011011010", "011010110", "010110110", "011011001", "010011101",
        "010011011", "010010111", "001011110", "011110100", "011010011",
        "000011111", "000111110", "011111000", "000110111", "000111011",
        "000111101", "001111100", "001110011", "001111001", "001010111",
        "010110011", "010111001", "010111001", "011011100", "011110001",
        "011110010", "001111010", "001110110", "010110101", "010011110",
        "001011101", "010111010", "010111100", "011010101", "001110101"
    ]);
    // 5
    senbazuruAllBlocks(pixels, ".block5", [
        "100011111", "100110111", "100111011", "100111101", "100111110",
        "101011011", "101011101", "101011110", "101110011", "101110101",
        "101110110", "101111001", "101111010", "101111100", "110010111",
        "110011011", "110011101", "110011110", "110110011", "110110101",
        "110110110", "110111001", "110111010", "110111100", "111010011",
        "111010110", "111011001", "111011010", "111011100", "111110001",
        "111110010", "111110100", "111111000", "011011011", "001011111",
        "010110111", "000111111", "011110110", "011011110", "001111110",
        "011011101", "010111101", "010111011", "011111100", "011110011",
        "001110111", "010011111", "001111011", "011111001", "010111110",
        "001111101", "011110101", "011111010", "011010111"
    ]);
    // 6
    senbazuruAllBlocks(pixels, ".block6", [
        "100111111", "101011111", "101110111", "101111011", "101111101",
        "101111110", "110011111", "110110111", "110111011", "110111101",
        "110111110", "111010111", "111011011", "111011101", "111011110",
        "111110011", "111110101", "111110110", "111111001", "111111010",
        "111111100", "011011111", "011111101", "001111111", "010111111",
        "011110111", "011111110", "011111011", "000011001"
    ]);
    // 7
    senbazuruAllBlocks(pixels, ".block7", [
        "101111111", "110111111", "111011111", "111110111", "111111011",
        "111111101", "111111110", "011111111"
    ]);
    // 8
    senbazuruAllBlocks(pixels, ".block8", [
        "111111111"
    ]);    
};