import { Component, OnInit } from '@angular/core';

import { World } from 'learning-agents-model';

import { ViewControl } from '../viewcontrol/viewcontrol';

declare let $: any;

@Component({
  selector: 'app-pretrained',
  templateUrl: './pretrained.component.html',
  styleUrls: ['./pretrained.component.css']
})
export class PretrainedComponent extends ViewControl {
  readonly baseUrl: string = "https://rawgit.com/mvrahden/learning-agents/master/src/app/pretrained/brains/agent-brain-state.";
  loadedBrainCounter: number = 0;
  isFullyLoaded = false;

  constructor() {
    super();
  }

  protected initConcrete(): void {
    this.loadedBrainCounter = 0;
    this.isFullyLoaded = false;
    this.switchAgentsToEvaluationMode();
    this.loadBrains();
  }

  private switchAgentsToEvaluationMode(): void {
    this.world.switchTrainingModeOfAgents(false);
  }

  private reload(): void {
    this.initConcrete();
  }

  private async loadBrains(): Promise<any> {
    for (let i = 0; i < this.maxAgents; i++) {
      const brain = this.queryBrain(i);
      const agent = this.world.agents[i];
    }
    return null;
  }

  private async queryBrain(id: number): Promise<any> {
    const request = this.getHttpRequestFor(id);
    
    const self = this;

    const promise = new Promise((resolve, reject) => {
      $.ajax(request).done((data) => {
        self.resolve(id, data);
      }).fail((jqxhr, textStatus, error) => {
        self.reject(id, jqxhr, textStatus, error);
      });
    })

    return promise;
  }

  private resolve(id: number, data: string): void {
    this.loadBrain(id, data);
    console.log("Brain of Agent " + (id + 1) + " loaded successfully!");
    this.registerLoading(id);
  }

  private loadBrain(id: number, brain: string): void {
    this.world.agents[id].load(brain);
  }

  private registerLoading(id: number): void {
    this.loadedBrainCounter++;
    if(this.loadedBrainCounter === this.world.agents.length) {
      this.isFullyLoaded = true;
    }
  }

  private reject(id: number, jqxhr: any, textStatus: string, error: string): void {
    console.log("Brain of Agent " + (id + 1) + " didn't load successfully!");
    console.log(textStatus + ", " + error);
  }

  private getHttpRequestFor(id: number): any {
    return {
      type: 'GET',
      dataType: 'json',
      async: true,
      url: this.getUrlFor(id),
      xhrFields: {
        withCredentials: false
      }
    };
  }

  private getUrlFor(id: number): string {
    return this.baseUrl + id + ".json";
  }

  protected handleEvaluationPeriodActivation(): void { }
}
