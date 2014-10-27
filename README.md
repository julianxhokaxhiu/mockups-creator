mockups-creator
===============

A NodeJS App that creates static HTML mockups using Grunt

# Introduction

This was built because of my needs to always kickstart a mockup in the fastest way as possible. So, this will bring a very flexible but powerful mockup generator based on various technologies.

## What is this?

This is a yeoman-like project. It will help you to kickstar mockups in no-time.

## Why do you think this is so special

Because I want to create a platform for independent mockups that doesn't really belongs to some CMS or other technology. This is also different from the simple "static site generator" that you can find elsewhere.

I love to be flexible and indipendent from the platforms. That's why I built this tool.

## What does the mockup start template have?

**Backend**

- Customizable [Gruntfile.js](https://github.com/julianxhokaxhiu/mockups-creator/blob/v2/_apptpl/Gruntfile.js).
- [Swig Templates](http://paularmstrong.github.io/swig/) ( just like Twig, but for Javascript )
- Template custom data customizable via JSON file ( see [app.json](https://github.com/julianxhokaxhiu/mockups-creator/blob/v2/_apptpl/app.json#L18) file )
- Web Fonts generator ( just place your TTF or OTF fonts in the fonts folder )
- Web Icons generator based on SVG files ( just place them in the icons folder )
- SCSS ( with map files support so you can see from your inspector directly the SCSS file reference )
- Autoprefixing for CSS rules ( this give's you the freedom to not use anymore -webkit-, -moz-, etc. )
- [YUI](http://yui.github.io/yuicompressor/) compressor for CSS
- [Google Closure Compiler](https://developers.google.com/closure/compiler/) for Javascript
- Auto-rebuild + Live Reload when editing swig, scss or js files
- Static file server. No more depending on Apache, Nginx, etc.

**Frontend**

- jQuery 2.x ( or 1.x for older browsers )
- Bootstrap 3.x ( using bower to keep it aligned with latest updates )
- Fontawesome 4.x ( using bower to keep it aligned with latest updates )
- Customizable [bower.json](https://github.com/julianxhokaxhiu/mockups-creator/blob/v2/_apptpl/bower.json).

**Deploy**

- [Rsync](http://en.wikipedia.org/wiki/Rsync)

# Requirements

To run this you need these binaries to be available in your system

1. `fontforge` ( required by [grunt-fontgen](https://github.com/agentk/grunt-fontgen) and [grunt-webfont](https://github.com/sapegin/grunt-webfont) )
2. `ttf2eot` ( required by [grunt-fontgen](https://github.com/agentk/grunt-fontgen) )
3. `batik-ttf2svg` ( required by [grunt-fontgen](https://github.com/agentk/grunt-fontgen) )

To test if they're working just type these names in your terminal and if they're working you're good to go.
Otherwise you should look at your OS documentation on how to get these binaries working.

# How to use

1. Run `npm install`.
2. Run `grunt make --app=project_name`.
3. Wait for the cool stuff to be done
4. Work inside the _[app](https://github.com/julianxhokaxhiu/mockups-creator/tree/master/app)/project_name/_ folder that will be created.
5. Configure your _app/project_name/[app.json](https://github.com/julianxhokaxhiu/mockups-creator/blob/v2/_apptpl/app.json)_ with the desired values.
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

# `Directories` reference

- `_apptpl` folder is used as a starter template when you run `grunt make --app=project_name` task. Everything from this folder will be copied 1:1 to the `project_name` folder that you got from the `grunt make` task.
- `rsc` folder is used for resources like images, and other things that will be copied 1:1 to the `output.path` folder.
- `tpl` folder is used for templating your app. Here will live the SCSS, the Swig template files and the Javascript code. Everything inside this folder will be compacted, minified, autoprefixed, etc. by Grunt Tasks.
- `fonts` folder is used when you want to autogenerate webfonts based on `ttf` or `otf` desktop fonts. When you'll place some files here you'll get all known webfonts formats + a CSS file that will be minified with your SCSS file that exists in `tpl` folder. This will give a big speed boost to work with custom fonts without needing to create the CSS manually or with external tools.
- `icons` folder is used to autogenerate icons for your website based on SVG files. Just put them there and you'll get all the job done automatically. You can simply use them as 'project_name-icon-svgfilename' classes.

# `app.json` reference
```javascript
{
	"config" : {
		"output" : {
			// The output path of your project
			"path" : "../../../public_html"
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
		}
	},
	// Custom template data
	"data" : {
		"foo" : "bar"
	}
}
```
Basically the `config.json` is the same as `app.json` and will override its settings.