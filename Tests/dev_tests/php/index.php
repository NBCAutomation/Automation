<?php
    define('__ROOT__', dirname(dirname(__FILE__))); 
    require_once(__ROOT__.'/SpireTests/Browser/Casper.php');

    use Browser\Casper;

    $casper = new Casper();

    // forward options to phantomJS
    // for exemple to ignore ssl errors
    $casper->setOptions(array(
        'ignore-ssl-errors' => 'yes'
    ));

    // navigate to google web page
    $casper->start('http://www.google.com');

    // run the casper script
    $casper->run();

    var_dump($casper->assertSelectorHasText('#lga'));

    // check the urls casper get throught
    var_dump($casper->getRequestedUrls());

    // need to debug? just check the casper output
    var_dump($casper->getOutput());

?>