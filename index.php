<?php

require "./private/eta.php";
H::setHome("./private/views/", true);
H::setBase("../base.view");

$head = H::render("head.view");
$body = H::render("index.view");

echo H::render(null, Array(
    "head" => $head,
    "body" => $body
));
