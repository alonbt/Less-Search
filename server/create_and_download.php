<?php 
$filename = $_REQUEST['filename'];
$content = $_REQUEST['content'];
if ($filename != "") {
	
} else {
	$filename = "styles.less";
}

// Open the file and erase the contents if any 
$fp = fopen($filename, "w"); 

// Write the data to the file 
fwrite($fp, $content); 

// Close the file 
fclose($fp); 

$file = $filename;

if (file_exists($file)) {
    header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename='.basename($file));
    header('Content-Transfer-Encoding: binary');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($file));
    ob_clean();
    flush();
    readfile($file);
    exit;
}

?>
