import { World, Item, Wall, RLAgent, SensedObject, Point2D, Lidar, Radar } from 'learning-agents-model';

export class CanvasUtility {

  agentView: boolean = false;

  width: number;
  height: number;

  private defaultFillColor = "rgba(255, 255, 255, 0)";    // #464646 strong grey
  private defaultStrokeColor = "rgba(70, 70, 70, 1) 0.5px";    // #464646 strong grey

  private detectedNothingStrokeStyle = "rgba(192, 192, 192, 0.5)";  // #c4c4c4 light grey
  private detectedWallStrokeStyle = "rgba(70, 70, 70, 1)";   // #ff8000 strong orange
  private detectedItem1StrokeStyle = "rgba(0, 120, 0, 0.65)";  // #b30000 dark red
  private detectedItem2StrokeStyle = "rgba(179, 0, 0, 0.65)";  // #96ff96 grün
  private detectedItem3StrokeStyle = "rgba(0, 0, 180, 0.9)";  // #96ff96 grün

  private detectedNothingFillStyle = "rgba(215, 215, 215, 0.15)";  // #c4c4c4 light grey
  private detectedWallFillStyle = "rgba(70, 70, 70, 0.15)";   // #ff8000 strong orange
  private detectedItem1FillStyle = "rgba(0, 240, 0, 0.15)";  // #96ff96 grün
  private detectedItem2FillStyle = "rgba(240, 0, 0, 0.15)";  // #96ff96 grün
  private detectedItem3FillStyle = "rgba(0, 0, 240, 0.15)";  // #96ff96 grün

  private wallStrokeStyle = "rgba(70, 70, 70, 1)";  // #c4c4c4 light grey
  private item1FillStyle = "rgba(150, 255, 150, 1)";   // #ff9696 light red
  private item2FillStyle = "rgba(255, 150, 150, 1)";  // #96ff96 rot
  private identifierFillStyle = "rgba(230, 230, 230, 1)";
  private agentFillStyle = (r: number) => { return "rgb(" + r + ", 55, 55)" };

  ctx: CanvasRenderingContext2D;

  constructor(canvas: string, document: any, width: number, height: number) {
    this.ctx = document.getElementById(canvas).getContext("2d");
    this.width = width;
    this.height = height;
  }

  public draw(world: World): void {
    // reset canvas
    this.ctx.clearRect(0, 0, this.width, this.height);

    // draw agents
    // color agent based on reward it is experiencing at the moment
    let agents: RLAgent[] = world.agents;
    this.drawAgents(agents);

    // draw items
    let items: Item[] = world.items;
    this.drawItems(items);

    // draw walls in environment
    let walls: Wall[] = world.walls;
    this.drawWalls(walls);
  }

  private drawAgents(agents: RLAgent[]): void {
    for (const agent of agents) {
      this.drawAgentSensory(agent);
    }
    for (const [i, agent] of agents.entries()) {
      this.drawAgentBody(agent);
      this.drawAgentIdentifier(i + 1, agent);
    }
  }

  private drawAgentSensory(agent: RLAgent): void {
    for (const sensor of agent.sensory.sensors) {
      if (sensor.type === 0) {
        this.drawLidar(agent.location, sensor);
      } else if (sensor.type === 1) {
        this.drawRadar(sensor);
      }
    }
  }

  private drawLidar(p1: Point2D, sensor: Lidar): void {
    if (sensor.getSensedObject().type === -1) {
      this.ctx.strokeStyle = this.detectedNothingStrokeStyle;
      this.ctx.fillStyle = this.detectedNothingFillStyle;
    }
    else if (sensor.getSensedObject().type === 0) {
      this.ctx.strokeStyle = this.detectedWallStrokeStyle;
      this.ctx.fillStyle = this.detectedWallFillStyle;
    }
    else if (sensor.getSensedObject().type === 1) {
      this.ctx.strokeStyle = this.detectedItem1StrokeStyle;
      this.ctx.fillStyle = this.detectedItem1FillStyle;
    }
    else if (sensor.getSensedObject().type === 2) {
      this.ctx.strokeStyle = this.detectedItem2StrokeStyle;
      this.ctx.fillStyle = this.detectedItem2FillStyle;
    }
    else if (sensor.getSensedObject().type === 3) {
      this.ctx.strokeStyle = this.detectedItem3StrokeStyle;
      this.ctx.fillStyle = this.detectedItem3FillStyle;
    }

    const x1 = p1.x;
    const y1 = p1.y;
    const proximity = (sensor.getSensedObject().type === -1) ? sensor.maxRange : sensor.sensedObject.proximity;
    const x2 = p1.x + proximity * Math.sin(sensor.angle);
    const y2 = p1.y + proximity * Math.cos(sensor.angle);

    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }

  private drawRadar(sensor: Radar): any {
    if (sensor.getSensedObject().type === -1) {
      this.ctx.strokeStyle = this.detectedNothingStrokeStyle;
      this.ctx.fillStyle = this.detectedNothingFillStyle;
    }
    else if (sensor.getSensedObject().type === 0) {
      this.ctx.strokeStyle = this.detectedNothingStrokeStyle;
      this.ctx.fillStyle = this.detectedWallFillStyle;
    }
    else if (sensor.getSensedObject().type === 1) {
      this.ctx.strokeStyle = this.detectedNothingStrokeStyle;
      this.ctx.fillStyle = this.detectedItem1FillStyle;
    }
    else if (sensor.getSensedObject().type === 2) {
      this.ctx.strokeStyle = this.detectedNothingStrokeStyle;
      this.ctx.fillStyle = this.detectedItem2FillStyle;
    }
    else if (sensor.getSensedObject().type === 3) {
      this.ctx.strokeStyle = this.detectedNothingStrokeStyle;
      this.ctx.fillStyle = this.detectedItem3FillStyle;
    }

    const x0 = sensor.location.x;
    const y0 = sensor.location.y;
    const width = sensor.width;
    const height = sensor.height;

    this.ctx.fillRect(x0, y0, width, height);
    this.ctx.strokeRect(x0, y0, width, height);
  }

  private drawAgentBody(agent: RLAgent): void {
    this.ctx.strokeStyle = this.defaultStrokeColor;
    this.ctx.fillStyle = this.agentFillStyle(55);
    this.ctx.beginPath();
    this.ctx.arc(agent.location.x, agent.location.y, agent.size, 0, Math.PI * 2, true);
    this.ctx.fill();
    this.ctx.stroke();
  }

  private drawAgentIdentifier(id: number, agent: RLAgent) {
    this.ctx.fillStyle = this.identifierFillStyle;
    this.ctx.font = "12px Roboto";
    const offsetX = (id < 10) ? -3 : -7;
    const offsetY = 4;
    this.ctx.fillText(id.toString(), agent.location.x + offsetX, agent.location.y + offsetY);
  }

  private drawItems(items: Array<Item>): void {
    this.ctx.strokeStyle = this.defaultStrokeColor;
    if (!this.agentView) {
      for (const item of items) {
        if (item.type === 1) { this.ctx.fillStyle = this.item1FillStyle; }
        if (item.type === 2) { this.ctx.fillStyle = this.item2FillStyle; }
        this.ctx.beginPath();
        this.ctx.arc(item.location.x, item.location.y, item.size, 0, Math.PI * 2, true);
        this.ctx.fill();
        this.ctx.stroke();
      }
    }
  }

  private drawWalls(walls: Wall[]): void {
    this.ctx.strokeStyle = this.wallStrokeStyle;
    this.ctx.beginPath();
    for (const wall of walls) {
      this.ctx.lineWidth = 0.5;
      this.ctx.moveTo(wall.p1.x, wall.p1.y);
      this.ctx.lineTo(wall.p2.x, wall.p2.y);
    }
    this.ctx.stroke();
  }
}