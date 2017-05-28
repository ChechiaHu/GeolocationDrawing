<?php
    function thumbnail($url, $filename, $width = 150, $height = true) {

     // download and create gd image
     $image = ImageCreateFromString(file_get_contents($url));

     // calculate resized ratio
     // Note: if $height is set to TRUE then we automatically calculate the height based on the ratio
     $height = $height === true ? (ImageSY($image) * $width / ImageSX($image)) : $height;

     // create image 
     $output = ImageCreateTrueColor($width, $height);
     ImageCopyResampled($output, $image, 0, 0, 0, 0, $width, $height, ImageSX($image), ImageSY($image));

     // save image
     ImageJPEG($output, $filename, 95); 

     // return resized image
     return $output; // if you need to use it
    }
?>