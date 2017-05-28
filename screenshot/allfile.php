<?php
    // define('UPLOAD_DIR', './uploads/img/');
    // foreach (new DirectoryIterator(UPLOAD_DIR) as $file) {
    //   if ($file->isFile()) {
    //       print "".$file->getFilename() . "\n";
    //   }
    // }
?> 
<?php
    define('UPLOAD_DIR', './uploads/img/');
    $return_array = array();

    if(is_dir(UPLOAD_DIR)){

        if($dh = opendir(UPLOAD_DIR)){
            while(($file = readdir($dh)) != false){

                if($file == "." or $file == ".."){

                } else {
                    $return_array[] = $file; // Add the file to the array
                }
            }
        }
        $result = array();
        $result['files'] = $return_array;
        echo json_encode($result);
    }

?>