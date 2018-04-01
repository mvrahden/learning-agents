import { Component, OnInit } from '@angular/core';

import { World } from 'learning-agents-model';

import { ViewControl } from '../viewcontrol/viewcontrol';

@Component({
  selector: 'app-pretrained',
  templateUrl: './pretrained.component.html',
  styleUrls: ['./pretrained.component.css']
})
export class PretrainedComponent extends ViewControl {
  constructor() {
    super();
  }

  protected initConcrete(): void {
    // LOAD BRAIN
  }

  protected handleEvaluationPeriodActivation(): void { }
}
