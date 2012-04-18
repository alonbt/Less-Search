<!DOCTYPE HTML>
<html>
<head>
<meta HTTP-EQUIV="content-type" CONTENT="text/html; charset=UTF-8" />

<link rel="stylesheet" type="text/css" href="css/jquery.snippet.min.css" />
<link href="css/fileuploader.css" rel="stylesheet" type="text/css">	
<!--<link type="text/css" href="css/myStyles.css" rel="Stylesheet" />-->	

<link rel="stylesheet/less" type="text/css" href="css/main.less">
<script src="css/less-1.3.0.min.js" type="text/javascript"></script>

<script type="text/javascript" src="js/jQuery.js"></script>
<script type="text/javascript" src="js/jquery.snippet.min.js"></script>
<script src="js/fileuploader.js" type="text/javascript"></script>
<script type="text/javascript" src="js/myScript.js"></script>

<style>


</style>

<title>CSS to LESS seach</title>
</head>

<body>
<a href="#" id="goBackButton">Go Back</a>
<div class="headerWrapper">
	<header>
		<h1>Search CSS Rule</h1>
		<h2>Search for <span class="underline">nested CSS rules</span> inside your <span class="underline">LESS files</span></h2>
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
		<div class="clearBoth"></div>
	</div>
	</header>
</div><!-- End of .headerWrapper -->
<div class="contentWrapper">
	<div class="content">
		<div id="viewDemo">
			<a href="#" id="viewDemoLink">See an Example</a>
		</div><!-- End of .viewDemo -->
		
		<div class="searchPageWrapper">
			<div class="searchInputWrapper">
				<input type="text" name="searchLessString" id="searchLessString" />
				<div id="headerButtons">
					<a id="changeText" href="#">Upload</a>
					<a id="downloadFile" href="#">Download</a>		
				</div><!-- end of #headerButtons -->
			</div><!-- End of .searchInputWrapper-->
			
			<div class="lessFileContentWrapper">
				<div class="lessFileContent">
					<div id="lessCode" contenteditable="true">
						<PRE class="styles">

						</PRE>
					</div>
				</div><!-- End of .lessFileContent-->
			</div><!-- End of .lessFileContentWrapper-->
		</div><!-- End of .contentWrapper -->
	</div><!-- End of .content-->
</div><!-- End of .contentWrapper -->
</body>

</html>