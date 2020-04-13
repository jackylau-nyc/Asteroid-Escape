<?php	
	$username = '';
	$password = '';
	if(isset($_COOKIE['username']) && isset($_COOKIE['password'])) {
		$username = $_COOKIE['username'];
		$password = $_COOKIE['password'];
	}
?>
<!DOCTYPE html>
<html>
  <head>
    <title>Hungry Droid</title>
	<link rel="stylesheet" type="text/css" href="style.css">
    <script src = "asteroidescape.js"></script>
  </head>
  <body onload="start()">
<table >
<tr><th colspan="3" style="height:15vh; text-align:center; font-family:'impact';  font-size:50px ">ASTEROID   ESCAPE</th></tr>
	<tr> 
		<td style="background-color:#eee ; width: 20vw;horizontal-align:right; vertical-align:top">
			<div class="nav">
			  <div id = "logInBtns">
				<!--<button style= "width:100%" id = "loginbtn" onclick="pauseGame(); document.getElementById('login').style.display='block'; listening = false;" style="width:auto;">Login</button>-->
				<input type="text" placeholder="Enter Username" value = "<?php echo $username ?>" name="uname" id="loginUsername" class ="loginField" onFocus="if (deadTimer == -1) pauseGame(); document.getElementById('logInResponse').innerHTML='';" autofocus>
				<input type="password" placeholder="Enter Password" value = "<?php echo $password ?>" name="psw" id="loginPassword" class ="loginField" onFocus="if (deadTimer == -1) pauseGame(); document.getElementById('logInResponse').innerHTML='';">
				<span class="error"><div id="logInResponse"></div></span>
				<button  style= "float:right; background-color: #eee;" type="button" onclick="logIn()" class="signupbtn">Log In</button>
				<button style= "float:left; background-color: #222;" id = "signUpbtn" onclick="if (deadTimer == -1) pauseGame(); document.getElementById('signUp').style.display='block'; listening = false;" style="width:auto;">Sign Up</button>
			 </div>
			 <div id = "userInfo">
			 </div>
			</div><br><br><br>
			<div id = "leaderboard" style="width: 250px;">
			</div>
			<!-- 
			<div id="login" class="modal">
			  
			  <form class="modal-content animate" action="/login.php">
				<div class="imgcontainer">
				  <span onclick="document.getElementById('login').style.display='none'; listening = true;" class="close" title="Close Modal">&times;</span>
				</div>
				<div class="container">
				  <label><b>Username</b></label>
				  <input type="text" placeholder="Enter Username" name="uname" id="loginUsername" required>
				  <label><b>Password</b></label>
				  <input type="password" placeholder="Enter Password" name="psw" id="loginPassword" required>
				  
				  <input type="checkbox" checked="checked"> Remember me
				  
				  <span class="error"><div id="logInResponse"></div></span>
				  
				  <div  id = "logInFormBtns" class="clearfix">
				  <button type="button" onclick="document.getElementById('login').style.display='none'; listening = true;" class="cancelbtn">Cancel</button>
				  <button type="button" onclick="logIn()" class="signupbtn">Log In</button>
				  </div>
				  <span class="psw">Forgot <a href="#">password?</a></span>
				 </div>
			  </form>
			</div>
			-->
			
			


			<div id="signUp" class="modal">
			 <form class="modal-content animate" action="signUp.php">
			  <div class="imgcontainer">
				<span onclick="document.getElementById('signUp').style.display='none'; listening =  true;" class="close" title="Close Modal">&times;</span>
			  </div>
				<div class="container">
				  <label><b>Enter information to Sign Up</b></label>
				   <!--<input type="text" placeholder="Enter Email" id="email" onfocus = "document.getElementById('signUpResponse').innerHTML=''">-->
			
				   <input type="text" placeholder="Enter Username" id="username" onfocus = "document.getElementById('signUpResponse').innerHTML=''">
				
				  <input type="password" placeholder="Enter Password" id="password" onfocus = "document.getElementById('signUpResponse').innerHTML=''">

				  <input type="password" placeholder="Repeat Password" id="passwordR" onfocus = "document.getElementById('signUpResponse').innerHTML=''">
						  
				  
				  <span class="error"><div id="signUpResponse"></div></span>
				  
				  <div  id = "signUpFormBtns" class="clearfix">
					<button type="button" style= "float:left; background-color: #222;" onclick="document.getElementById('signUp').style.display='none'; listening = true;">Cancel</button>
					<button type="button" style= "float:right; background-color: #eee;" onclick="signUp()" class="signupbtn">Sign Up</button>
				  </div>
				</div>
			  </form>
			</div>
		</td>
		
		<td style="vertical-align:top">
			<div> 
			<canvas id="canvas">Error: Browser does not support canvas element.</canvas>
			</div>
		</td>
		
		<!--<td style="background-color:#F2F4F4 ; width: 200px; vertical-align:top">
		
		</td>-->
		
	</tr>
		<audio id="chocPickUp">
			<source src="health.mp3" type="audio/mp3">
			Your browser does not support the audio element.
		</audio>
</table>
</div>
  </body>
</html>