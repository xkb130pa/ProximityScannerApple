
// Properties retreived from the mobile device
var disclaimerShown;
var latitude;
var longitude;

// Properties retrieved from the web service
var message;
var distance;
var site;
var zone;
var disclaimer;
var status;
var timestamp;
var responsetime;
var ScanCallback;


var ScanCallback = function() {

	var success = function(pos) { 
		jQuery.support.cors = true;
		jQuery.ajaxSetup({ async: false });

		latitude = pos.coords.latitude;
		longitude =  pos.coords.longitude;
		var accuracy =  pos.coords.accuracy;
		
		$("#Status").html("Coordinates retrieved...");

		$("#Coordinates").css("visibility","visible");		
		$("#Latitude").html(Math.round(100000*latitude)/100000 + ' &#176;N')
		$("#Longitude").html(Math.round(100000*longitude)/100000 + ' &#176;W') 
		$("#Accuracy").html(Math.round(10 * 3.28 * accuracy) / 10 + ' ft');
		
	    // Show the disclaimer
		if (3.28 * accuracy > 500) {
		    $("#AccuracyAlert").html("The geolocation accuracy reported from your mobile device is poor.  Are you outside with clear visibility? Please attempt scanning again at a new location.")
		    $("#AccuracyAlertDialog").popup("open")
		}
		else if (3.28 * accuracy > 200) {
		    $("#AccuracyAlert").html("The geolocation accuracy reported from your mobile device is less than 200 ft.  Please attempt scanning again at a new location.")
		    $("#AccuracyAlertDialog").popup("open")
		}
		else {
		scanProximity();
		}
    };
			
	var fail = function(error) {  	// when debugging report error.message
		$("#Coordinates").css("visibility","hidden");		
		$("#Status").html("Error getting geolocation. Do you have GPS enabled?");

	};
	
	
	$("#Status").html("Retrieving Geolocation from your device...");
	navigator.geolocation.getCurrentPosition(success, fail,
	  {maximumAge:0, timeout:15000, enableHighAccuracy: true});
};


// Capture pressing the GO button
$('#Code').keypress(function(e) {
            var key = (e.keyCode ? e.keyCode : e.which);
            if ( (key==13) || (key==10)) { ScanCallback(); }
});
    
		
var scanProximity = function () {

	var securityCode = $("#Code").val();
	
		// Compose the data feed URL
	    var URL = 'https://pge.proximityscanner.com/Functions.svc/Scan' +		
        '?Latitude=' + latitude + 
        '&Longitude=' + longitude + 
        '&Timestamp=' + Date.now();			

		// Query the data and populate the table
		$.getJSON(URL)
			.done(function (data) {
			    message = data.Message;
				distance = data.Distance;
				site = data.Site;
				zone=data.Zone;
				disclaimer = data.Disclaimer;
				status = data.Status;
				timestamp = new Date();
				responsetime = format_date(timestamp) + ' ' + format_time(timestamp);

			if ($(".ui-page-active .ui-popup-active").length == 0) {
			 // Other popups are not open

				// Disclaimer 

				// Define the disclaimer
				if (disclaimer==null) {
				 $("#DisclaimerText").html("This tool and information obtained from it are for exclusive use by PG&E employees and contractors. <BR><BR>The Proximity Scanner is a tool to help PG&E Employees and Contractors determine if clean vault water may be discharged to land in certain locations and is to be used in conjunction with the VDR form as part of the vault dewatering procedure.");
				} else {
				 $("#DisclaimerText").html(disclaimer); 
				}
				// Show the disclaimer
				if (disclaimerShown == null) {
					$("#DisclaimerDialog").popup("open")
					disclaimerShown = 'done';
				} else {
					showScanResponse();
				}
			}

		})
		.fail(function (jqxhr, textStatus, error) {
			var timestamp = new Date();
			var responsetime = format_date(timestamp) + ' ' + format_time(timestamp);
			$("#Security").css("visibility","visible");
			$("#ResponseDescription").html("");
			$("#ResponseBlock").css("visibility","hidden");
			$("#Status").html("A network connection cannot be established.")
			$("#ResponseTime").html("Last Checked " + responsetime); 	
			// Report error.message when debugging				
		});
}

var showScanResponse = function () {

			// Unhide the response block
			$("#ResponseBlock").css("visibility","visible");
			
			// Remove button text
			$('#Button').html('');
						
			// Set the button image, Yes/NO response, response text, and status
			if (zone==5) { 
			 if ( (typeof someVar === 'undefined') || response==null) { $("#Response").html("Ok to Discharge");} else { $("#Response").html(response); }
			 $("#Response").css("background-color","#508a55");	
			 $("#Button").removeClass("Z0").removeClass("Z1").removeClass("Z2").removeClass("Z3").removeClass("Z4").addClass("Z5").removeClass("ZM1");		
			if (message==null) { $("#ResponseDescription").html("There is not a Cortese site within 200 feet of your location.  The nearest Cortese site is over a mile away.");} else { $("#ResponseDescription").html(message); }
			if (status==null) { $("#Status").html("Scan Completed.");} else { $("#Status").html(status); }				 
			}
			else if (zone==4) {
			 if ( (typeof someVar === 'undefined') || response==null) { $("#Response").html("Ok to Discharge");} else { $("#Response").html(response); }
			 $("#Response").css("background-color","#87b388");		
			 $("#Button").removeClass("Z0").removeClass("Z1").removeClass("Z2").removeClass("Z3").addClass("Z4").removeClass("Z5").removeClass("ZM1");
			 if (message==null) { $("#ResponseDescription").html("There is not a Cortese site within 200 feet of your location.  The nearest Cortese site is between 1000 feet and one mile from your location.");} else { $("#ResponseDescription").html(message); }
			 if (status==null) { $("#Status").html("Scan Completed.");} else { $("#Status").html(status); }		
			}
			else if (zone==3) {
			 if ( (typeof someVar === 'undefined') || response==null) { $("#Response").html("Ok to Discharge");} else { $("#Response").html(response); }
			 $("#Response").css("background-color","#87b388");
			 $("#Button").removeClass("Z0").removeClass("Z1").removeClass("Z2").addClass("Z3").removeClass("Z4").removeClass("Z5").removeClass("ZM1");		
			 if (message==null) { $("#ResponseDescription").html("There is not a Cortese site within 200 feet of your location.  The nearest Cortese site is between 500 and 1000 feet from your location.");} else { $("#ResponseDescription").html(message); }
			 if (status==null) { $("#Status").html("Scan Completed.");} else { $("#Status").html(status); }						 
			}
			else if (zone==2) {
			 if ( (typeof someVar === 'undefined') || response==null) { $("#Response").html("Ok to Discharge");} else { $("#Response").html(response); }
			 $("#Response").css("background-color","#87b388");
			 $("#Button").removeClass("Z0").removeClass("Z1").addClass("Z2").removeClass("Z3").removeClass("Z4").removeClass("Z5").removeClass("ZM1");				
			 if (message==null) { $("#ResponseDescription").html("There is not a Cortese site within 200 feet of your location.  The nearest Cortese site is between 200 and 500 feet from your location.");} else { $("#ResponseDescription").html(message); }
			 if (status==null) { $("#Status").html("Scan Completed.");} else { $("#Status").html(status); }		
			}
			else if (zone==1) {
			 if ( (typeof someVar === 'undefined') || response==null) { $("#Response").html("Do Not Discharge");} else { $("#Response").html(response); }
			 $("#Response").css("background-color","red");
			 $("#Button").removeClass("Z0").addClass("Z1").removeClass("Z2").removeClass("Z3").removeClass("Z4").removeClass("Z5").removeClass("ZM1");	
			 if (message==null) { $("#ResponseDescription").html("There is a Cortese site within 200 feet of your location.");} else { $("#ResponseDescription").html(message); }
			 if (status==null) { $("#Status").html("Scan Completed.");} else { $("#Status").html(status); }	
			}
			else if (zone==-1) {
			 $("#Response").html("Not Authorized"); 
			 $("#Response").css("background-color","red");
			 $("#Button").removeClass("Z0").removeClass("Z1").removeClass("Z2").removeClass("Z3").removeClass("Z4").removeClass("Z5").addClass("ZM1")	
			 if (message!=null) { $("#ResponseDescription").html("Discharges of vault water to land within this RWQCB region are not authorized at this time.");} else { $("#ResponseDescription").html(message); }
			 if (status==null) { $("#Status").html("Scan Completed.");} else { $("#Status").html(status); }	
			}			
			else{
			 $("#ResponseBlock").css("visibility","hidden");
			 if (message==null) { $("#ResponseDescription").html("");} else { $("#ResponseDescription").html(message); }			 
			 $("#Button").addClass("Z0").removeClass("Z1").removeClass("Z2").removeClass("Z3").removeClass("Z4").removeClass("Z5").removeClass("ZM1");			
			 if (status==null) { $("#Status").html("Scan Completed.");} else { $("#Status").html(status); }						 
			}
			$("#ResponseTime").html("Last Checked " + responsetime); 
			
		 	// Hide the security code since it only needs to be entered once
			if (status=="Invalid Security Code.") { 
				$("#Security").css("visibility","visible"); 
				$("#SecurityCodeDialog").popup("open")
			 } 

}


$(document).ready(function(){   

	// Create callback for the accuracy pop
	$( "#AccuracyAlertDialog" ).bind({
	   popupafterclose: function(event, ui) { scanProximity(); }
	});
	
	
		// Create callback for the accuracy pop
	$( "#DisclaimerDialog" ).bind({
	   popupafterclose: function(event, ui) { showScanResponse(); }
	});
	
});


// Auxillary Functions

function format_time(date_obj) { 
   // formats a javascript Date object into a 12h AM/PM time string 
   var hour = date_obj.getHours(); 
   var minute = date_obj.getMinutes(); 
   var amPM = (hour > 11) ? "pm" : "am"; 
   if(hour > 12) { 
     hour -= 12; 
  } else if(hour == 0) { 
     hour = "12"; 
   } 
   if(minute < 10) { 
     minute = "0" + minute; 
   } 
   return hour + ":" + minute + amPM; 
 } 
 
function format_date(date_obj) { 
   // formats a javascript Date object mm/dd/yyyy string
   return (date_obj.getMonth() + 1) + "/" + date_obj.getDate() + "/" + date_obj.getFullYear();
}
