import _ from 'lodash';
import React from 'react';
import Webcam from 'webcam-easy';

const getRotateTransform = (origin, point, radian) => {
  return [
    (point[0] - origin[0]) * Math.cos(-radian) - (point[1] - origin[1]) * Math.sin(-radian) + origin[0],
    (point[0] - origin[0]) * Math.sin(-radian) + (point[1] - origin[1]) * Math.cos(-radian) + origin[1]
  ]
}

const Cam = (props) => {
  const [time, setTime] = React.useState(10);
  const { width, height } = props;
  let interval;
  let intervalCount = 0;
  let pixelations = [51, 41, 31, 21, 11, 1];
  let backgroundSound;

  React.useEffect(() => {
    backgroundSound = document.getElementById('backgroundSound');
    const webcamElement = document.getElementById('webcam');
    const canvasElement = document.getElementById('canvas');
    const snapSoundElement = document.getElementById('snapSound');
    const webcam = new Webcam(webcamElement, 'user', canvasElement, snapSoundElement);

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
        interval = setInterval(() => {
          if(timeT === 2) {
            snapImage.onload = () => {
              snapTempCtx.drawImage(snapImage, 0, 0);
            }
            snapImage.src = webcam.snap();
          } 

          if(timeT === 1) {
            const sw = snapCanvas.width;
            const sh = snapCanvas.height;
            const imageData = snapTempCtx.getImageData(0, 0, sw, sh);
            const data = imageData.data;
            let y, x, n ,m;
            const pixelation = pixelations[intervalCount % 6]

            for ( y = 0; y < sh; y += pixelation ) {
              for ( x = 0; x < sw; x += pixelation ) {
      
                  var red = data[((sw * y) + x) * 4];
                  var green = data[((sw * y) + x) * 4 + 1];
                  var blue = data[((sw * y) + x) * 4 + 2];
      
                  const origin = [x + _.floor(pixelation / 2), y + _.floor(pixelation / 2)];
                  const rotate = Math.PI * 2 * (red / 255);

                  for ( n = 0; n < pixelation; n++ ) {
                      for ( m = 0; m < pixelation; m++ ) {
                        const rp = getRotateTransform(origin, [x + m, y + n], rotate);
                          if ( x + m < sw ) {
                              data[((sw * _.round(rp[1])) + (_.round(rp[0]))) * 4] = red;
                              data[((sw * _.round(rp[1])) + (_.round(rp[0]))) * 4 + 1] = green;
                              data[((sw * _.round(rp[1])) + (_.round(rp[0]))) * 4 + 2] = blue;
                              // data[((sw * _.round(rp[1])) + (_.round(rp[0]))) * 4 + 3] = 245;
                          }
                      }
                  }
              }
            }

            snapCtx.clearRect(0, 0, snapCanvas.width, snapCanvas.height);
            snapCtx.putImageData( imageData, 0, 0 );
            backgroundSound.pause();
          }

          if(timeT === -10) {
            snapImage.src = null;
            snapCtx.clearRect(0, 0, snapCanvas.width, snapCanvas.height);
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


  return (
    <>
      <div style={{ transform: `scaleX(${props.isLeft ? -1 : 1})`}}>
        <video id="webcam" autoPlay playsInline width={width} height={height}></video>
        <canvas id="canvas" className="d-none" style={{ display: 'none' }}></canvas>
        <audio id="snapSound" src={"https://bensonruan.com/wp-content/uploads/2019/10/snap.wav"} preload = "auto" style={{ display: 'none' }}></audio>
      </div>
      <div style={{ position: 'absolute', top: '24px', left: '50%', fontSize: '100px', color: '#aaa' }}>
        {time > 0 ? time : ""}
      </div>
      <canvas id="snapCanvas" width={width} height={height} style={{ position: 'absolute', top: 0, left: 0 }} />
      <audio id="backgroundSound" src={"/sound/background.wav"} preload = "auto" loop></audio>
    </>
  )
}

export default Cam;