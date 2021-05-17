(function() {

	'use strict';

	let vid, c1, ctx1, c2, ctx2, 
  background, bgData,
	width, height, 
	baseFPS=30, recursionRate = 1000/baseFPS,
	settings, baseR=60, baseG=50, baseB=130;
  	
	const constraints = {
		video: {width: {exact: 650}, height: {exact: 350}}
	};
	const video = document.querySelector('video');

	function handleSuccess(stream) {
		video.srcObject = stream;
		setTimeout( function () { init(); }, 500);
	}
	function handleError(error) { console.error('Rejected!', error); }

	function init(){
		createUI();

		c1 = document.getElementById('c1');
		ctx1 = c1.getContext('2d');
		c2 = document.getElementById('c2');
		ctx2 = c2.getContext('2d');
    
    c2.addEventListener("mouseup", drawCanvasToDOM);

		width = c1.width = c2.width = video.videoWidth;
		height = c1.height = c2.height = video.videoHeight;
    
    // background = new Image();
    // background.src = "https://uploads.codesandbox.io/uploads/user/97cd7267-801d-49ac-a321-3afb72014b4d/GsGV-bunny.jpg";
    // background.onload = function(){
    //   ctx2.drawImage(background, 0, 0, width, height);
    //   bgData = ctx2.getImageData(0, 0, width, height);
    // }
    
//       var player = document.getElementById('player');
//  var snapshotCanvas = document.getElementById('snapshot');
//  var captureButton = document.getElementById('capture');
//
//  var handleSuccess = function(stream) {
//   
//    player.srcObject = stream;
//  };
//
//  captureButton.addEventListener('click', function() {
//    var context = snapshot.getContext('2d');
//
//    context.drawImage(player, 0, 0, snapshotCanvas.width,
//        snapshotCanvas.height);
//    console.log(context.canvas.toDataURL());
//  });
//
//  navigator.mediaDevices.getUserMedia({video: true})
//      .then(handleSuccess); 
//        

        
    timerCallback();
	}

	function createUI(){
		settings = QuickSettings.create(0, 0, 'Adujust Chroma Key RGB', document.getElementById('ui'));
		settings.addRange('RED ('+baseR+')', 0, 255, baseR, 1, function(e){ baseR = e; });
		settings.addRange('GREEN ('+baseG+')', 0, 255, baseG, 1, function(e){ baseG = e; });
		settings.addRange('BLUE ('+baseB+')', 0, 255, baseB, 1, function(e){ baseB = e; });
		// settings.addRange('FPS', 1, 60, baseFPS, 1, function(e){ recursionRate = 1000 / e; });
	}

	function timerCallback() {
		computeFrame();
		setTimeout( function () {
		    timerCallback();
		}, recursionRate);
	}
	function computeFrame() {
		ctx1.drawImage(video, 0, 0, width, height);
		let frame = ctx1.getImageData(0, 0, width, height);
		let l = frame.data.length / 4;
		for (let i = 0; i < l; i++) {
		    let r = frame.data[i * 4 + 0];
		    let g = frame.data[i * 4 + 1];
		    let b = frame.data[i * 4 + 2];
		    if (g > baseG && r > baseR && b < baseB) {
          frame.data[i * 4 + 3] = 0;
          // bgData.data[i * 4 + 3];
        }
		        
		}
		ctx2.putImageData(frame, 0, 0);
		return;
	}
  
  let allImages = [];
  let imageDIV = document.getElementById('imageDIV');
  
  function drawCanvasToDOM(){
    let dataURL = c2.toDataURL(),
        imageEl = document.createElement('img');
    imageEl.src = dataURL;
    // imageEl.setAttribute("style","width:50px" )
    // imageDIV.appendChild(imageEl);
    allImages.push(imageEl);
    
    if(allImages.length === 10){
      
      gifshot.createGIF({
        'images': allImages,
        'gifWidth': 320,
        'gifHeight': 240
      }, function(obj) {
        if(!obj.error) {
          var image = obj.image,
              animatedImage = document.createElement('img');
          animatedImage.src = image;
          imageDIV.appendChild(animatedImage);
        }
      });
      
    }
  }

	navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
	
})();