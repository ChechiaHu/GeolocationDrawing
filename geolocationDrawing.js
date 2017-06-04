var gDataPoints = [];
var gStandardDeviation = 0;
var gLastPixel = [];

let MAX_DATA_POINTS = 10;
let LOCATION_UPSCALE = 1000000;

function addDataPoint(p) {
    if (gDataPoints.length > MAX_DATA_POINTS) {
        gDataPoints.shift() // Remove first (oldest) element
    }
    gDataPoints.push(p); // Add new element

    if (gDataPoints.length < 3) {
        return;
    }

    // Get the mean distance between adjacent points
    var meanSqDistance = 0;
    for (var i = 1; i < gDataPoints.length; ++i) {
        let dx = LOCATION_UPSCALE * (gDataPoints[i-1][0] - gDataPoints[i][0]);
        let dy = LOCATION_UPSCALE * (gDataPoints[i-1][1] - gDataPoints[i][1]);
        meanSqDistance += dx*dx + dy*dy;
    }
    meanSqDistance /= gDataPoints.length - 1;

    // Get the variance of distances between adjacent points
    var variance = 0;
    for (var i = 1; i < gDataPoints.length; ++i) {
        let dx = LOCATION_UPSCALE * (gDataPoints[i-1][0] - gDataPoints[i][0]);
        let dy = LOCATION_UPSCALE * (gDataPoints[i-1][1] - gDataPoints[i][1]);
        let sqDistance = dx*dx + dy*dy;

        let inner = sqDistance - meanSqDistance;
        variance += inner*inner;
    }
    variance /= gDataPoints.length - 2;
    gStandardDeviation = Math.sqrt(variance);
}

var watchID;

if (navigator.geolocation) {
    alert("GPS已定位成功，請按下確認鍵。");
    // 支援GPS地理定位
    navigator.geolocation.getCurrentPosition(geoYes, geoNo, { enableHighAccuracy: true, timeout: 500000 });
} else {
    alert("目前GPS無法定位，請檢查GPS設備狀況。");
}

function geoYes(evt) {
    if (evt.coords === null) {
        str = "evt.coords不存在";
        document.getElementById("posStr").innerHTML = str;
        return
    }

    str = "緯度" + evt.coords.latitude;
    str += "<br />經度" + evt.coords.longitude;
    str += "<br />精確度" + evt.coords.accuracy;
    document.getElementById("posStr").innerHTML = str;

    //str = "http://maps.googleapis.com/maps/api/staticmap?zoom=15&size=300x300&sensor=false&center=" + evt.coords.latitude + "," + evt.coords.longitude;
    str = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBdXkqR9RYuoAUstYgivrJsMMdukIWcBNQ&callback=initMap"
    document.getElementById("map").src = str;

    let point = [evt.coords.latitude, evt.coords.longitude];
    let lastPoint = gDataPoints[gDataPoints.length-2];
    var distanceSq = 999999;
    if (lastPoint !== undefined) {
        let plpdx = LOCATION_UPSCALE * (point[0] - lastPoint[0]);
        let plpdy = LOCATION_UPSCALE * (point[1] - lastPoint[1]);
        distanceSq = plpdx*plpdx + plpdy*plpdy;
    }

    if (gDataPoints.length === 0) {
        let canvas = document.getElementById("myCanvas");
        gLastPixel = [canvas.width / 2, canvas.height / 2];
    }
    addDataPoint(point);

    let DELTA_MIN = 0.00001; // TODO
    if (lastPoint !== undefined && (distanceSq / gStandardDeviation) < 3) {
        var dLat = evt.coords.latitude - lastPoint[0];
        var dLong = evt.coords.longitude - lastPoint[1];

        //This will make (dLatScaled, dLongScaled) >= (1,1)
        let dLatAbs = Math.abs(dLat);
        let dLongAbs = Math.abs(dLong);
        var scalingFactor = 0;
        if (dLatAbs < DELTA_MIN && dLongAbs < DELTA_MIN) {
            return;
        } else if (dLatAbs < DELTA_MIN && dLongAbs >= DELTA_MIN) {
            scalingFactor = 1 / dLongAbs;
        } else if (dLatAbs >= DELTA_MIN && dLongAbs < DELTA_MIN) {
            scalingFactor = 1 / dLatAbs;
        } else {
            scalingFactor = 1 / Math.min(dLatAbs, dLongAbs);
        }

        let dLatScaled = dLat * scalingFactor;
        let dLongScaled = dLong * scalingFactor;
        let newPixel = [gLastPixel[0] + dLatScaled, gLastPixel[1] + dLongScaled];

        //use dLat, dLong to draw line on map
        let canvas = document.getElementById("myCanvas");
        if (canvas.getContext) {
            let context = canvas.getContext("2d");

            context.beginPath();
            // console.log("drawing from (" + pixelX + ", " + pixelY + ")...")
            context.moveTo(gLastPixel[0], gLastPixel[1]);
            // console.log("...to (" + pixelX + ", " + pixelY + ")")
            context.lineTo(newPixel[0], newPixel[1]);
            context.stroke()
        }

        gLastPixel = newPixel;
    }
}

function geoNo(evt) {
    alert("GPS取得失敗");
}

function startGPS() {
    watchID = navigator.geolocation.watchPosition(geoYes, geoNo);
    //document.getElementById("watchStr").innerHTML = "畫筆啟動中...！！";
    document.getElementById("watchStr1").innerHTML = "畫筆啟動中...！！";
}

function stopGPS() {
    navigator.geolocation.clearWatch(watchID);
    //document.getElementById("watchStr").innerHTML = "畫筆停止嘍...！！";
    document.getElementById("watchStr1").innerHTML = "畫筆停止嘍...！！";

}

function clearMap() {
    let canvas = document.getElementById("myCanvas");
    if (canvas.getContext) {
        let context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.beginPath();
        context.fillStyle = "#FFFFFF";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.closePath();

        context.fill();

    }
}