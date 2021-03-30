import _ from 'lodash';
import React from 'react';
import Webcam from 'webcam-easy';

const getRotateTransform = (origin, point, radian) => {
  return [
    (point[0] - origin[0]) * Math.cos(-radian) - (point[1] - origin[1]) * Math.sin(-radian) + origin[0],
    (point[0] - origin[0]) * Math.sin(-radian) + (point[1] - origin[1]) * Math.cos(-radian) + origin[1]
  ]
}

let isRequest = true;

const Cam = (props) => {
  const [time, setTime] = React.useState(10);
  const { width, height } = props;
  let interval;
  let intervalCount = 0;
  let pixelations = [51, 41, 31, 21, 11, 1];
  let backgroundSound;
  let anim = null;
  let requestTime = new Date().getTime();

  const processingWorker = new Worker('workers/processing.js')

  React.useEffect(() => {
    backgroundSound = document.getElementById('backgroundSound');
    const webcamElement = document.getElementById('webcam');
    const canvasElement = document.getElementById('canvas');
    const snapSoundElement = document.getElementById('snapSound');
    const webcam = new Webcam(webcamElement, 'user', canvasElement, snapSoundElement);

    const ctx = canvasElement.getContext('2d');

    backgroundSound.play();

    const snapCanvas = document.getElementById('snapCanvas');
    const snapCtx = snapCanvas.getContext('2d');
    
    const snapTempCanvas = document.createElement('canvas');
    snapTempCanvas.width = width;
    snapTempCanvas.height = height;
    const snapTempCtx = snapTempCanvas.getContext('2d');

    const snapImage = new Image();

    let timeT = time;

    webcam.start()
      .then(result =>{
        console.log("webcam started");

        anim = requestAnimationFrame(() => draw(webcamElement, snapCtx));

        interval = setInterval(() => {
          if(timeT === 1) {
            isRequest = false;
            cancelAnimationFrame(anim);
            backgroundSound.pause();
            snapSoundElement.play();
          }

          if(timeT === -10) {
            isRequest = true;
            anim = requestAnimationFrame(() => draw(webcamElement, snapCtx));
            intervalCount++;
            backgroundSound.play();
          }
          timeT = timeT - 1 < -10 ? 10 : timeT - 1;
          setTime(timeT);
        }, 1000);
      })
      .catch(err => {
        console.log(err);
      });


    return () => {
      clearInterval(interval);
    }
  }, [width])

  const draw = (webcamElement, snapCtx) => {
    const { width, height } = props;

    // if(new Date().getTime() - requestTime < 36) {
    //   anim = requestAnimationFrame(() => draw(webcamElement, snapCtx));
    //   return false;
    // }

    const snapTempCanvas = document.createElement('canvas');
    snapTempCanvas.width = width;
    snapTempCanvas.height = height;
    const snapTempCtx = snapTempCanvas.getContext('2d');

    const PrevSnapTempCanvas = document.createElement('canvas');
    PrevSnapTempCanvas.width = width;
    PrevSnapTempCanvas.height = height;
    const PrevSnapTempCtx = PrevSnapTempCanvas.getContext('2d');

    const snapCanvas = document.getElementById('snapCanvas');

    if(_.isNull(snapCanvas)) return false;

    snapTempCtx.drawImage(webcamElement, 0, 0, width, height);
    PrevSnapTempCtx.drawImage(snapCanvas, 0, 0, width, height);

    const imageData = snapTempCtx.getImageData(0, 0, width, height);

    let y, x, n ,m;
    const pixelation = pixelations[intervalCount % 6];

    processingWorker.postMessage({
      pixelation,
      imageData,
      width,
      height
    });

    processingWorker.onmessage = function(evt) {
      const { imageData } = evt.data;

      snapCtx.putImageData(imageData, 0, 0 );
      snapCtx.globalAlpha = 0.85;
      snapCtx.drawImage(PrevSnapTempCanvas, 0, 0);
  
      requestTime = new Date().getTime();
      if(isRequest) {
        anim = requestAnimationFrame(() => draw(webcamElement, snapCtx));
      }
      else {
        cancelAnimationFrame(anim);
      }
    }
  }

  return (
    <>
      <div style={{ transform: `scaleX(${props.isLeft ? -1 : 1})`}}>
        <video id="webcam" autoPlay playsInline width={width} height={height} style={{ display: 'none' }}></video>
        <canvas id="canvas" className="d-none" style={{ display: 'none' }}></canvas>
        <audio id="snapSound" src={"https://bensonruan.com/wp-content/uploads/2019/10/snap.wav"} preload = "auto" style={{ display: 'none' }}></audio>
      </div>
      <div style={{ position: 'absolute', top: 0, left: 0, transform: `scaleX(${props.isLeft && time > 0 ? 1 : -1})`}}>
        <canvas id="snapCanvas" width={width} height={height} />
      </div>
      <div style={{ width, height, position: 'absolute', top: 0, left: 0, backgroundColor: 'rgba(153, 25, 94, 0.1)' }} />
      <div style={{ position: 'absolute', top: '24px', left: '50%', fontSize: '100px', color: '#aaa' }}>
        {time > 0 ? time : ""}
      </div>
      <audio id="backgroundSound" src={"/sound/background.wav"} preload = "auto" loop></audio>
    </>
  )
}

export default Cam;