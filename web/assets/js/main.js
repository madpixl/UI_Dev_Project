function include(filename)
{
   
	var Body = document.getElementsByTagName('body')[0];
    script = document.createElement('script');
	path = location.href;
	clip = path.lastIndexOf('/');
	 
	path1 = path.substring(0,clip);
	filename2 = path1 + '/' + filename;
	
	script.src = filename2;
    script.type = 'text/javascript';
    Body.appendChild(script);
	 
}
 include('assets/vendor/jquery-1.10.1.min.js');
 include('assets/vendor/bootstrap.min.js');
 include('assets/vendor/modernizr-2.6.2-respond-1.1.0.min.js');


 