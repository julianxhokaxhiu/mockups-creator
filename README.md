mockups-creator
===============

A NodeJS App that creates static HTML mockups using Grunt

# Introduction

This was built because of my needs to always kickstart a mockup in the fastest way as possible. So, this will bring a very flexible but powerful mockup generator based on various technologies.

# Features

## Backend
- [Swig Templates](http://paularmstrong.github.io/swig/) ( just like Twig, but for Javascript )
- Web Fonts generator ( just place your TTF or OTF fonts in the fonts folder )
- SCSS ( with map files support so you can see from your inspector directly the SCSS file reference )

## Frontend
- Bootstrap 3.x ( using bower to keep it aligned with latest updates )
- Fontawesome 4.x ( using bower to keep it aligned with latest updates )

## Generator

It will create HTML files based on your `wwwPath` inside the [app.json](https://github.com/julianxhokaxhiu/mockups-creator/blob/master/app.json#L2) configuration files. Once you'll run the related `grunt` task, you'll get your output in that folder.

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

- While you're developing your mockup
  ```
  grunt build:project_name
  ```

- When you're finished and you're ready to deploy, but want to test it first
  ```
  grunt build_deploy:project_name
  ```

- When you're sure that everything is ok and want to deploy it using `rsync`
  ```
  grunt deploy:project_name
  ```