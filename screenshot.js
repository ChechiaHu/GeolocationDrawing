function pathJoin(parts, sep){
   var separator = sep || '/';
   var replace = new RegExp(separator+'{1,}', 'g');
   return parts.join(separator).replace(replace, separator);
}

function init() {
    $.ajax({
        type: "GET",
        url: "screenshot/allfile.php"
    }).done(function(o) {
        o = JSON.parse(o);
        console.log(o['files']);
        o['files'].forEach(function(element, index, array) {
            addImg("./screenshot/uploads/thumbnail/" + element);
        });
    });
}

function screenshot() {
    var canvas  = document.getElementById("myCanvas");
    var dataURL = canvas.toDataURL();
    console.log("URL: " + dataURL);

    $.ajax({
      type: "POST",
      url: "screenshot/upload.php",
      data: { 
         imgBase64: dataURL
      }
    }).done(function(o) {
        let path = pathJoin(['screenshot', o.trim()]);
      addImg(path);
    });
}

function addImg(path) {
    var div = $('<div class="imgitem"></div>');
    var img = $('<img src="'+path+'">');
    var full_path = path.replace('thumbnail', 'img');
    var a = $('<a href="'+full_path+'" target="_blank"></a>');
    $(a).append(img);
    $(div).append(a);
    $('#savedImages').prepend(div);
    console.log()
}

init();
