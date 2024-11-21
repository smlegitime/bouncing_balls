/**
 * @fileoverview Screen for bouncing balls
 * @author Sybille Légitime
 * @copyright 2024 Bouncing Balls. All rights reserved
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
  wikiMediaDomainNames: any[];

  constructor(
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    counterBoxX: number,
    counterBoxY: number,
    counterBoxColor: string,
    counterBoxWidth: number,
    counterBoxHeight: number,
    counter: number,
    wikiMediaDomainNames: any[],
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
    this.wikiMediaDomainNames = wikiMediaDomainNames;
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
    return this.counter;
  }
  set wikiCounter(value: number) {
    this.counter = value;
  }

  /**
  * Getter and setter for the wiki domain name
  */
  get wmDomainNames(): any[] {
    return this.wikiMediaDomainNames;
  }
  set wmDomainNames(value: any) {
    this.wikiMediaDomainNames.push(value);
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
      this.renderWikiList();
    }, 0);
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
    color: string,
    text: string,
  ): void {
      // Set font properties
      ctx.font = font;
      ctx.fillStyle = color;

      // Draw the text
      ctx.fillText(text, x, y); 
  }

  /**
   * Render the number of newly created wikimedia pages names to the screen
   */
  private renderWikiCounter(): void {
    // Draw rectangle
    this.context.beginPath();
    this.context.rect(
      this.counterBoxX, this.counterBoxY, 
      this.counterBoxWidth, this.counterBoxHeight
    );
    this.context.fillStyle = this.counterBoxColor;
    this.context.fill();

    this.renderText(
      this.context,
      this.COUNTER_TEXT_X,
      this.COUNTER_TEXT_Y,
      '30px Jost',
      'white',
      `Total # of new pages: ${this.counter}`
    );
  }

  /**
   * Render the list of wikimedia domain names with newly created pages to the screen
   */
  private renderWikiList(): void {
    let wikiDomainNameY = 40;
    this.wikiMediaDomainNames.forEach(domainNameObj => {
      wikiDomainNameY += 40;
      this.renderText(
        this.context,
        this.COUNTER_TEXT_X,
        wikiDomainNameY,
        '30px Jost',
        domainNameObj['color'],
        domainNameObj['name']
      );
    })
  }
}
