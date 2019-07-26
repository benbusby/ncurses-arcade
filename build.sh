#!/bin/bash

rm -rf output/
mkdir -p output

# Set up single line imports of the minified js/css
MIN_SCRIPT='<script type="text/javascript" src="x.js"></script>'
MIN_CSS='<link rel="stylesheet" href="main.css">'

cp index.html index.html.tmp

# Replace all existing imports with the new condensed scripts
while read -r line
do
    [[ ! $line =~ "</script>" ]] && echo "$line"
    [[ $line =~ "main.css" ]] && echo "$MIN_CSS"
    [[ $line =~ "</body>" ]] && echo "$MIN_SCRIPT" && echo "$line"
done < index.html.tmp > output/index.html
rm -f index.html.tmp

html-minifier --collapse-whitespace --remove-comments --remove-optional-tags --remove-redundant-attributes --remove-script-type-attributes --remove-tag-whitespace --use-short-doctype output/index.html -o output/index.html

yuicompressor ./css/main.css -o output/main.css

# Add all javascript to a single file for minifying
rm -f x.js
rm -f output/x.js
cat ./js/controller.js >> x.js
cat ./js/player.js >> x.js
cat ./js/background.js >> x.js
cat ./js/foreground.js >> x.js
cat ./js/sound.js >> x.js
cat ./js/scoreboard.js >> x.js

# Minify and mangle the javascript file
uglifyjs --mangle toplevel,eval --compress --mangle-props -- x.js > output/x.js
rm -f x.js
