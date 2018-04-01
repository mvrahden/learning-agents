import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { PretrainedComponent } from './pretrained/pretrained.component';
import { SimulationComponent } from './simulation/simulation.component';
import { ExplanationComponent } from './explanation/explanation.component';
import { DQNComponent } from './dqn-method/dqn-method.component';

const routes: Routes = [
  { path: '', redirectTo: '/#', pathMatch: 'full' },
  { path: 'pretrained', redirectTo: '/#', pathMatch: 'full' },
  { path: '', component: PretrainedComponent },
  { path: 'simulation', component: SimulationComponent },
  { path: 'explanation', component: ExplanationComponent },
  { path: 'about', component: AboutComponent },
  { path: 'dqn-method', component: DQNComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
