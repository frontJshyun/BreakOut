import React from 'react';
import _ from 'lodash';

import PerceivedService from '../services/PerceivedService';
import UserName from './steps/UserName';
import GameReady from './steps/GameReady';
import GameOver from './steps/GameOver';
import PerceivedList from './steps/PerceivedList';
import Keyboard from './Keyboard';
import Cam from './Cam';

// type Action = { type: 'INCREASE' } | { type: 'DECREASE' };
type Action = { type: 'SET_WIDTH', value: number };

function reducer(state: number, action: Action) {
  switch(action.type) {
    case 'SET_WIDTH':
      return action.value;
    default:
      throw new Error('Unhandled action');
  }
}

function BreakOut() {
  // const [width, dispatch] = React.useReducer(reducer, _.clamp(window.innerWidth, 1024));
  const [width, setWidth] = React.useState(_.clamp(window.innerWidth, 640, 1024));
  const [isBeforeStart, setIsBeforeStart] = React.useState(true);
  const [userName, setUserName] = React.useState("");
  const [isLeft, setIsLeft] = React.useState(false);
  const [isRight, setIsRight] = React.useState(false);
  
  const [isUserName, setIsUserName] = React.useState(true);
  const [isGameReady, setIsGameReady] = React.useState(false);
  const [isGameStart, setIsGameStart] = React.useState(false);
  const [isGameOver, setIsGameOver] = React.useState(false);
  const [isPerceivedList, setIsPerceivedList] = React.useState(false);

  const [startCount, setStartCount] = React.useState(0);


  let breakOutCtx: CanvasRenderingContext2D | null;
  let browserWidth = 0;
  let is_leftPannel = false, is_rightPannel = false;
  let ballRadius: number, ballX: number, ballY: number, dx: number, dy: number, paddleX: number, paddleW: number, paddleH: number;
  let anim: number;

  let introSound: any, gameStartSound: any, backgroundSound: any, leftKeySound: any, rightKeySound: any, gameOverSound: any, skipSound: any;

  React.useEffect(() => {
    ready();
    

    var context = new AudioContext();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeydown);
      window.removeEventListener('keyup', handleKeyup);
    }
  }, [])
  
  const ready = () => {
    introSound = document.getElementById('introSound');
    gameStartSound = document.getElementById('gameStartSound');
    // backgroundSound = document.getElementById('backgroundSound');
    leftKeySound = document.getElementById('leftKeySound');
    rightKeySound = document.getElementById('rightKeySound');
    gameOverSound = document.getElementById('gameOverSound');
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('keyup', handleKeyup);

    breakOutCtx = getCanvasRenderingContext2D(getCanvasElementById('breakOut'));
    
    handleResize();
    initPaddlePosition();
    initBallPosition();
    drawBall(breakOutCtx, ballX, ballY, ballRadius);
    drawPaddle(breakOutCtx, paddleX, getHeight(browserWidth) - paddleH - 10, paddleW, paddleH);
  }

  const handleResize = () => {
    // dispatch({ type: 'SET_WIDTH', value: _.clamp(window.innerWidth, 1024)});
    browserWidth = _.clamp(window.innerWidth, 640, 1024);
    paddleX = _.clamp(paddleX, 0, browserWidth - paddleW);
    setWidth(browserWidth);
  }

  const getHeight = (width: number) => {
    return _.round(width * 0.75);
  }

  const handleKeydown = (evt: KeyboardEvent) => {
    if (evt.code === 'ArrowLeft') {
      if(!is_leftPannel) leftKeySound.play();
      is_leftPannel = true;
      setIsLeft(true)
    } else if (evt.code === 'ArrowRight') {
      if(!is_rightPannel) rightKeySound.play();
      is_rightPannel = true;
      setIsRight(true)
    }
  }

  const handleKeyup = (evt: KeyboardEvent) => {
    if (evt.code === 'ArrowLeft') {
      is_leftPannel = false;
      setIsLeft(false)
    } else if (evt.code === 'ArrowRight') {
      is_rightPannel = false;
      setIsRight(false);
    }
  }

  const handleNextStepGameReady = (userName: string) => {
    if(_.isEmpty(userName)) return false;

    setUserName(userName);
    setIsUserName(false);
    setIsGameReady(true);
  }

  const handleNextStepGameStart = () => {
    setIsGameReady(false);
    ready();
    
    setStartCount(5);
    let count = 5;
    const interval = setInterval(() => {
      count--;
      setStartCount(count);
      if(count === 0) {
        clearInterval(interval)
        setIsGameStart(true);
        anim = requestAnimationFrame(draw);
        gameStartSound.play();
        // backgroundSound.play();
      }
    }, 1000)
  }

  const handleNextStepGameOver = () => {
    cancelAnimationFrame(anim);
    if(breakOutCtx) {
      clearCanvas(breakOutCtx);
    }
    setIsGameStart(false);
    setIsGameOver(true);

    window.removeEventListener('resize', handleResize);
    window.removeEventListener('keydown', handleKeydown);
    window.removeEventListener('keyup', handleKeyup);

    // backgroundSound.pause();
    gameOverSound.play();
    leftKeySound.pause();
    rightKeySound.pause();
  }

  const handleNextStepPerceivedList = (description: string) => {
    PerceivedService.postPerceived({ userName, description })
       .then((res: any) => {
         const { status } = res;
         if(status === 201) {
           setIsGameOver(false)
           setIsPerceivedList(true);
           skipSound = document.getElementById('skipSound');
           skipSound.play();
         }
       })
  }

  const handleNextStepInit = () => {
    setIsPerceivedList(false);
    setIsUserName(true)
  }

  const getCanvasElementById = (id: string): HTMLCanvasElement => {
    const canvas = document.getElementById(id);

    if (!(canvas instanceof HTMLCanvasElement)) {
        throw new Error(`The element of id "${id}" is not a HTMLCanvasElement. Make sure a <canvas id="${id}""> element is present in the document.`);
    }

    return canvas;
  }

  const getCanvasRenderingContext2D = (canvas: HTMLCanvasElement): CanvasRenderingContext2D => {
      const context = canvas.getContext('2d');

      if (context === null) {
          throw new Error('This browser does not support 2-dimensional canvas rendering contexts.');
      }

      return context;
  }

  const initPaddlePosition = () => {
    paddleW = 180;
    paddleH = 20;
    paddleX = (width / 2) - (paddleW / 2);
  }

  const initBallPosition = () => {
    ballRadius = 10;
    // ballX = paddleX + (paddleW * 0.8);
    // ballY = getHeight(browserWidth) - paddleH - ballRadius - 11;
    ballX = 50;
    ballY = 50;
    dx = 4;
    dy = 8;
  }

  const clearCanvas = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, browserWidth, getHeight(browserWidth));
  }

  const draw = () => {
    if(breakOutCtx) {
      clearCanvas(breakOutCtx);
      drawBall(breakOutCtx, ballX, ballY, ballRadius);
      drawPaddle(breakOutCtx, paddleX, getHeight(browserWidth) - paddleH - 10, paddleW, paddleH);

      ballX += dx;
      ballY += dy;

      if(ballX >= browserWidth - ballRadius || ballX <= 0 + ballRadius){
        dx = -dx;
      }
      if (ballY <= 0 + ballRadius) {
        dy = -dy;
      } else if(ballY >= getHeight(browserWidth) - ballRadius - paddleH - 11){
          if(ballX > paddleX - ballRadius && ballX < paddleX + paddleW + ballRadius){
            dx = -((paddleX + (paddleW / 2) - ballX) / (paddleW)) * 10;
            dy = -dy;
          } else if(ballY > getHeight(browserWidth)) {
            handleNextStepGameOver();
            return false;
          }
      } 

      if (is_leftPannel && paddleX > 0) {
        paddleX -= 10;
      }
      if (is_rightPannel && paddleX + paddleW < browserWidth) {
        paddleX += 10;
      }
    }
    anim = requestAnimationFrame(draw);
  }

  const drawPaddle = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
    ctx.beginPath();
    ctx.strokeStyle = '#d32f2f';
    ctx.fillStyle = '#ef9a9a';
    ctx.lineWidth = 3;
    ctx.rect(x, y, width, height);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  const drawBall = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
    var gradient = ctx.createRadialGradient(x - 2, y - 2, radius / 100, x, y, radius);
    gradient.addColorStop(0, '#fff');
    gradient.addColorStop(1, '#f44336');

    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
  }

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#212121' }}>
      <div style={{ width: `${width}px`, height: `${getHeight(width)}px`, position: 'relative'}}>
        {isGameStart && (
          <Cam width={width} height={getHeight(width)} isLeft={isLeft} />
        )}
        {/* <Cam width={width} height={getHeight(width)} isLeft={isLeft} /> */}
        <canvas id="breakOut" width={width} height={getHeight(width)} style={{ position: 'absolute', top: 0, left: 0 }}/>
        <Keyboard isLeft={isLeft} isRight={isRight} />
        {startCount !== 0 && (
          <div style={{ position: 'absolute', top: '24px', left: '50%', fontSize: '100px', color: '#aaa'}}>
            {startCount}
          </div>
        )}
      </div>
      
      {isUserName && <UserName onNextStepGameReady={handleNextStepGameReady} />}
      {isGameReady && <GameReady onNextStepGameStart={handleNextStepGameStart}/>}
      {isGameOver && <GameOver onNextStepPerceivedList={handleNextStepPerceivedList} />}
      {isPerceivedList && <PerceivedList onNextStepInit={handleNextStepInit}/>}

      <audio id="introSound" src={"/sound/intro.wav"} preload = "auto"></audio>
      <audio id="gameStartSound" src={"/sound/start.wav"} preload = "auto"></audio>
      {/* <audio id="backgroundSound" src={"/sound/background.wav"} preload = "auto" loop></audio> */}
      <audio id="leftKeySound" src={"/sound/left.wav"} preload = "auto"></audio>
      <audio id="rightKeySound" src={"/sound/right.wav"} preload = "auto"></audio>
      <audio id="gameOverSound" src={"/sound/over.wav"} preload = "auto"></audio>
      <audio id="skipSound" src={"/sound/skip.wav"} preload = "auto"></audio>

      <iframe src="/sound/intro.wav" allow="autoplay" style={{ display: 'none' }} id="introSound" />

    </div>
  )
} 

export default BreakOut;