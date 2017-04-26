#!/bin/bash
CASPER_PATH="node_modules/.bin";
cat sites.txt | xargs -P1 -I{} $CASPER_PATH/casperjs test "./tests/regressionTest.js" --url="{}";
cat sites.txt | xargs -P1 -I{} $CASPER_PATH/casperjs test "./tests/regressionTest.js" --url="{}" --engine=slimerjs