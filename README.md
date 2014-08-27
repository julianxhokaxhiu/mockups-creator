mockups-creator
===============

A NodeJS App that creates static HTML mockups using Grunt

# Introduction

This was built because of my needs to always kickstart a mockup in the fastest way as possible. So, this will bring a very flexible but powerful mockup generator based on various technologies.

## What I will get from this

It will create HTML files based on your `wwwPath` inside the [app.json](https://github.com/julianxhokaxhiu/mockups-creator/blob/master/app.json#L2) configuration files. Once you'll run the related `grunt` task, you'll get your output in that folder.

# Features

## Backend
- [Swig Templates](http://paularmstrong.github.io/swig/) ( just like Twig, but for Javascript )
- Web Fonts generator ( just place your TTF or OTF fonts in the fonts folder )
- SCSS ( with map files support so you can see from your inspector directly the SCSS file reference )
- Autoprefixing for CSS rules ( this give's you the freedom to not use anymore -webkit-, -moz-, etc. )
- [YUI](http://yui.github.io/yuicompressor/) compressor for CSS
- [Google Closure Compiler](https://developers.google.com/closure/compiler/) for Javascript

## Frontend
- jQuery 2.x ( or 1.x for older browsers )
- Bootstrap 3.x ( using bower to keep it aligned with latest updates )
- Fontawesome 4.x ( using bower to keep it aligned with latest updates )

## Deploy
- [Rsync](http://en.wikipedia.org/wiki/Rsync)

# Requirements

To run this you need these binaries to be available in your system

1. `fontforge`
2. `ttf2eot`
3. `batik-ttf2svg`

To test if they're working just type these names in your terminal and if they're working you're good to go.
Otherwise you should look at your OS documentation on how to get these binaries working.

**Notice:** These binaries are required by the [grunt-fontgen](https://github.com/agentk/grunt-fontgen) package and not directly by me.

# How to use

1. Run `npm install`.
2. Run `bower install`.
3. Adapt the [app.json](http) to fit your needs.
4. Run `grunt make:project_name`.
5. Work inside the [app](https://github.com/julianxhokaxhiu/mockups-creator/tree/master/app)/project_name folder that will be created.
6. Continue with your flow ( see down below )

---

- Normally when you start a project you should use
  ```
  grunt make:project_name
  ```

- While you're developing your mockup, run this task to build the project and watch for changes (usually you run this only once)
  ```
  grunt build:project_name
  ```

- If you want to build in Development mode your mockup but you don't want to watch it for changes
  ```
  grunt rebuild:project_name
  ```

- When you're finished and you're ready to deploy, but want to test it first
  ```
  grunt build_deploy:project_name
  ```

- When you're sure that everything is ok and want to deploy it using `rsync`
  ```
  grunt deploy:project_name
  ```

# Reference

- `_apptpl` folder is used as a starter template when you run `grunt make:project_name` task. Everything from this folder will be copied 1:1 to the `project_name` folder that you got from the `grunt make` task.
- `rsc` folder is used for resources like images, and other things that will be copied 1:1 to the `wwwPath` folder.
- `tpl` folder is used for templating your app. Here will live the SCSS, the Swig template files and the Javascript code. Everything inside this folder will be compacted, minified, autoprefixed, etc. by Grunt Tasks.
- `fonts` folder is used when you want to autogenerate webfonts based on `ttf` or `otf` desktop fonts. When you'll place some files here you'll get all known webfonts formats + a CSS file that will be minified with your SCSS file that exists in `tpl` folder. This will give a big speed boost to work with custom fonts without needing to create the CSS manually or with external tools.