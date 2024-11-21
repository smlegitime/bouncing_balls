/**
 * @fileoverview Main thread for Bouncing Balls program
 * @author Sybille Légitime
 * @copyright 2024 Bouncing Balls. All rights reserved
 */

import Victor from 'victor';
import './styles/main.css';
import WikiStream from 'worker-loader!./stream/wikiStream';

import { BallEnv } from './bball/ballEnv';
import { Ball } from './bball/ball';

// Constants declarations
const canvas: any = document.getElementById('main-canvas');
const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
const COUNTER_BOX_X: number = 10;
const COUNTER_BOX_Y: number = 5;
const COUNTER_BOX_WIDTH: number = 400;
const COUNTER_BOX_HEIGHT: number = 50
const BALL_RADIUS_LIMIT: number = 100;
const COUNTER_BOX_COLOR: string = 'black';

let pageCounter: number = 0;

const myBallEnv = new BallEnv(
  ctx, window.innerWidth, 
  window.innerHeight, COUNTER_BOX_X, 
  COUNTER_BOX_Y, COUNTER_BOX_COLOR, 
  COUNTER_BOX_WIDTH, COUNTER_BOX_HEIGHT, 
  pageCounter, []
);

// Retrieve information from worker thread. Create and update balls accordingly
const worker: WikiStream = new WikiStream();

worker.onerror = (error) => console.error(error); 

worker.onmessage = (event) => {
  pageCounter++;
  myBallEnv.wikiCounter = pageCounter;

  const ballColor = event.data.color;
  const wmObj = event.data.wikimediaObj;
  const wmNames = Object.keys(wmObj);
  const wmName = wmNames[wmNames.length - 1];

  if (ballColor) {
    const newBall = new Ball(ctx, 300, 200, 20, ballColor, 0, wmName, pageCounter);
    myBallEnv.addObject(newBall);
    newBall.addForce(new Victor(0.05, 0.03), 1000);
    newBall.addForce(new Victor(0.00, 0.18), 0);

    myBallEnv.wmDomainNames = {
      'name': wmName,
      'color': ballColor
    };
  } 
  else {
    // Increment ball radius by 2 for each Wiki page created under the same domain
    myBallEnv.balls.forEach(ball => {
      console.log(ball.ballName)
      if (ball.ballName == wmName && ball.ballRadius < BALL_RADIUS_LIMIT) ball.ballRadius = 2;
    });
  }
}


myBallEnv.startRendering();