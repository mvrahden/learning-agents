import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { SimulationComponent } from './simulation/simulation.component';
import { DQNComponent } from './dqn-method/dqn-method.component';

const routes: Routes = [
  { path: '', redirectTo: '/#', pathMatch: 'full' },
  { path: 'simulation', redirectTo: '/#', pathMatch: 'full' },
  { path: '', component: SimulationComponent },
  { path: 'about', component: AboutComponent },
  { path: 'dqn-method', component: DQNComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
