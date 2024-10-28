/**
 * Description: Screen for bouncing balls
 * @author Sybille Légitime, modified Oct 28, 2024
 */

export class BallEnv {

  readonly COUNTER_TEXT_X: number = 20;
  readonly COUNTER_TEXT_Y: number = 40;

  context: CanvasRenderingContext2D;
  objects: any[];
  width: number;
  height: number;
  counterBoxX: number;
  counterBoxY: number;
  counterBoxColor: string;
  counterBoxWidth: number;
  counterBoxHeight: number;
  counter: number;

  constructor(
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    counterBoxX: number,
    counterBoxY: number,
    counterBoxColor: string,
    counterBoxWidth: number,
    counterBoxHeight: number,
    counter: number
  ) {
    this.context = context;
    this.objects = [];
    this.width = width;
    this.height = height;
    this.counterBoxX = counterBoxX;
    this.counterBoxY = counterBoxY;
    this.counterBoxColor = counterBoxColor;
    this.counterBoxWidth = counterBoxWidth;
    this.counterBoxHeight = counterBoxHeight;
    this.counter = counter;
  }

  /**
   * Returns all the balls in the ball environment
   */
  get balls(): any[] {
    return this.objects;
  }

  /**
   * Getter and setter for the wiki counter
   */
  get wikiCounter(): number {
    return this.counter
  }
  set wikiCounter(value: number) {
    this.counter = value;
  }

  /**
   * Render objects in the ball environment
   */
  private renderObjects() {
    this.objects.forEach(object => object.render());
  }

  /**
   * Updates the size of the screen
   */
  private updateSize(): void {
    this.width = this.context.canvas.width;
    this.height = this.context.canvas.height;
  }

  /**
   * Clears the balls off the screen
   */
  private clear(): void {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  private renderWikiCounter(): void {
    // Draw rectangle
    this.context.beginPath();
    this.context.rect(
      this.counterBoxX, this.counterBoxY, 
      this.counterBoxWidth, this.counterBoxHeight
    );
    this.context.fillStyle = this.counterBoxColor;
    this.context.fill();

    // Set font properties
    this.context.font = '30px Jost';
    this.context.fillStyle = "white";

    // Draw the text
    this.context.fillText(
      `Total # of new pages: ${this.counter}`, 
      this.COUNTER_TEXT_X, 
      this.COUNTER_TEXT_Y
    ); 
  }

  /**
   * Add object to objects array
   * @param object
   */
  public addObject(object: object): void {
    this.objects.push(object);
  }

  /**
   * Renders the balls in the environment
   */
  public startRendering() {
    setInterval(() => {
      this.updateSize();
      this.clear();
      this.objects.forEach(object => {
        object.step();
        object.checkCollisionFromList(this.objects);
      });
      this.renderWikiCounter();
      this.renderObjects();
    }, 0);
  }
}
