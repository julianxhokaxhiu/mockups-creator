
mockups-creator v2
==================

A NodeJS App that creates static HTML mockups using Grunt

> DEPRECATED! Use this project at your own risk. It will be no more maintained, and the Docker is just my last resort to give a proper environment for every single application kickstarted with this boilerplate. Please consider using [Hugo](https://gohugo.io/) as an alternative.

# Introduction

This was built because of my needs to always kickstart a mockup in the fastest way as possible. So, this will bring a very flexible but powerful mockup generator based on various technologies.

## What is this?

This is a yeoman-like project. It will help you to kickstar mockups in no-time.

## Why do you think this is so special

Because I want to create a platform for independent mockups that doesn't really belongs to some CMS or other technology. This is also different from the simple "static site generator" that you can find elsewhere.

I love to be flexible and indipendent from the platforms. That's why I built this tool.

## What does the mockup start template have?

**Backend**

- Customizable [Gruntfile.js](https://github.com/julianxhokaxhiu/mockups-creator/blob/master/_apptpl/Gruntfile.js).
- [Swig Templates](http://paularmstrong.github.io/swig/) ( just like Twig, but for Javascript )
- Template custom data customizable via JSON file ( see [app.json](https://github.com/julianxhokaxhiu/mockups-creator/blob/master/_apptpl/app.json#L18) file )
- Web Fonts generator ( just place your TTF or OTF fonts in the fonts folder )
- Web Icons generator based on SVG files ( just place them in the icons folder )
- SCSS ( with map files support so you can see from your inspector directly the SCSS file reference )
- Autoprefixing for CSS rules ( this give's you the freedom to not use anymore -webkit-, -moz-, etc. )
- [YUI](http://yui.github.io/yuicompressor/) compressor for CSS
- [Google Closure Compiler](https://developers.google.com/closure/compiler/) for Javascript
- Auto-rebuild + Live Reload when editing swig, scss or js files
- Static file server. No more depending on Apache, Nginx, etc.
- Auto-update, of NPM packages and Bower packages, once a day on build

**Frontend**

- [jQuery](https://jquery.com/) 2.x ( or 1.x for older browsers )
- [Bootstrap](http://getbootstrap.com/) 3.x ( using bower to keep it aligned with latest updates )
- [Fontawesome](http://fortawesome.github.io/Font-Awesome/) 4.x ( using bower to keep it aligned with latest updates )
- [Ion Icons](http://ionicons.com/) 2.x ( using bower to keep it aligned with latest updates )
- [Modernizr](http://modernizr.com/) + [Detectizr](https://github.com/barisaydinoglu/Detectizr)
- [bootstrap-toolkit](https://github.com/maciej-gurban/responsive-bootstrap-toolkit) media-queries for Javascript
- Customizable [bower.json](https://github.com/julianxhokaxhiu/mockups-creator/blob/master/_apptpl/bower.json).
- Default template ( ready for IE8+, Chrome, Firefox, Safari, iOS, Android, etc. ) using the most awesome techniques out there to simply the work for you :)

**Deploy**

- [Rsync](http://en.wikipedia.org/wiki/Rsync)

**Output**

- [TYPO3](http://typo3.org/) extension output with Grunt script for building again all the "opened" files like SCSS, JS, Fonts and Icons

# Requirements

To run this you need these binaries to be available in your system

1. `fontforge` ( required by [grunt-fontgen](https://github.com/agentk/grunt-fontgen) and [grunt-webfont](https://github.com/sapegin/grunt-webfont) )
2. `ttf2eot` ( required by [grunt-fontgen](https://github.com/agentk/grunt-fontgen) )
3. `batik-ttf2svg` ( on OSX ) or `ttf2svg` ( on Linux ) ( required by [grunt-fontgen](https://github.com/agentk/grunt-fontgen) ) 

To test if they're working just type these names in your terminal and if they're working you're good to go.
Otherwise you should look at your OS documentation on how to get these binaries working.

# How to use

1. Run `npm install`.
2. Run `grunt make --app=project_name`.
3. Wait for the cool stuff to be done
4. Work inside the _[app](https://github.com/julianxhokaxhiu/mockups-creator/tree/master/app)/project_name/_ folder that will be created.
5. Configure your _app/project_name/[app.json](https://github.com/julianxhokaxhiu/mockups-creator/blob/master/_apptpl/app.json)_ with the desired values.
6. Run one of the commands down below.

---

- Normally when you start a project you should use
  ```
  grunt make --app=project_name
  ```

- While you're developing your mockup, run this task to build the project and watch for changes (usually you run this only once)
  ```
  grunt build --app=project_name
  ```

- If you want to build in Development mode your mockup but you don't want to watch it for changes
  ```
  grunt rebuild --app=project_name
  ```

- When you're finished and you're ready to deploy, but want to test it first
  ```
  grunt build_deploy --app=project_name
  ```

- When you're sure that everything is ok and want to deploy it using `rsync`
  ```
  grunt deploy --app=project_name
  ```

- When you want to output your project as a TYPO3 extension
  ```
  grunt typo3 --app=project_name
  ```

# Arguments Reference

- `--app` is the option that says which app to run based on your chosen task.
- `--customtask` is for custom tasks developed inside your app that doesn't belong to the core mockups-creator tasks.

# `Directories` reference

- `_apptpl` folder is used as a starter template when you run `grunt make --app=project_name` task. Everything from this folder will be copied 1:1 to the `project_name` folder that you got from the `grunt make` task.
- `fonts` folder is used when you want to autogenerate webfonts based on `ttf` or `otf` desktop fonts. When you'll place some files here you'll get all known webfonts formats + a CSS file that will be minified with your SCSS file that exists in `tpl` folder. This will give a big speed boost to work with custom fonts without needing to create the CSS manually or with external tools.
- `icons` folder is used to autogenerate icons for your website based on SVG files. Just put them there and you'll get all the job done automatically. You can simply use them as 'project_name-icon-svgfilename' classes.
- `rsc` folder is used for resources like images, and other things. All the items inside this folder will be copied to the root of your `output.path` configuration or `typo3.path` configuration.
- `tpl` folder is used for templating your app. Here will live the SCSS, the Swig template files and the Javascript code. Everything inside this folder will be compacted, minified, autoprefixed, etc. by Grunt Tasks.
- `_typo3` is used to copy 1:1 to the packaged typo3 extension that will be built using the relative task.

# `app.json` reference
```javascript
{
	"config" : {
		"output" : {
			// The output path of your project
			"path" : "_release"
		},
		"livereload" : {
			// The livereload port
			"port" : 35729,
			// The livereload host
			"host" : "localhost"
		},
		"server" : {
			// The static server port. -1 means disabled.
			"port" : -1
		},
		"deploy" : {
			// The rsync path on the remote server
			"path" : "/var/www",
			// The rsync host of the remote server
			"host" : "localhost"
		},
		"typo3" : {
			// Typo3 main folder where your extension is going to be saved.
			// Inside this folder will be created based on your project_name and suffix property below.
			"path" : "_typo3ext",
			// Suffix to be appended to the project name when creating the folder
			"suffix" : "_core"
		}
	},
	// This will be the assets configuration
	"assets" : {
    // Tells to copy all the found fonts in these paths, in our {output.path}/fonts/ folder
    "fonts" : [
      "..."
    ],
		// Tells to build/deploy tasks, the resources and their order to be compiled to a singular JS file
		"js" : [
			"bower_components/...",
			"...",
			"tpl/js/*.js"
		]
	},
	// Custom template data
	"data" : {
		"foo" : "bar"
	}
}
```
Basically the `config.json` is the same as `app.json` and will override its settings.

# Moving from v1 to v2

- `cd app/project_name` ( `project_name` is your mockup project )
- `mv config.json app.json` and adapt your settings to the new format ( see [app.json](https://github.com/julianxhokaxhiu/mockups-creator/blob/master/_apptpl/app.json) )
- `mv icons.css tpl/icons.css`
- Copy `bower.json`, `Gruntfile.js` and `package.json` to `app/project_name`
- Fix the `name` property inside `package.json` using your `project_name`
- `npm install`
- `bower install`
