    <?php
    include 'thumbnail.php';
    define('UPLOAD_DIR', './uploads/img/');
    define('THUMBNAIL_UPLOAD_DIR', './uploads/thumbnail/');
    $img = $_POST['imgBase64'];
    $img = str_replace('data:image/png;base64,', '', $img);
    $img = str_replace(' ', '+', $img);
    $data = base64_decode($img);
    $id = uniqid();
    $file = UPLOAD_DIR . $id . '.png';
    $success = file_put_contents($file, $data);
    thumbnail($file, THUMBNAIL_UPLOAD_DIR.$id.'.png', 250);
    print $success ? THUMBNAIL_UPLOAD_DIR.$id.'.png' : 'Unable to save the file.';
?> 
