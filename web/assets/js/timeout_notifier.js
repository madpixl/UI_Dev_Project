/*
Author: Ndubisi Onuora
Created: 06/24/13
Description: Monitors the session time on the server and notifies user when session is about to end.
==========================================================
Usage: Add the following data elements to either <div> or <section> tags
Ex:
<div data-timeoutnotifierplugin="true"
        data-alertWindowID="alertWindow"
        data-alertWindowMsgID="alertWindowMsg"
        data-timeoutContinueButtonID="timeoutContinueButton"
        data-timeoutLogoffButtonID="timeoutLogoffButton"
        data-idleLimit=val
        data-alertPoint=val
        data-heartBeatIntervalMinutes=val
></div>

Usage in template
<script type="text/javascript" src="{{ STATIC_URL }}js/src/timeout_notifier.js"></script>
============================================================
 */
(function ($, window) {
    
	/* Constructor */
	var TimeoutNotifier = function (element, options) {
		this.element = $(element);
		this.options = this.element.data();
		this.$alertWindow = $("#" + this.options.alertwindowid);
		this.$alertWindowMsg = $("#" + this.options.alertwindowmsgid);
		
		this.$timeoutContinueButton = $("#" + this.options.timeoutcontinuebuttonid);
		this.$timeoutLogoffButton = $("#" + this.options.timeoutlogoffbuttonid);
		
		//Global variables
		//Script time counter
		this.idleIntervalID = null;
		
		//Number of minutes the user has been idle on the server
		this.serverIdleTime = 0;
		
		//Number of minutes in the session
		this.idleLimit = this.options.idlelimit || 60;
		
		//User will receive an alert that there are alertPoint minutes left in the session
		this.alertPoint = this.options.alertpoint || 1;
		
		//The number of minutes in which a heartbeat will be sent to the server
		this.heartBeatIntervalMinutes = this.options.heartbeatintervalminutes || 5;
		
		//Keeps track of whether the alert window is showing
		this.alertWindowShowing = false;
		
		//Variable that stores the last timestamp that the user at which the user was active
		this.timeLastActive = $.now();
		
		//Variable that sets if user is SSO
		this.isSSO = this.options.isSSO;
	}
	
	TimeoutNotifier.prototype = {
		
		constructor: TimeoutNotifier,
		
		//$(document).ready no longer necessary; keep everything under $(document).ready under init
		init: function (){ 	
			
				//Keep track of the current TimeoutNotifier object since the reference to this changes
				timeoutObj = this;
				
			    //Increment the idle time counter every minute.
			    timeoutObj.idleIntervalID = setInterval("timeoutObj.timerIncrement()", 60000); // 1 minute
			    timeoutObj.$alertWindow.on("hide.bs.modal", function(){timeoutObj.alertWindowShowing = false;});
			    
			    
				$(window).click(function (e) {
					//Ignore input events if the alert window is showing
			        if(!timeoutObj.alertWindowShowing)
					{
						timeoutObj.userEmitsActivityEvent();
					}
			    });
				
			    $(window).keypress(function (e) {
					//Ignore input events if the alert window is showing
			        if(!timeoutObj.alertWindowShowing)
					{			
						timeoutObj.userEmitsActivityEvent();
					}		
			    });
			
				//Continue the session when the user clicks the continue button
				timeoutObj.$timeoutContinueButton.click(function (e) {
					timeoutObj.$alertWindow.modal("hide");
					alertWindowShowing = false;
					timeoutObj.timeLastActive = $.now();
					timeoutObj.continueServerSession();
				});
				
				//Continue the session when the user presses the continue button
				timeoutObj.$timeoutContinueButton.keypress(function (e) {
					timeoutObj.$alertWindow.modal("hide");
					alertWindowShowing = false;
					timeoutObj.timeLastActive = $.now();
					timeoutObj.continueServerSession();
				});
				
				//End the session when the user clicks the logoff button
				timeoutObj.$timeoutLogoffButton.click(function (e) {
					timeoutObj.endSession();
				});
				
				//End the session when the user presses the logoff button
				timeoutObj.$timeoutLogoffButton.keypress(function (e) {
					timeoutObj.endSession();
				});
			
		},
		
		timerIncrement:	function () {
			timeoutObj = this;
			
		    timeoutObj.changeServerIdleTime(timeoutObj.serverIdleTime + 1);
			
			/*
			 * Because server is only contacted every HBIMs, the user's actions in the last interval will not be captured until the end of the session.
			 * Instead of letting the session erroneously time out if the user became active in the last interval, send a message to the server indicating activity
			 * each time the time increments.
			 */
			var noMoreHBIMIntervals = ( (timeoutObj.idleLimit-timeoutObj.serverIdleTime) < timeoutObj.heartBeatIntervalMinutes) && ( (timeoutObj.idleLimit-timeoutObj.serverIdleTime) > 0 );
			
		    if (timeoutObj.alertPoint == timeoutObj.idleLimit-timeoutObj.serverIdleTime) { // idleLimit minutes
			
				if(timeoutObj.alertPoint != 1)
					timeoutObj.showAlertWindow(timeoutObj.alertPoint + " minutes left in this session");
				else
					timeoutObj.showAlertWindow(timeoutObj.alertPoint + " minute left in this session");
		    }
			else if (timeoutObj.serverIdleTime == timeoutObj.idleLimit) {
				timeoutObj.endSession();
			}
			
			//After each heartbeat interval, potentially update the server based on the user's activity
			/*When the user's remaining time is not 0 and is less than the time used to tell the server that the user is still active,
			 * give the user an opportunity to continue the session every timeInterval instead of every heartBeatIntervalMinutes.
			 */	 
			if( (timeoutObj.serverIdleTime % timeoutObj.heartBeatIntervalMinutes == 0) ||  noMoreHBIMIntervals ) {
				timeoutObj.continueServerSession();
			}
		},
		
		//Continues session on Server if the user has remained active within the heartBeatInterval
		continueServerSession: function () {
				timeoutObj = this;
				
				//The number of equivalent milliseconds in the heartBeatInterval
				var heartBeatIntervalMillis = timeoutObj.heartBeatIntervalMinutes * 60 * 1000;
				
				var timeElapsed = $.now() - timeoutObj.timeLastActive;
				
				if(timeElapsed <= heartBeatIntervalMillis) {
					//AJAX Call to Server to tell Siteminder that client is still alive by sending a request to a dummy page
					var baseURL = "/lb_healthcheck";
					$.ajax(baseURL);
					
					//Reset every HBIM when the user is active
					timeoutObj.changeServerIdleTime(0);
					
					//Reset the timer to count from this point
					clearInterval(timeoutObj.idleIntervalID);
					timeoutObj.idleIntervalID = setInterval("timeoutObj.timerIncrement()", 60000);
				}
		},
		
		//Things to do when the user is still active on the page.
		userEmitsActivityEvent: function () {
			timeoutObj = this;
			
			timeoutObj.timeLastActive = $.now();	
		},
		
		//Cleans up the page before closing the window
		endSession: function () {
			timeoutObj = this;
					
			timeoutObj.alertWindowShowing = false;

			timeoutObj.$alertWindow.modal("hide");
			
			//Below is necessary workaround to close the tab in which the script is opened
			//Do a GET request to the logout page and close the window as a callback.			
			$.get("/accounts/logout", 
				function() { window.open('', '_self', '');
                                                window.opener='x';
                                                window.close(); });
		},
		
		changeServerIdleTime: function (newTime) {
			timeoutObj = this;
			
			timeoutObj.serverIdleTime = newTime;
		},
		
		logOff: function () {
			timeoutObj = this;
			
			timeoutObj.endSession();
		},
		
		showAlertWindow: function (message) {
			timeoutObj = this;
			
			timeoutObj.alertWindowShowing = true;
			timeoutObj.$alertWindowMsg.text(message);
			timeoutObj.$alertWindow.modal({backdrop: "static", keyboard: false});
		},
		
		logoutClose: function () {
			timeoutObj = this;
					
			timeoutObj.alertWindowShowing = false;

			timeoutObj.$alertWindow.modal("hide");
			
			//Below is necessary workaround to close the tab in which the script is opened
			//Do a GET request to the logout page and close the window as a callback.			
			$.get("/accounts/logout", 
				function() { window.open('', '_self', '');
								if(timeoutObj.options.issso != 'None'){
										window.opener='x';
										window.close();}
								else
									 {
									 	 window.location = "/";
									 }
							 });
		},
			
	}
	
	/* Timeout Notifier PLUGIN DEFINITION*/
	$.fn.timeoutnotifier = function (option) {
		//Returns the plugin and is used for chaining
		return this.each(function () {
			var pluginName = "timeoutnotifier";
			
			var $this = $(this),
				data = $this.data(pluginName);
			if (!data) {
				$this.data(pluginName, (data = new TimeoutNotifier(this)));
			}
			//Calls the function specified by the data attribute
			if (typeof option === "string") {
				data[option]();
			}
			
		});
	}
	
	//Everything that happens on initilization goes here
	$(function () {

        // on load
        //$name cannot be same name as plugin or there will be an "Object true does not have method init" error
        //[data-$name="val"]
        $('[data-timeoutnotifierplugin="true"]').each(function () {
            $(this).timeoutnotifier('init');
        });
    });
    
})(jQuery, window);


