#!/bin/bash
cat sites.txt | xargs -P10 -I{} casperjs test ./tests/dev_tests/apiCheck-nav.js --url={}