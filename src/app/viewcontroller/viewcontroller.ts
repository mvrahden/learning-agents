import { OnInit } from '@angular/core';

import { World } from 'learning-agents-model';

import { Stats } from './utils/stats.utility';
import { Chart } from './utils/chart.utility';
import { Canvas } from './utils/canvas.utility';

declare let $: any;
declare let window: any;
declare let document: any;
declare let setInterval: any;

export abstract class ViewController implements OnInit {
  
  // derived from globals
  
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
  stats: Stats;
  chart: Chart;
  canvas: Canvas;

  constructor() { }

  public ngOnInit(): void {
    this.init();
    this.initConcrete();

    this.start();
  }

  private init(): void {
    this.world = new World(this.width, this.height, this.maxAgents, this.maxItems);
    this.world.setBoundaryCondition('stable');
    this.stats = new Stats(this.world.getAgents(), this.world.getItems());
    this.canvas = new Canvas('simulation', document, this.width, this.height);
    this.chart = new Chart('reward-chart', document, $, this.stats);
    this.isPaused = false;
    this.isPausedDrawing = false;
    this.isPausedPlotting = false;
  }

  protected abstract initConcrete(): void;
  
  public start(): void {
    this.logStartMessage();
    this.isPaused = false;
    this.setSimulationInterval(this.simSpeedIndex);
    this.setEvaluationInterval();
  }

  protected logStartMessage() {
    console.log('[' + new Date().toISOString() + ']: Training of Agent is starting!'
      + '\nStarting training phase!'
      + '\nCurrent Timestamp: ' + new Date().getTime());
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
    this.stats.reset(this.world.getAgents(), this.world.getItems());
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
    this.stats.tick(
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