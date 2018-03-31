import { Component, OnInit } from '@angular/core';

import { World, WorldObject, Item, Wall, RLAgent } from 'learning-agents-model';

import { Specs } from './utils/specs.utility';
import { CollisionStats } from './utils/collision-stats.utility';
import { CanvasUtility } from './utils/canvas.utility';
import { Flot } from './utils/flot.charts';

declare let $: any;
declare let window: any;
declare let document: any;
declare let setInterval: any;

@Component({
  selector: 'app-pretrained',
  templateUrl: './pretrained.component.html',
  styleUrls: ['./pretrained.component.css']
})
export class PretrainedComponent implements OnInit {
  array: string[];
  // derived from globals
  canvas: any;
  
  // World and View
  world: World;
  width: number = 600;
  height: number = 600;
  maxAgents: number = 2;
  maxItems: number = 50;
  trainingPeriod: any = 2.5e6;
  
  // Simulation and Controls
  simSpeedIndex: number = 1;
  simBoostIntervals: Array<number> = [1, 1, 3, 3];
  simSpeedIntervals: Array<number> = [150, 41, 41, 41];
  iterationsPerTick: number;
  ticksPerSecond: number;
  simIntervalId: number;
  simEvaluationInterval: number = 500;
  simEvaluationIntervalId: number;
  isPaused: boolean;
  isPausedDrawing: boolean;
  isPausedPlotting: boolean;
  valueAlternationTick: number = 0;
  simValueAlternationIntervalId: number;

  // Evaluation Utils
  specs: Array<Specs>;
  collisionStats: CollisionStats;
  chart: Flot;

  constructor() {
  }

  public ngOnInit(): void {
    this.init();
  }

  private init(): void {
    this.world = new World(this.width, this.height, this.maxAgents, this.maxItems, this.trainingPeriod);
    this.world.setBoundaryCondition('stable');
    this.specs = new Array<Specs>();
    for (const [i, agent] of this.world.agents.entries()) {
      this.specs.push(new Specs(i + 1, agent));
    }
    this.collisionStats = new CollisionStats(this.world.getAgents(), this.world.getItems());
    this.canvas = new CanvasUtility('simulation', document, this.width, this.height);
    this.chart = new Flot('reward-chart', document, $, this.collisionStats);
    this.isPaused = false;
    this.isPausedDrawing = false;
    this.isPausedPlotting = false;

    this.start();
    this.array = [];
  }

  private draw(): void {
    this.canvas.draw(this.world);
  }

  public start(): void {
    console.log('[' + new Date().toISOString() + ']: Training of Agent is starting!'
      + '\nStarting training phase!'
      + '\nCurrent Timestamp: ' + new Date().getTime())
    this.isPaused = false;
    this.setSimulationInterval(this.simSpeedIndex);
    this.setEvaluationInterval();
  }

  public pause(): void {
    this.isPaused = true;
    this.setSimulationInterval(this.simSpeedIndex);
    this.setEvaluationInterval();
  }

  public pauseDrawing(): void {
    this.isPausedDrawing = !this.isPausedDrawing;
  }

  public pausePlotting(): void {
    this.isPausedPlotting = !this.isPausedPlotting;
    this.setEvaluationInterval();
  }

  public reset(): void {
    this.world.reset();
    this.collisionStats.reset(this.world.getAgents(), this.world.getItems());
    this.chart.reset();
    this.start();
  }

  public goMax(): void {
    this.setSimulationInterval(3);
  }

  public goFast(): void {
    this.setSimulationInterval(2);
  }

  public goNormal(): void {
    this.setSimulationInterval(1);
  }

  public goSlow(): void {
    this.setSimulationInterval(0);
  }

  private setSimulationInterval(simSpeed: number = 1): void {
    window.clearInterval(this.simIntervalId);
    this.setSimulationParameters(simSpeed);
    if (!this.isPaused) {
      const self = this;
      const func = function () {
        self.tick();
      };
      this.simIntervalId = setInterval(func, this.simSpeedIntervals[simSpeed]);
    }
  }

  private setSimulationParameters(simSpeed: number): void {
    this.simSpeedIndex = simSpeed;
    this.iterationsPerTick = Math.pow(this.simBoostIntervals[simSpeed], this.simSpeedIndex);  // boost by the power of simSpeedIndex
    this.ticksPerSecond = Math.floor(1000 / this.simSpeedIntervals[this.simSpeedIndex] * this.iterationsPerTick);
  }

  private tick(): void {
    for (let i = 0; i < this.iterationsPerTick; i++) {
      if (this.world.clock() === this.trainingPeriod) {
        // when trainings period is over, set value alternation intervall
        this.activateCurrentTestSetup();
        console.log('[' + new Date().toISOString() + ']: Training of Agent is done!'
          + '\nStarting evaluation phase with the chosen setup!'
          + '\nCurrent Timestamp: ' + new Date().getTime());
      }
      this.tickSimulationLogic();
    }
  }

  private activateCurrentTestSetup() {
    this.setValueAlternationInterval(); // deactivate on static valuation
    this.world.setBoundaryCondition('scarce'); // other option: 'scarce'
  }

  private tickSimulationLogic(): void {
    this.world.tick();
    this.collisionStats.tick(
      this.world.clock(),
      this.world.getAgents(),
      this.world.getItems(),
      this.ticksPerSecond);
    if (this.shouldUpdateCanvas()) { this.draw(); }
  }

  /**
   * Draw at speeds:
   * - below FAST -> regularly
   * - at FAST -> every 5th step
   * - at MAX -> every 2nd step
   */
  private shouldUpdateCanvas(): boolean {
    return !this.isPausedDrawing;
  }

  /**
   * This Method has its own Update Interval independent of the simulation.
   */
  private updateChart(): void {
    this.chart.plot(this.world.getAgents().length);
  }

  private setEvaluationInterval(milliseconds: number = 1000): void {
    window.clearInterval(this.simEvaluationIntervalId);

    if (!this.isPausedPlotting) {
      const self = this;
      const func = function () {
        self.updateChart();
      };
      this.simEvaluationIntervalId = setInterval(func, milliseconds);
    }
  }

  public logEvaluation() {
    this.logSpecs();
    this.logCollisionHistory();
    this.logItemChangeHistory();
    this.logAgentBrainState();
  }

  private logSpecs() {
    let body = JSON.stringify(this.specs);

    $.post('http://localhost:8000/log/specs', { data: body }, (res) => {
      console.log(res);
    });

  }

  private logCollisionHistory(): void {
    for (const i of this.collisionStats.collisionHistory.keys()) {
      let data = {};
      data['agentId'] = i.toString();
      data['collisionHistory'] = JSON.stringify(this.collisionStats.collisionHistory[i]);

      let body = JSON.stringify(data);

      $.post('http://localhost:8000/log/collision-history/', { data: body }, (res) => {
        console.log(res);
      });
    }
  }

  private logItemChangeHistory(): void {
    let data = {};
    data['itemChangeHistory'] = JSON.stringify(this.collisionStats.itemChangeHistory);

    let body = JSON.stringify(data);

    $.post('http://localhost:8000/log/item-history/', { data: body }, (res) => {
      console.log(res);
    });
  }

  private logAgentBrainState(): void {
    for (const [i, agent] of this.world.getAgents().entries()) {
      let data = {};
      data['agentId'] = i.toString();
      data['brainState'] = JSON.stringify(agent.brain.toJSON());

      let body = JSON.stringify(data);

      $.post('http://localhost:8000/log/agent-brain-state/', { data: body }, (res) => {
        console.log(res);
      });
    }
  }

  private alternateValues() {
    if(this.world.clock() > this.trainingPeriod) {
      this.valueAlternationTick++;
      let values = [-1, -1, 1, -1];
      if (this.valueAlternationTick % 2 === 0) { values = [-1, 1, -1, -1]; }
  
      WorldObject.setValues(values);
    }

  }

  setValueAlternationInterval(milliseconds: number = 4630 * 1000): any { // ca. 1.000.000 iterations
    window.clearInterval(this.simValueAlternationIntervalId);

    if(!this.isPaused) {
      const self = this;
      const func = function () {
        self.alternateValues();
        const item0ofAgent0 = self.world.getAgents()[0].sensory.totalItem0Collisions
        const item1ofAgent0 = self.world.getAgents()[0].sensory.totalItem1Collisions
        const item0ofAgent1 = self.world.getAgents()[1].sensory.totalItem0Collisions
        const item1ofAgent1 = self.world.getAgents()[1].sensory.totalItem1Collisions
        console.log('[' + new Date().toISOString() + ']: Values: ' + WorldObject.getValues() + '\t');
        console.log('[' + new Date().toISOString() + ']: Agent 1: ' + item0ofAgent0 + ' vs. ' + item1ofAgent0);
        console.log('[' + new Date().toISOString() + ']: Agent 2: ' + item0ofAgent1 + ' vs. ' + item1ofAgent1);
      };
      this.simValueAlternationIntervalId = setInterval(func, milliseconds);
    }
  }
}
