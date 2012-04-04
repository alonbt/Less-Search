<?php 
//$myFile = $_REQUEST['filename'];
if ( isset($_REQUEST['filename'])) {
	$myFile = $_REQUEST['filename'];
	$fh = fopen($myFile, 'r');
    while(!feof($fh))
      {
          echo fgets($fh);
      }
	fclose($fh);
	
} else {
	echo "something Went Wrong";
};
?>