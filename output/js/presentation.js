/*
 * Project: Senbazuru
 * Author: Jan Kossick, https://jankossick.de/cv/
 */

/* global SenbazuruFileList */

var slog = function(text) {
    if(typeof text == "undefined") {
        $("#slog").hide().empty();
        return;
    }
    $("#slog").empty().show().append(text);
};

var pairs = [];

// load data
var current = 1; var count = SenbazuruFileList.length;
$.each(SenbazuruFileList, function(index, file) {
    var a = file.image;

    // load json
    $.getJSON("data/" + file.comparison, function(data) {
        current++;

        var selSimilarity = 0;
        var selB;
        $.each(data, function(b, compare) {

            slog("read compare data of " + a + " (" + current + " of " + count + ")");

            if(a == b) return true; // same image
            if(compare.similarity > selSimilarity) {
                selSimilarity = compare.similarity;
                selB = b;
            }
        });
        pairs.push({
            "a": a,
            "b": selB,
            "similarity": selSimilarity
        });

        // start show
        if(current >= count) {
            slog("sorting pairs");
            // sort pairs
            pairs.sort(function(a, b) {
                if(a.similarity < b.similarity) {
                    return 1;
                }
                if(a.similarity > b.similarity) {
                    return -1;
                }
                return 0;
            });

            // go
            slog();
            $(".wall").css("visibility", "visible");
            next();
        }
    });
});

// output data
var i = 0;
var up = true; // up or down
var next = function() {
    var wall = $(".wall.even");
    var other = $(".wall.odd");
    if(i % 2 == 1) { // odd
        wall = $(".wall.odd");
        other = $(".wall.even");
    }

    var c = pairs[i];

    $("img.a", wall).prop("src", "../images/" + c.a);
    $("img.b", wall).prop("src", "../images/" + c.b);
    $(".info span", wall).empty().append(Math.round(c.similarity * 10000) / 100);

    wall.fadeIn(2500);
    other.fadeOut(2500);

    // next one
    if(up) {
        i++;
        if(i == pairs.length) {
            up = false;
            i = i - 2;
        }
    } else { // down
        i--;
        if(i == -1) {
            up = true;
            i = i + 2;
        }
    }

    // timer
    window.setTimeout(next, 5000);
};