/*
 * Project: Senbazuru
 * Author: Jan Kossick, https://jankossick.de/cv/
 */

/* global SenbazuruFileList */

$(document).ready(function() {
    // load files
    $.each(SenbazuruFileList, function(index, file) {
        $("<option />").prop("value", "data/" + file.comparison)
                .append(file.image).appendTo($(".filelist"));
    });
    // select first element
    $(".filelist")[0].selectedIndex = 0;
    $(".filelist").trigger("change");
});

$(".filelist").on("change", function(e) {
    e.preventDefault();

    // set image
    var a = $(".wall.a .filelist option:selected").text();
    $(".wall.a img").prop({
        src: "../images/" + a,
        title: a
    });

    var b = $(".wall.b .filelist option:selected").text();
    $(".wall.b img").prop({
        src: "../images/" + b,
        title: b
    });

    // get similarity
    $.getJSON($(".wall.a .filelist option:selected").val(), function(data) {
        $(".wall.info .similarity").empty()
                .append(data[b].similarity * 100);
    });
});