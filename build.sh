#!/bin/bash

mkdir -p output

MIN_SCRIPT='<script type="text/javascript" src="x.js"></script>'

cp index.html index.html.tmp
while read -r line
do
    [[ ! $line =~ "</script>" ]] && echo "$line"
    [[ $line =~ "</body>" ]] && echo "$MIN_SCRIPT" && echo "$line"
done < index.html.tmp > output/index.html
rm -f index.html.tmp

html-minifier --collapse-whitespace --remove-comments --remove-optional-tags --remove-redundant-attributes --remove-script-type-attributes --remove-tag-whitespace --use-short-doctype output/index.html -o output/index.html

yuicompressor main.css -o output/main.css

rm -f output/x.js
cat controller.js >> x.js
cat background.js >> x.js
cat foreground.js >> x.js

./uglifyjs -mt x.js > output/x.js
rm -f x.js
