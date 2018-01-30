#!/bin/bash
CASPER_PATH="node_modules/.bin";
shuf -n 1 sites.txt | xargs -P1 -I{} casperjs test "./tests/regressionTest.js" --url="{}";
shuf -n 1 stage_sites.txt | xargs -P1 -I{} casperjs test "./tests/regressionTest.js" --url="{}"