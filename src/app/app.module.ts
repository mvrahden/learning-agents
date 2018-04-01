import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { AppRoutingModule } from './app-routing.module';

import { NavigationComponent } from './navigation/navigation.component';
import { AboutComponent } from './about/about.component';
import { PretrainedComponent } from './pretrained/pretrained.component';
import { SimulationComponent } from './simulation/simulation.component';
import { DQNComponent } from './dqn-method/dqn-method.component';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    AppRoutingModule,
  ],
  declarations: [
    NavigationComponent,
    AboutComponent,
    PretrainedComponent,
    SimulationComponent,
    DQNComponent
  ],
  providers: [],
  bootstrap: [NavigationComponent]
})
export class AppModule { }
