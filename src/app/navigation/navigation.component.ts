import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  links = [{
      label: 'Pre-Trained',
      route: '/pretrained'
    }, {
      label: 'Simulation',
      route: '/simulation'
    }, {
      label: 'Explanation',
      route: '/explanation'
    }, {
      label: 'DQN-Method',
      route: '/dqn-method'
    }, {
      label: 'About',
      route: '/about'
      }
    ];
}
