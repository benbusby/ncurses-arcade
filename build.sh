#!/bin/bash

mkdir -p output

html-minifier --collapse-whitespace --remove-comments --remove-optional-tags --remove-redundant-attributes --remove-script-type-attributes --remove-tag-whitespace --use-short-doctype index.html -o output/index.html
yuicompressor main.css -o output/main.css
yuicompressor controller.js -o output/controller.js
