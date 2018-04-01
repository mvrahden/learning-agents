import { OnInit } from '@angular/core';

import { World } from 'learning-agents-model';

import { Specs } from './utils/specs.utility';
import { CollisionStats } from './utils/collision-stats.utility';
import { CanvasUtility } from './utils/canvas.utility';
import { Flot } from './utils/flot.charts';

declare let $: any;
declare let window: any;
declare let document: any;
declare let setInterval: any;

export abstract class ViewControl implements OnInit {
  
  // derived from globals
  canvas: any;
  
  // World and View
  world: World;
  width: number = 600;
  height: number = 600;
  maxAgents: number = 2;
  maxItems: number = 50;

  // Simulation and Controls
  simSpeedIndex: number = 1;
  simBoostIntervals: Array<number> = [1, 1, 3, 3];
  simSpeedIntervals: Array<number> = [150, 41, 41, 41];
  isPaused: boolean;
  isPausedDrawing: boolean;
  isPausedPlotting: boolean;
  iterationsPerTick: number;
  ticksPerSecond: number;
  simIntervalId: number;
  simEvaluationIntervalId: number;

  // Evaluation Utils
  specs: Array<Specs>;
  collisionStats: CollisionStats;
  chart: Flot;

  constructor() { }

  public ngOnInit(): void {
    this.init();
    this.initConcrete();

    this.start();
  }

  private init(): void {
    this.world = new World(this.width, this.height, this.maxAgents, this.maxItems);
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
  }

  protected abstract initConcrete(): void;
  
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

  private tick(): void {
    for (let i = 0; i < this.iterationsPerTick; i++) {
      this.handleEvaluationPeriodActivation();
      this.tickSimulationLogic();
    }
  }

  protected abstract handleEvaluationPeriodActivation(): void;

  private tickSimulationLogic(): void {
    this.world.tick();
    this.collisionStats.tick(
      this.world.clock(),
      this.world.getAgents(),
      this.world.getItems(),
      this.ticksPerSecond);
    if (this.shouldUpdateCanvas()) { this.draw(); }
  }

  private draw(): void {
    this.canvas.draw(this.world);
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
}