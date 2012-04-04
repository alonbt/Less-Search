<!DOCTYPE HTML>
<html>
<head>
<meta HTTP-EQUIV="content-type" CONTENT="text/html; charset=UTF-8" />

<link rel="stylesheet" type="text/css" href="css/jquery.snippet.min.css" />
<link href="css/fileuploader.css" rel="stylesheet" type="text/css">	
<link type="text/css" href="css/myStyles.css" rel="Stylesheet" />	

<script type="text/javascript" src="js/jQuery.js"></script>
<script type="text/javascript" src="js/jquery.snippet.min.js"></script>
<script src="js/fileuploader.js" type="text/javascript"></script>
<script type="text/javascript" src="js/myScript.js"></script>

<style>


</style>

<title>CSS to LESS seach</title>
</head>

<body>
<div class="wrapper">
	<header>
		<h1>Search CSS Rule</h1>
		<input type="text" name="searchLessString" id="searchLessString" />
		<div id="headerButtons">
			<a id="changeText" href="#">Upload</a>
			<a id="downloadFile" href="#">Download</a>		
		</div><!-- end of #headerButtons -->
	</header>
	<div id="lessCode" contenteditable="true">
		<PRE class="styles">
		div {
			.class {
				color:red;
			}
		}
		</PRE>
	</div>
</div><!-- End of .wrapper -->
<div id="openingBox-background"></div>
<div id="openingBox">
	<header>
		<h1>
			LessToCSS
		</h1>
		<a href="#" id="viewDemo">View Demo</a>
	</header>
	<div class="inputTypes">
		<div id="file-upload">		
			<noscript>			
				<p>Please enable JavaScript to use file uploader.</p>
				<!-- or put a simple form for upload here -->
			</noscript>         
		</div>
		<form id="getLessCode">
			<textarea id="textAreaLessText" rows="2" cols="20">
			</textarea>
			<input type="submit" value="Submit" />
		</form>
	</div>
</div><!-- End of #openingBox -->
</body>

</html>