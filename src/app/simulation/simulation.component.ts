import { Component, OnInit } from '@angular/core';

import { WorldObject } from 'learning-agents-model';

import { ViewControl } from '../viewcontrol/viewcontrol';

declare let setInterval: any;

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.css']
})
export class SimulationComponent extends ViewControl {

  trainingPeriod: any = 2.5e6;
  
  // Simulation and Controls
  valueAlternationTick: number = 0;
  simValueAlternationIntervalId: number;
  
  constructor() {
    super();
  }
  
  protected initConcrete(): void { }

  protected handleEvaluationPeriodActivation(): void {
    if (this.world.clock() === this.trainingPeriod) {
      // when trainings period is over, set value alternation intervall
      this.switchAgentsToEvaluationMode();
      this.activateCurrentEnvironmentSetup();
      console.log('[' + new Date().toISOString() + ']: Training of Agent is done!'
        + '\nStarting evaluation phase with the chosen setup!'
        + '\nCurrent Timestamp: ' + new Date().getTime());
    }
  }
  
  private switchAgentsToEvaluationMode(): void {
    this.world.switchTrainingModeOfAgents(false);
  }

  private activateCurrentEnvironmentSetup(): void {
    // this.setValueAlternationInterval(); // uncomment this for changing valuations
    this.world.setBoundaryCondition('scarce'); // options: 'stable' or 'scarce'
  }


  public logEvaluation(): void {
    this.logSpecs();
    this.logCollisionHistory();
    this.logItemChangeHistory();
    this.logAgentBrainState();
  }

  private logSpecs(): void {
    console.log("Specs-Log: ");
    console.log(JSON.stringify(this.specs));
  }

  private logCollisionHistory(): void {
    console.log("Rewards History-Log [logging per Second]: ");
    console.log("[timestamp, item-0-collisions, item-1-collisions, wall-detection-reward, agent-detection-reward]");
    
    for (const i of this.stats.rewardHistory.keys()) {
      let data = {};
      data['agentId'] = i.toString();
      data['rewardHistory'] = JSON.stringify(this.stats.rewardHistory[i]);
      
      console.log(JSON.stringify(data));
    }
  }

  private logItemChangeHistory(): void {
    console.log("Item Change History-Log [logging per Second]: ");
    console.log("[timestamp, total-items, amount-item-0, amount-item-1]");

    let data = {};
    data['itemChangeHistory'] = JSON.stringify(this.stats.itemChangeHistory);
    
    console.log(JSON.stringify(data));
  }

  private logAgentBrainState(): void {
    console.log("Agent Brains-Log: ");
    for (const [i, agent] of this.world.getAgents().entries()) {
      let data = {};
      data['agentId'] = i.toString();
      data['brainState'] = JSON.stringify(agent.brain.toJSON());

      console.log(JSON.stringify(data));
    }
  }

  private setValueAlternationInterval(milliseconds: number = 4630 * 1000): void { // ca. 1.000.000 iterations
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

  private alternateValues(): void {
    if (this.world.clock() > this.trainingPeriod) {
      this.valueAlternationTick++;
      let values = [-1, -1, 1, -1];
      if (this.valueAlternationTick % 2 === 0) { values = [-1, 1, -1, -1]; }

      WorldObject.setValues(values);
    }

  }
}
