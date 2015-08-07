<?php

// $user_input = $_POST['user_input'];

putenv("PHANTOMJS_EXECUTABLE=/usr/local/bin/phantomjs");

exec('~/Documents/Repositories/Applications/SpireTests/spire_tests/casperjs test 404Spider.js --url="http://www.nbcmiami.com"',$output);

print_r($output);

?>