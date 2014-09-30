var win = $.index;

var acceptAction = Ti.App.iOS.createUserNotificationAction({
    identifier: "ACCEPT_IDENTIFIER",
    title: "Accept",
    activationMode: Ti.App.iOS.USER_NOTIFICATION_ACTIVATION_MODE_FOREGROUND,
    destructive: false,
    authenticationRequired: true
});

var rejectAction = Ti.App.iOS.createUserNotificationAction({
    identifier: "REJECT_IDENTIFIER",
    title: "Reject",
    activationMode: Ti.App.iOS.USER_NOTIFICATION_ACTIVATION_MODE_BACKGROUND,
    destructive: true,
    authenticationRequired: false
});

var downloadContent = Ti.App.iOS.createUserNotificationCategory({
  identifier: "DOWNLOAD_CONTENT",
  actionsForMinimalContext: [acceptAction, rejectAction],
  actionsForDefaultContext: [acceptAction, rejectAction]
});


if (OS_IOS && parseInt(Ti.Platform.version.split(".")[0]) >= 8) {
	Ti.App.iOS.registerUserNotificationSettings({
		types: [Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT , Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE , Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND],
		categories: [downloadContent]
	});
	console.log("I am iOS 8!");

	//for notifications received while app is in background
	Ti.App.iOS.addEventListener('localnotificationaction', function(e) {
		console.log(JSON.stringify(e));

		if (e.identifier == "ACCEPT_IDENTIFIER") {
			alert("start download");
		}
		
		// remove the badge after 5 seconds
		if (e.badge > 0) { 
			Ti.App.iOS.scheduleLocalNotification({
			    date: new Date(new Date().getTime() + 3000),
			    badge: "-1"
			});
		}
	});
}


// for notifications received while app is in foreground 
Ti.App.iOS.addEventListener('notification', function(e) { 
    // remove the badge after 5 seconds
	if (e.badge > 0) {
		Ti.App.iOS.scheduleLocalNotification({
		    date: new Date(new Date().getTime() + 3000),
		    badge: "-1"
		});
	}
	
	console.log(JSON.stringify(e));
});



var button = Ti.UI.createButton({title: 'Trigger Notification (in 3 secs)'});
button.addEventListener('click', function(e){ 
	var note = Ti.App.iOS.scheduleLocalNotification({
	    date: new Date(new Date().getTime() + 3000),
	    alertBody: "New content available! Download now?",
	    badge: 1,
	    userInfo: {"url": "http://www.download.com/resource/asset.json", id:"1"},
	    category: "DOWNLOAD_CONTENT"
	});	
});


// notification NOW
var doNotif=function(){
	var note = Ti.App.iOS.scheduleLocalNotification({
	    date: new Date(new Date().getTime()),
	    alertBody: "New content available! Download now?",
	    badge: 1,
	    userInfo: {"url": "http://www.download.com/resource/asset.json", id:"1"},
	    category: "DOWNLOAD_CONTENT"
	});		
}

// show notification in 5 seconds
setTimeout(doNotif,5000);


//
function sendNotificationNow(msg){
	var note = Ti.App.iOS.scheduleLocalNotification({
	    date: new Date(new Date().getTime()),
	    alertBody: msg,
	    badge: 1,
	    userInfo: {"url": "http://www.download.com/resource/asset.json", id:"1"},
	    category: "DOWNLOAD_CONTENT"
	});		
}
//


function doit(evt){
	sendNotificationNow('Woot!');
}


win.add(button);
win.open();

