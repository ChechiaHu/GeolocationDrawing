let MAX_COMMENT_LENGTH = 32;

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
        console.log(o['times']);
        o['files'].forEach(function(element, index, array) {
            let datestr = o['times'][index];
            addImg("./screenshot/uploads/thumbnail/" + element, datestr);
        });
    });
}

function screenshot() {    
    var canvas = document.getElementById("myCanvas");
    var dataURL = canvas.toDataURL();
    var textBox = document.getElementById("commentText");
    
    let comment = (textBox.value === "") ? "無主旨" : textBox.value;
    console.log(comment.length)
    let msg = document.getElementById("screenshotButtonMsg");
    if (comment.length > MAX_COMMENT_LENGTH) {
        msg.innerHTML = "儲存失敗；註釋至多能有" + MAX_COMMENT_LENGTH + "個文字";
        return;
    } else if (comment.indexOf('.') != -1 || comment.indexOf('/') != -1) {
        msg.innerHTML = "儲存失敗；註釋不可包含句號或斜線";
        return;
    } else {
        msg.innerHTML = "";
    }

    $.ajax({
      type: "POST",
      url: "screenshot/upload.php",
      data: { 
         imgBase64: dataURL,
         comment: comment
      }
    }).done(function(o) {
      let path = pathJoin(['screenshot', o.trim()]);
      let date = (new Date()).toTimeString()
      addImg(path, date);
    });
}

function addImg(path, datestr) {
    let commentStart = path.indexOf('-') + 1;
    let commentEnd = path.lastIndexOf('.');
    let comment = path.substr(commentStart, commentEnd - commentStart);
    
    var div = $('<div class="imgitemcontainer"></div>');
    
    var imgDiv = $('<div class="imgitem"></div>');
    var img = $('<img src="'+path+'">');
    var full_path = path.replace('thumbnail', 'img');
    var a = $('<a href="'+full_path+'" target="_blank"></a>');
    
    var commentDiv = $('<div class="comment"></div>');
    $(commentDiv).append(comment)
    $(commentDiv).append('<br>' + datestr)
    
    $(imgDiv).append(img)
    $(a).append(imgDiv);
    $(div).append(a);
    $(div).append(commentDiv);
    $('#savedImages').prepend(div);
}

init();
