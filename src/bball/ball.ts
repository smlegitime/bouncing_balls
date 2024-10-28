/**
 * Description: Ball class
 * @author Sybille Légitime, modified Oct 25, 2024
 */

import Victor from 'victor';

export class Ball {
  type: string;
  context: CanvasRenderingContext2D;
  x: number;
  y: number;
  velocity: Victor;
  acceleration: Victor;
  appliedForces: Array<Victor>;
  radius: number;
  color: string;
  frameRate: number;
  name: string;
  pageCounter: number;

  constructor(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    color: string,
    frameRate: number,
    name: string,
    pageCounter: number
  ) {
    this.type = 'ball';
    this.context = context;
    this.x = x;
    this.y = y;
    this.velocity = new Victor(0, 0);
    this.acceleration = new Victor(0, 0);
    this.appliedForces = [];
    this.radius = radius;
    this.color = color;
    this.frameRate = frameRate;
    this.name = name;
    this.pageCounter = pageCounter;
  }

  /**
   * Ball radius getter and setter
   */
  get ballRadius(): number {
    return this.radius;
  }
  set ballRadius(value: number) {
    this.radius = this.radius + value;
  }

  /**
   * Ball name getter
   */
  get ballName(): string {
    return this.name;
  }

  /**
   * Render text on the canvas
   * @param ctx 
   * @param text 
   */
  private renderText(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    font: string, 
    text: string,
  ): void {
      // Set font properties
      ctx.font = font;
      ctx.fillStyle = "white";

      // Draw the text
      ctx.fillText(text, x, y); 
  }

  /**
   * Remove parameter value from the applied forces list
   * @param force 
   */
  private removeForce(force: Victor) {
    const force_index = this.appliedForces.indexOf(force);
    if (force_index > -1) this.appliedForces.splice(force_index, 1);
  }

  /**
   * Draw a ball and print ball name
   */
  public render(): void {
    // Draw circle
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.radius, 0, 360, false);
    this.context.fillStyle = this.color;
    this.context.fill();
    this.context.strokeStyle = 'white';
    this.context.stroke();

    // Render wikimedia database name on circle
    this.renderText(
      this.context, 
      this.x, 
      this.y,
      '30px Arial', 
      this.ballName
    )
  }

  /**
   * Apply force to ball. Decelerate over time
   * @param force
   * @param duration
   * @returns
   */
  public addForce(force: Victor, duration: number) {
    this.appliedForces.push(force);
    if (duration == 0) return;

    setTimeout(() => {
      this.removeForce(force);
      this.acceleration.subtract(
        force.multiply(new Victor(duration / 1000, duration / 1000)),
      );
    }, duration);
  }

  // *********** COLLISION DETECTION ***********

  /**
   * Check for ball-ball collisions
   * @param ball 
   */
  private collidesWithBall(ball: Ball): boolean {
    if (ball != this && ball.type == 'ball'){
        let distanceX = Math.abs(ball.x - this.x);
        let distanceY = Math.abs(ball.y - this.y);
        let distance = distanceX + distanceY;
        
        return distance < (this.radius + ball.radius);
    }
    return false;
  }

  /**
   * Check for ball collision with ball environment borders and update velocity
   * @param screenWidth 
   * @param screenHeight 
   */
  private collidesWithWall(screenWidth: number, screenHeight: number) {
    if(this.x - this.radius < 0) {
        this.x = this.radius;
        this.velocity.invertX();
    }
    else if (this.y - this.radius < 0) {
        this.y = this.radius;
        this.velocity.invertY();
    }
    else if (this.x + this.radius > screenWidth) {
        this.x = screenWidth - this.radius;
        this.velocity.invertX();
    }
    else if (this.y + this.radius > screenHeight) {
        this.y = screenHeight - this.radius;
        this.velocity.invertY();
    }
  }

  // *********** COLLISION RESPONSE ***********

  /**
   * Update ball directions following collision
   * @param ball 
   * @returns 
   */
  private adjustPositions(ball: Ball): void {
    let betweenLinesVector = new Victor(ball.x - this.x, ball.y - this.y);
    betweenLinesVector.norm().multiply(new Victor(this.radius + ball.radius, this.radius + ball.radius));
    ball.x = this.x + betweenLinesVector.toObject().x;
    ball.y = this.y + betweenLinesVector.toObject().y;
    
    return
  }

  /**
   * Switch ball velocities following collision
   * @param ball 
   */
  private updateVelocities(ball: Ball): void {
    const otherBallVelocity = ball.velocity;
    const thisBallVelocity = this.velocity;
    ball.velocity = thisBallVelocity;
    this.velocity = otherBallVelocity;
  }

  /**
   * Update the ball's position based on aplied force
   */
  public step(): void {
    let finalForce = new Victor(0,0);
    this.appliedForces.forEach(force => {
        if (!force) return;
        finalForce.add(force);
    });
    this.acceleration = finalForce;
    this.velocity.add(this.acceleration);
    this.x += this.velocity.toObject().x;
    this.y += this.velocity.toObject().y;
  }

  /**
   * Make ball-ball collision checks and updates
   * @param objectList 
   */
  public checkCollisionFromList(objectList: Array<Ball>): void {
    this.collidesWithWall(this.context.canvas.width, this.context.canvas.height);
    objectList.forEach(object => {
        if(this.collidesWithBall(object)) {
            this.adjustPositions(object);
            this.updateVelocities(object);
        }
    });
  }
}
