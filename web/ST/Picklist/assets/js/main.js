 
function include (filename) {
  
  var d = this.window.document;
  var isXML = d.documentElement.nodeName !== 'HTML' || !d.write; // Latter is for silly comprehensiveness
  var js = d.createElementNS && isXML ? d.createElementNS('http://www.w3.org/1999/xhtml', 'script') : d.createElement('script');
  js.setAttribute('type', 'text/javascript');
  js.setAttribute('src', filename);
  js.setAttribute('defer', 'defer');
  d.getElementsByTagNameNS && isXML ? (d.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'head')[0] ? d.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'head')[0].appendChild(js) : d.documentElement.insertBefore(js, d.documentElement.firstChild) // in case of XUL
  ) : d.getElementsByTagName('head')[0].appendChild(js);
  // save include state for reference by include_once
  var cur_file = {};
  cur_file[this.window.location.href] = 1;

  // BEGIN REDUNDANT
  this.incJs = this.incJs || {};
  // END REDUNDANT
  if (!this.incJs.includes) {
    this.incJs.includes = cur_file;
  }
  if (!this.incJs.includes[filename]) {
    this.incJs.includes[filename] = 1;
  } else {
    this.incJs.includes[filename]++;
  }

  return this.incJs.includes[filename];
}

//This works in IE but nothing else !!!!!!!!!!!!!!!!


include("../assets/js/vendor/jquery-1.10.1.min.js");
include("../assets/js/vendor/bootstrap.js");
include("../assets/js/vendor/html5shiv.js");

 