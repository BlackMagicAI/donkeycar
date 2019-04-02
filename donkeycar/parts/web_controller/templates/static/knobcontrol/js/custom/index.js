/**
 * Javascript file for index.html page
 */
 $( function() {
   //$( "#accordion" ).accordion();
	 $('.accordion-test h3').click(function(){
		 $(this).siblings('.test-div').slideToggle();
	 })
	 
	 /*signup form (modal)
	 * ref: https://bootsnipp.com/snippets/featured/login-and-register-tabbed-form
	 */
    $('#login-form-link').click(function(e) {
		$("#login-form").delay(100).fadeIn(100);
 		$("#register-form").fadeOut(100);
		$('#register-form-link').removeClass('active');
		$(this).addClass('active');
		//e.preventDefault();
		e.defaultPrevented();
	});
	$('#register-form-link').click(function(e) {
		//CURRENT_STATE = AppStates.LOGIN_SIGN_UP_STATE;
		$("#register-form").delay(100).fadeIn(100);
 		$("#login-form").fadeOut(100);
		$('#login-form-link').removeClass('active');
		$(this).addClass('active');	
		//init();
		//try to make anonymous login before showing registration page 
/*		$("#register-form").delay(100).fadeIn(100);
 		$("#login-form").fadeOut(100);
		$('#login-form-link').removeClass('active');
		$(this).addClass('active');*/
		
		//isSent = sfs.send(new SFS2X.LoginRequest());
		/*if(isSent)
		{
			//enableLoginBtn(false);
		}*/
		//e.preventDefault();
		e.defaultPrevented();
	});
	
	jQuery('.scrollbar').jScrollPane({
		verticalDragMaxHeight: 39,
		verticalDragMinHeight: 39
	});

	jQuery('.scrollbar.style2').jScrollPane({
		verticalDragMaxHeight: 36,
		verticalDragMinHeight: 36
	});
	
 } );
 	
 /*
  * Display registration form
  */
 function showRegisterForm(){
		$("#register-form").delay(100).fadeIn(100);
 		$("#login-form").fadeOut(100);
		$('#login-form-link').removeClass('active');
		$(this).addClass('active');	 	 
 }
 
 /*
 * Animate progress bar for specified number of seconds
 */
 function startProgressBarTimer(duration){
	 //stop current animation if active
	 $('#progressBar2').anim_progressbar({
         totaltime: duration
     });
 }
 
