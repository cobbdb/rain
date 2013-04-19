<?php

require "./private/eta.php";
H::setHome("./private/views/");
H::setBase("../base.view");

function buildMenuSet($wiki) {
    $menus = H::render("map.view");
    $menus .= H::render("graphs.view");
    $menus .= H::render("results.view");
    $menus .= H::render("input.view");
    $menus .= H::render("options.view");
    $menus .= H::render("help.view", Array(
        "wiki" => $wiki
    ));
    return $menus;
}


$head = H::render("head.view");

$wiki = "http://www.appropedia.org/Rainwater_Collection_Calculator";
$menus = buildMenuSet($wiki);
$busy = H::render("busy.view");
$body = H::render("index.view", Array(
    "menus" => $menus,
    "busy" => $busy,
    "wiki" => $wiki
));

echo H::render(null, Array(
    "head" => $head,
    "body" => $body
));
