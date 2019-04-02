/**
 * Game server javascript code
 */
var sfs = null;
var CMD_SUBMIT = "$SignUp.Submit";
var CMD_REQUEST = "control.requestrobot";
var CURRENT_STATE = "";
var AppStates = {"LOGIN_STATE":"login", "LOGIN_GUEST_STATE":"loginguest", "LOGIN_SIGN_UP_STATE":"signup", "LOGIN_GUEST_SIGN_UP_STATE":"signupguest", "SUBMIT_SIGN_UP_STATE":"signupsubmit", "TARGET_ROBOT_ID":"targetRobotId"};
var ButtonLabels = {"CONNECT":"Connect", "DISCONNECT":"Disconnect", "LOGIN":"Login", "LOGOUT":"Logout"};
var Messages = {"ROOMS_SELECTED_TITLE":"Room already joined", "ROOMS_SELECTED_MSG":"Select a buddy from the Room Members panel instead", "PROFILE_UPDATE_SUCCESS": "Profile successfully updated", "PROFILE_UPDATE_FAILED": "Profile update failed"};
var currentPrivateChat = -1;

var currentUser;

var sensorDataLabels = [];
var MAX_JOG_RANGE = 100;
var MAX_JOG_POWER_RANGE = 100;

/*var onStreamLoadListener = function () {
    console.log('WowzaPlayer loaded');
    $wp.get('playerElement').play();
}*/
/*
 * Setup button event listeners, etc...
 */
// A $( document ).ready() block.
$( document ).ready(function() {
//$( window ).load(function() {	
	//init();	
   /*joystick jog (closed loop) motion control jog increment slider*/
	$('#jogvalue')
	.bind(			
		'jsp-scroll-y',
		function(event, scrollPositionY, isAtTop, isAtBottom)
		{	
			var position = parseInt(scrollPositionY * .094);
			//console.log($('#jogdisplay'));
			$('#jogdisplay').text("Jog:" + position);
			//sendServoCommand("a0", position);	
		}
	).jScrollPane();
	
	   /*joystick jog (closed loop) motion control power level slider*/
	$('#jogpower')
	.bind(			
		'jsp-scroll-y',
		function(event, scrollPositionY, isAtTop, isAtBottom)
		{	
			var position = parseInt(scrollPositionY * .094);
			//console.log($('#jogdisplay'));
			$('#jogpowerdisplay').text("Power:" + position);
			//sendServoCommand("a0", position);	
		}
	).jScrollPane();	
   
    //Login button add click listener
 /*   $("#login_btn").click(function(){//start/login button
    	if(this.value === "Login"){//button toggle logic
    		// Login to SFS
    		onLoginBtn();	
    		//this.value = "Logout";
    		enableLoginBtn(false);
    		console.log( "Login!!!!" );
    	}else{
    		onDisconnectBtClick();
    		//this.value = "Login";
    		enableLoginBtn(true);
    		console.log( "Logout!!!!" );
    	}    	
    });*/
    
    //toggleJoystickLock(false);//disable joystick
    //enableSwitches(false);//disable switch/checkboxes
    //enableJogBtns(false);//disable job buttons
    
    //Servo controller vertical scroll bars
	/*jQuery('.scrollbar').jScrollPane({
		verticalDragMaxHeight: 39,
		verticalDragMinHeight: 39
	});*/

/*	jQuery('.scrollbar.style2').jScrollPane({
		verticalDragMaxHeight: 36,
		verticalDragMinHeight: 36
	});*/
	
	// Start listening to resize events and
	// draw canvas.
	//initialize();
	//resizeJoyStick();	
	//enableJoyStick(true);
});

/*
 * Register an event listener to
 * call the resizeJoyStick() function each time
 * the window is resized.
 */
function initialize() {
	window.addEventListener('resize', resizeJoyStick, false);
}

/*
 * Redraw/Recalculate joystick sizes when page is resized.
 * This is a hack to prevent joystick know from becoming uncentered in joystick pad container
 * Ref: https://forum.jquery.com/topic/responsive-containment-with-draggable
 */
function resizeJoyStick(){	
	//console.log($( "#knob" ));
	//var someNewArray = [ getJoyStickCenter().left-getJoyStickPadSize().xRadius, getJoyStickCenter().top-getJoyStickPadSize().yRadius,  getJoyStickCenter().left+getJoyStickPadSize().xRadius,  getJoyStickCenter().top+getJoyStickPadSize().yRadius];
	var someNewArray = [ getJoyStickCenter().left-getJoyStickPadSize().xRadius, getJoyStickCenter().top-getJoyStickPadSize().yRadius,  getJoyStickCenter().left+getJoyStickPadSize().xRadius,  getJoyStickCenter().top+getJoyStickPadSize().yRadius];
	$("#knob").draggable( "option", "containment", someNewArray );
}
/*
 * Enable jog buttons. This is to prevent sending commands when sfs if null (no connection to server)
 * true = enables, false = disables
 */
function enableJogBtns(state){	
	if(state === true){
		$( "#leftarrow" ).show(100);
		$( "#rightarrow" ).show(100);
		$( "#uparrow" ).show(100);
		$( "#downarrow" ).show(100);
	}else{
		$( "#leftarrow" ).hide("slow");
		$( "#rightarrow" ).hide("slow");
		$( "#uparrow" ).hide("slow");
		$( "#downarrow" ).hide("slow");
	}		
}

/*
 * Return the percent value of the jog vertical closed loop control slider
 * as a percent of max value passed in as a parameter
 */
function getJogSliderPercent(max){
	   api = $('#jogvalue').jScrollPane().data('jsp');
	   //console.log(parseInt(api.getPercentScrolledY()* 100));
	   return parseInt(api.getPercentScrolledY()* max);
}

/*
 * Return the percent value of the jog vertical closed loop control slider
 * as a percent of max value passed in as a parameter
 */
function getJogPowerSliderPercent(max){
	   api = $('#jogpower').jScrollPane().data('jsp');
	   //console.log(parseInt(api.getPercentScrolledY()* 100));
	   return parseInt(api.getPercentScrolledY()* max);
}


