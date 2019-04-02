var MAX_JOG_RANGE = 100;

function drag(ev) {
    //ev.dataTransfer.setData("text", ev.target.id);
//console.log(ev.target.x + ", " + ev.target.y);
//console.log(ev.target.getBoundingClientRect().left);
}
var angleDeg;
var powerLevel;

/*
* Ref: https://jqueryui.com/draggable/#events
*/

$( "#draggable3" ).draggable({ containment: "#containment-wrapper", scroll: false });

$( function() { 
	//calculate bounding box for containment of knob sprite
	//var baseXY = $("#knobcontainer").offset();
	
//console.log($("#knobcontainer"));
 //console.log("code:" + baseXY.top + "," + baseXY.left);
//console.log("knobXY:" + knobXY.top + "," + knobXY.left);
	//enableJoyStick(false);//disable joystick
	//enableJoyStick2(false);//disable joystick
	
/*	$( "#knob" ).draggable({
		  disabled: true,		        	
		});*///needed
	
	//$( "#knob" ).draggable( "option", "disabled", false );	
	$( "#knob" ).draggable({
		  disabled: true,
	        start: function() {	        	
		        
		        },
		        drag: function() {		        	
		    	  	var knobXY = $(this).position();
		    	  	var knobWidth = $(this).context.width;
		    	  	var knobHeight = $(this).context.height;
		    	  			    	  	
		    	  	var x = knobXY.left-getJoyStickPadSize().xRadius; //index version
		    	  	var y = getJoyStickPadSize().yRadius - knobXY.top;//index version
		    	  	var angle = Math.atan2(x,y);
		    	  	//var knowPosRadius = Math.min(Math.sqrt(x*x + y*y), 145);//index2 version
		    	  	var knobPosRadius = Math.min(Math.sqrt(x*x + y*y), getJoyStickPadSize().xRadius);//index version

		    	  	angleDeg = angle * 57.295779513;
		    	  	//powerLevel = (knowPosRadius/145)*100;
		    	  	powerLevel = (knobPosRadius/getJoyStickPadSize().xRadius)*100;		    	  	
		    	  	$("#turnangle").text(angleDeg.toFixed(0));
		    	  	$("#powerlevel").text(powerLevel.toFixed(0) + "%");		    	  			    	  
		        },
		        stop: function() {     			        	
				  		$("#knob").offset(getJoyStickCenter());
				  		$("#turnangle").text(0);
				  		$("#powerlevel").text("0%");
				  		
			        },			       
			        containment: [ getJoyStickCenter().left-getJoyStickPadSize().xRadius, getJoyStickCenter().top-getJoyStickPadSize().yRadius,  getJoyStickCenter().left+getJoyStickPadSize().xRadius,  getJoyStickCenter().top+getJoyStickPadSize().yRadius],			        
			        scroll: false,
			        disabled:true
		});//needed
	$("#knob").on('dragstart', function (e) {e.preventDefault();});
	//enableJoyStick2(false);
	//$("#knob").off('dragstart');//re-enable dragging	

});

/*$.fn.redraw = function(){
	  $(this).each(function(){
	    var redraw = this.offsetHeight;
	  });
	};*/
	
/*
 * Enable joystick
 * true = enables, false = disables
 */
function enableJoyStick(state){

	if(state === true){
		
		//$("#knob").show(100);
		$( "#knob" ).css("visibility","visible")
		$("#knob").draggable("option", "disabled", false );
		$("#knob").off('dragstart');//re-enable dragging
		//$('#knob').redraw();
		
	}else{
		//$("#knob").hide("slow");
		$( "#knob" ).css("visibility","hidden")
		$("#knob").on('dragstart', function (e) {e.preventDefault();});
		$("#knob").on('dragstart', function (e) {e.preventDefault();});
		//$('#knob').redraw();
	}
	
/*	if(state === true){
		$( "#knob" ).draggable( "option", "disabled", false );	
		$("#knob").off('dragstart');//re-enable dragging	
	}else{
		$( "#knob" ).draggable( "option", "disabled", true );
		$("#knob").on('dragstart', function (e) {e.preventDefault();});
	}	*/
}


/*
* Return joystick pad center position
*/
function getJoyStickCenter(){
	
	var centerPos = $("#knobcontainer").offset();
	
	var knobXRadius = $("#knob")[0].clientWidth/2;
	var knobYRadius = $("#knob")[0].clientHeight/2;

	var xOffset = $("#knobcontainer")[0].clientWidth/2;
	var yOffset = $("#knobcontainer")[0].clientHeight/2;

	return {top:centerPos.top + yOffset - knobYRadius, left: centerPos.left + xOffset - knobXRadius}
}

/*
* Return joystick knob center position
*/
function getKnobCenter(){

	var knobXRadius = $("#knob")[0].clientWidth/2;
	var knobYRadius = $("#knob")[0].clientHeight/2;

	var centerPos = $("#knob").offset();

	return {top:centerPos.top - knobYRadius, left: centerPos.left - knobXRadius}
}

/*
 * Return the joystickpad xm y radius
 */
function getJoyStickPadSize(){
	//console.log($("#knobcontainer").height());
	//console.log($("#knobcontainer").width());
	var xOffset = $("#knobcontainer").width()/2;
	var yOffset = $("#knobcontainer").height()/2;
	return {xRadius:xOffset, yRadius:yOffset};
}
