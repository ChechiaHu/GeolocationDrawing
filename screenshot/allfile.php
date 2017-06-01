<?php
    // define('UPLOAD_DIR', './uploads/img/');
    // foreach (new DirectoryIterator(UPLOAD_DIR) as $file) {
    //   if ($file->isFile()) {
    //       print "".$file->getFilename() . "\n";
    //   }
    // }
?> 
<?php
    error_reporting(E_ERROR | E_PARSE);
    
    define('UPLOAD_DIR', './uploads/img/');
    $return_array = array();
    $return_array_times = array();

    if(is_dir(UPLOAD_DIR)){

        if($dh = opendir(UPLOAD_DIR)){
            while(($file = readdir($dh)) != false){

                if($file == "." or $file == ".."){

                } else {
                    $return_array[] = $file; // Add the file to the array
                    $return_array_times[] = strftime("%c", filectime(UPLOAD_DIR . $file));
                }
            }
        }
        $result = array();
        $result['files'] = $return_array;
        $result['times'] = $return_array_times;
        error_log(json_encode($result));
        echo json_encode($result);
    }

?>