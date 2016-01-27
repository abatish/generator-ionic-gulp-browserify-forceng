### Installation

npm install --save-dev https://github.com/abatish/generator-ionic-gulp-browserify-forceng.git

# Additional Setup
- to use the proxy; you'll need to know what instance you're hitting; not just
if its test or prod. once you know it, you'll need to update the ./gulp/serve
proxies to accurately reflect the instance. if you don't set it up correctly,
you'll see errors in your console like "Destination URL not reset"

- the oauth redirect needs to go to ANY page on the app's domain that WON'T
trigger a redirect. in the template we just default it to the root, but if
you have an otherwise route set; the params may get scrubbed before forceng
can see them. on the device this doesn't matter but for local dev either pick
a resource file or include an empty html file in your served directories
