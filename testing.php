<?php
header('Content-Encoding: none;');

set_time_limit(0);

$handle = popen("cat ./tmp/__tempSites_246595878.txt | xargs -P1 -I{} ./run.sh apiCheck-nav --url=\"{}\"", "r");

if (ob_get_level() == 0)
ob_start();

while(!feof($handle)) {
    $buffer = fgets($handle);
    $buffer = trim(htmlspecialchars($buffer));

    echo $buffer . "<br />";
    echo str_pad('', 4096);

    ob_flush();
    flush();
    sleep(1);
}

pclose($handle);
ob_end_flush();
?>