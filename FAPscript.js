var voiceDescData = "";
var faceDescData = "";

function doSecond(){
	myMovie=document.getElementById('myMovie');
	playButton=document.getElementById('playButton');
	bar=document.getElementById('defaultBar');
    voiceMark = document.getElementById("voiceBars");
    faceMark = document.getElementById("faceBars");
	progressBar=document.getElementById('progressBar');
    barSize = parseInt(window.innerWidth * 69 / 100 * 80 / 100 * 60 / 100) - 20;   
	var vid = document.getElementById("myVideo");

	myMovie.onloadeddata = function(){
		divVoiceMark("/data/txt/voiceData.txt");
		//divFaceMark("/data/txt/faceData.txt");
		divFaceMark("/data/txt/AIfaceData.txt");
		sideDesc();
	};
	playButton.addEventListener('click', playOrPause, false);
	bar.addEventListener('click', clickedBar, false);
	voiceMark.addEventListener('mouseover', clickedVoiceMark, false);
    faceMark.addEventListener('mouseover', clickedFaceMark, false);
	doSecondState = true;
}

function doFirst(){
    var fileInfo = sessionStorage.getItem("fileinfo");
	fileInfo = "newClass.mp4";
	var loc = window.location.pathname;
	var dir = loc.substring(0, loc.lastIndexOf('/'));
	if(fileInfo == "default"){
		document.getElementById("myMovie").innerHTML = '<source id="uploadedVideo" src="" alt="none">';
	}
	else{
		document.getElementById("myMovie").innerHTML = '<source id="uploadedVideo" src="/data/video/'+ fileInfo +'" alt="none">';
	}
	doFirstState = true;
    doSecond();
}

function playOrPause() {
	if (!myMovie.paused && !myMovie.ended){
		myMovie.pause();
		playButton.innerHTML='Play';
		window.clearInterval(updateBar);
	} else {
		myMovie.play();
		playButton.innerHTML='Pause';
		updateBar=setInterval(update, 500);
	}
}

function update() {
	if (!myMovie.ended) {
		var size=parseInt(myMovie.currentTime*barSize/myMovie.duration);
		progressBar.style.width=size+'px';
	} else {
		progressBar.style.width='0px';
		playButton.innerHTML='Play';
		window.clearInterval(updateBar);
	}
}

function clickedBar(e){
	if(!myMovie.ended){
		var mouseX=e.pageX-bar.offsetLeft;
		var newtime=mouseX*myMovie.duration/barSize;
		myMovie.currentTime=newtime;
		progressBar.style.width=mouseX+'px';
		progressBar.style.background = "#7cdb00";
	}
}

function clickedVoiceMark(e){
	var tList = document.getElementsByClassName("voice-marker");
	for(var i = 0 ; i < tList.length ; i++){
		tList[i].onclick = function(){
			if(!myMovie.ended){
				var mouseX=e.pageX - bar.offsetLeft;
				var newtime=mouseX*myMovie.duration/barSize;
				myMovie.currentTime=newtime;
				progressBar.style.width=mouseX+'px';
				progressBar.style.background = "red";
			}
		}
	}
}

function clickedFaceMark(e){
	var tList = document.getElementsByClassName("face-marker");
	for(var i = 0 ; i < tList.length ; i++){
		tList[i].onclick = function(){
			if(!myMovie.ended){
				var mouseX=e.pageX - bar.offsetLeft;
				var newtime=mouseX*myMovie.duration/barSize;
				myMovie.currentTime=newtime;
				progressBar.style.width=mouseX+'px';
				progressBar.style.background = "blue";
			}
		}
	}
}

function sideDesc(){	
	document.getElementById("voice-des-list").innerHTML = voiceDescData;
	document.getElementById("face-des-list").innerHTML = faceDescData;
}


function setVoiceMark(vtlist){
	var perv = 0;
	var voiceMarkerData = "";
	for(var i = 1 ; i <= vtlist.length ; i++){
		perv = vtlist[i-1] * barSize / myMovie.duration;
		voiceMarkerData = voiceMarkerData.concat('<li class="voice-marker" style="left:'+perv+'px;"></li>');
	}	
	document.getElementById("voice-marker-list").innerHTML = voiceMarkerData;
	setVoiceMarkState = true;
}

function setVoiceScript(tempVoiceData){
	t1 = [];
	for(var i = 0 ; i < tempVoiceData.length ; i++){
		t1.push(tempVoiceData[i].split("result"));
	}

	var voiceScriptData = "";
	voiceDescData = "";
	var k = 1;

	for(var i = 1 ; i <= t1.length ; i++){
		if(t1[i-1][0][t1[0][0].length - 2] == 1){	//군말인 경우
			if(t1[i-1][1][1] == "어"){
				voiceScriptData = voiceScriptData.concat('<mark style="color:red; background-color:yellow;">'+ t1[i-1][1] +'</mark>');
				voiceDescData = voiceDescData.concat('<li id="sidedesc">'+ k +'</li><img src="src/voiceah.jpg" alt="" style="width:85%; height: 100%;">');
				k++;
			}
			else if(t1[i-1][1][1] == "음"){
				voiceScriptData = voiceScriptData.concat('<mark style="color:red; background-color:lightgreen;">'+ t1[i-1][1] +'</mark>');
				voiceDescData = voiceDescData.concat('<li id="sidedesc">'+ k +'</li><img src="src/voiceum.jpg" alt="" style="width:85%; height: 100%;">');
				k++;
			}
			else if(t1[i-1][1][1] == "그"){
				voiceScriptData = voiceScriptData.concat('<mark style="color:red; background-color:lightblue;">'+ t1[i-1][1] +'</mark>');
				voiceDescData = voiceDescData.concat('<li id="sidedesc">'+ k +'</li><img src="src/voiceg.jpg" alt="" style="width:85%; height: 100%;">');
				k++;
			}
		}
		else if(t1[i-1][0][t1[0][0].length-2] == 0){	//군말이 아닌 경우
			voiceScriptData = voiceScriptData.concat('<span>'+ t1[i-1][1] +'</span>');
		}
	}
	k--;
	document.getElementById("voice-des-title").innerHTML = "<음성 탐지 영역>" + "(" + k + "개)";
	document.getElementById("analScript").innerHTML = voiceScriptData;
	setVoiceScriptState = true;
}

function divVoiceMark(file){
	var rawFilev = new XMLHttpRequest();

    rawFilev.open("GET", file, false);
    rawFilev.onreadystatechange = function ()
    {
        if(rawFilev.readyState === 4)
        {
            if(rawFilev.status === 200 || rawFilev.status == 0){
                var allTextv = rawFilev.responseText;
				allTextv = allTextv.replace(/,/gi,"");
				allTextv = allTextv.replace(/{/gi,"");
				allTextv = allTextv.replace(/}/gi,"");
				allTextv = allTextv.replace(/:/gi,"");
				allTextv = allTextv.replace(/'/gi,"");

				let temperv1 = allTextv.split("\n");
				
				let temperv2 = [];
				for(var i = 0 ; i < temperv1.length ; i++){
					temperv2.push(temperv1[i].split(" "))
				}
				//분리된 음성 분석 데이터
				var voiceTimeList = [];

				for(var i = 0 ; i < temperv2.length-1 ; i++){
					if(temperv2[i][5] == "1001"){
						voiceTimeList.push(parseInt(temperv2[i][1]) / 1000);
					}
				}
				setVoiceMark(voiceTimeList);
				setVoiceScript(temperv1);
				divVoiceMarkState = true;
            }
        }
    }
    rawFilev.send(null);	
}

function setFaceMark(ftlist){
	var perf = 0;
	var faceMarkerData = "";

	for(var i = 1 ; i <= ftlist.length ; i++){
		perf = ftlist[i-1] * barSize / myMovie.duration - 20;
		
		if(i % 2 == 0){
			faceMarkerData = faceMarkerData.concat('<li class="face-marker" style="left:'+perf+'px; line-height: 0%;"></li>');
		}	
		else{
			faceMarkerData = faceMarkerData.concat('<li class="face-marker" style="left:'+perf+'px; line-height: 450%;"></li>');
		}
	}
	document.getElementById("face-marker-list").innerHTML = faceMarkerData;
	setFaceMarkState = true;
}

function divFaceMark(file){
	var rawFilef = new XMLHttpRequest();
	faceDescData = "";
	
    rawFilef.open("GET", file, false);
    rawFilef.onreadystatechange = function ()
    {
        if(rawFilef.readyState === 4)
        {
            if(rawFilef.status === 200 || rawFilef.status == 0){
                var allTextf = rawFilef.responseText;
				allTextf = allTextf.replace(/,/gi,"");
				allTextf = allTextf.replace(/{/gi,"");
				allTextf = allTextf.replace(/}/gi,"");
				allTextf = allTextf.replace(/:/gi,"");
				allTextf = allTextf.replace(/'/gi,"");
				
				var tempf = [];
				var faceTimeList = [];
				tempf = allTextf.split(" ");
				//분리된 영상분석 데이터
				var k = 1;
				for(var i = 0 ; i < tempf.length ; i++){
					if(i % 2 != 0){
						if(tempf[i] == "SideFail"){
							faceDescData = faceDescData.concat('<li id="sidedesc">'+ k +'</li><img src="src/faceside.jpg" alt="" style="width:85%; height: 100%;">');
							k++
						}
						else if(tempf[i] == "DownFail"){
							faceDescData = faceDescData.concat('<li id="sidedesc">'+ k +'</li><img src="src/facedown.jpg" alt="" style="width:85%; height: 100%;">');
							k++;
						}
					}	
					else{
						faceTimeList.push(parseFloat(tempf[i]));
					}
				}
				k--;
				document.getElementById("face-des-title").innerHTML = "<영상 탐지 영역>" + "(" + k + "개)";
				setFaceMark(faceTimeList);
				divFaceMarkState = true;
            }
        }
    }
    rawFilef.send(null);	
	
	if(doFirstState && doSecondState && divVoiceMarkState && divFaceMarkState && setVoiceMarkState && setVoiceScriptState && setFaceMarkState){
		setTimeout(function(){
				fadeOut();
			}, 2000);
	}

}

$(document).ready(function(){
    $(".loading").load("FileLoadingPage.html");
});

function fadeOut(){
	$(".loading").fadeOut();
}

window.addEventListener('load',doFirst,false);