# DT 2.0 Boilerplate Code
This repo contains some preliminary sample html code that aligns with the DT 2.0
Style Guide. I've included samples with CSS and samples using LESS.

## Technology stack
* Bootstrap 3.0.1
* Font-Awesome 4.0.2
* jQuery 1.10.2
* LESS 1.5.0

## Recommendations
I recommend that you use the LESS implementation because it gives you more
control and separation of the features. You also can easily modify 
[assets/less/src/themes/dealertrack.less](assets/less/src/themes/dealertrack.less)
to control the colors and styles of the Bootstrap components. This file is
similar to Bootstrap's `variables.less` file with some custom variables for
our styles at the top.


## Requirements
You will need to have a server running to view the LESS implementation.
Because the `less-1.5.0.min.js` imports files dynamically, it can't just be
loaded in the browser locally.  You need to have a web server running.

I recommend [Twisted](http://twistedmatrix.com/ "Twisted"). If you are on a Mac, 
Twisted is already installed and you can start a server from any folder you like. 
For example:
```bash
twistd -n web --path ~/Projects/dt20-bootstrap3-boilerplate/
```


