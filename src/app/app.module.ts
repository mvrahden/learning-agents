import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';

import { NavigationComponent } from './navigation/navigation.component';
import { AboutComponent } from './about/about.component';
import { PretrainedComponent } from './pretrained/pretrained.component';
import { SimulationComponent } from './simulation/simulation.component';
import { ExplanationComponent } from './explanation/explanation.component';
import { DQNComponent } from './dqn-method/dqn-method.component';


@NgModule({
  imports: [
    BrowserModule,
    MatToolbarModule,
    MatCardModule,
    MatGridListModule,
    MatExpansionModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatTooltipModule,
    NoopAnimationsModule,
    AppRoutingModule,
  ],
  declarations: [
    NavigationComponent,
    AboutComponent,
    PretrainedComponent,
    SimulationComponent,
    ExplanationComponent,
    DQNComponent
  ],
  providers: [],
  bootstrap: [NavigationComponent]
})
export class AppModule { }
