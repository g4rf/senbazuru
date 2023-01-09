/*
 * Project: Senbazuru
 * Author: Jan Kossick, https://jankossick.de/cv/
 */

var info = function(text) {
    if(!text) {
        $(".statistics .info").hide();
        return;
    }
    $(".statistics .info").empty().append(text).show();
};

$(".statistics .table").on("click", ".cell", function() {
    // headline
    $(".statistics h3 .percent").empty().append($(this).data("percent"));

    // compare info
    var comparesInfo = $(".statistics .compares-info").empty();
    $.each($(this).data("compares"), function(index, compare) {
        var line = $("<div class='line'>"
                + compare[0] + " - " + compare[1] +
            "</div>").data("compare", compare);
        comparesInfo.append(line);
    });
});

$(".statistics .compares-info").on("click", ".line", function() {
    var self = $(this);
    var a = self.data("compare")[0];
    var b = self.data("compare")[1];

    if($("img", self).length > 0) {
        $("img", self).remove();
        $("br", self).remove();
    } else {
        self.append("<br />"
                + "<img alt='" + a + "' src='../images/" + a + "' />"
                + "<img alt='" + b + "' src='../images/" + b + "' />");
    }
});

$(document).ready(function() {
    $.getJSON("data/statistics.json", function(data) {

        var table = $(".statistics .table");
        $.each(data, function(percent, compares) {
            var cell = $(".template.cell", table).clone()
                    .removeClass("template")
                    .appendTo(table);
            $(".percent", cell).append(percent + " %");
            $(".count", cell).append(compares.length.toLocaleString("de-DE"));
            cell.data("percent", percent);
            cell.data("compares", compares);
        });

        info();
    });
});