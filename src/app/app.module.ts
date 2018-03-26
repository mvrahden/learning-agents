import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { AppRoutingModule } from './app-routing.module';

import { NavigationComponent } from './navigation/navigation.component';
import { AboutComponent } from './about/about.component';
import { DQNComponent } from './dqn-method/dqn-method.component';
import { SimulationComponent } from './simulation/simulation.component';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    MatTabsModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    AppRoutingModule,
  ],
  declarations: [
    NavigationComponent,
    AboutComponent,
    DQNComponent,
    SimulationComponent
  ],
  providers: [],
  bootstrap: [NavigationComponent]
})
export class AppModule { }
