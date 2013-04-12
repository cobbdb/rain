<?php

require "../util/Engine.php";

function buildMenuSet($wiki) {
    $menus = Template::render("./private/views/map.view");
    $menus .= Template::render("./private/views/graphs.view");
    $menus .= Template::render("./private/views/results.view");
    $menus .= Template::render("./private/views/input.view");
    $menus .= Template::render("./private/views/options.view");
    $menus .= Template::render("./private/views/help.view", Array(
        "wiki" => $wiki
    ));
    return $menus;
}


$head = Template::render("./private/views/head.view");

$wiki = "http://www.appropedia.org/Rainwater_Collection_Calculator";
$menus = buildMenuSet($wiki);
$busy = Template::render("./private/views/busy.view");
$body = Template::render("./private/views/index.view", Array(
    "menus" => $menus,
    "busy" => $busy,
    "wiki" => $wiki
));

echo Template::render(null, Array(
    "head" => $head,
    "body" => $body
));
