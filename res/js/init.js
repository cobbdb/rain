$(function () {
    /*$("#busyMenu").dialog({
        autoOpen: false,
        modal: true,
        resizable: false,
        draggable: false,
        closeOnEscape: false,
        title: "Please Wait"
    });
    
    $("#menus").tabs();
    
    $(window).resize(function () {
        if ($("#page").width() < 425) {
            $("#menus .title").hide();
        } else {
            $("#menus .title").show();
        }
    });
    $(window).resize();*/
    
    /**
     * Field prefill browser compatibility fix.
     * @see http://www.hagenburger.net/BLOG/HTML5-Input-Placeholder-Fix-With-jQuery.html
     */
    /*$("[placeholder]").focus(function () {
        var input = $(this);
        if (input.val() == input.attr("placeholder")) {
            input.val("");
            input.removeClass("placeholder");
        }
    }).blur(function () {
        var input = $(this);
        if (input.val() == "" || input.val() == input.attr("placeholder")) {
            input.addClass("placeholder");
            input.val(input.attr("placeholder"));
        }
    }).blur();
    $("[placeholder]").parents("form").submit(function () {
        $(this).find("[placeholder]").each(function () {
            var input = $(this);
            if (input.val() == input.attr("placeholder")) {
                input.val("");
            }
        })
    });*/
    
    
    
    /*
    mapInit();
    
    $("#graph_area").hide();
    //$("#graph_link").hide();
    $("#io_reset").hide();
    
    // load the initial material name into output
    $("#out_material").html($("#input_material_box option:selected").text());
    // load the new material value into output
    $("#out_efficiency").html(getEfficiency() * 100 + "%");
    
    clearDoneButton();
    $("#img_arrow_reset").hide();
    
    // load certain page elements
    loadMonths("io_rain_inputs", "precip");
    loadMonths("input_usage", "usage");
    loadPrecipitationValues();
    
    toggleAutoFill(); // turn on by default
    
    // ensure the GMap
    map.checkResize();
    
    // calculate initial tank size
    updateTankSize();
    
    // start in US unit system
    setGlobalUnit( u_us );
    */
});
