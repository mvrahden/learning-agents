# Learning Agents

The content of this repository can be viewed on its [GitHub page](https://mvrahden.github.io/learning-agents).
It is shown an environment which is an extended version of the "Waterworld" example of the Stanford University CS group - more specific by Andrej Karpathy.
You'll find multiple pages, each with different content.

- **Pre-Trained**: This page shows two agents which were trained in a simulation run.
- **Simulation**: The simulation environment offers the ability to run individual simulations.
- **Explanation**: This page offers explanatory content regarding the logics and technical background of the simulation.
- **DQN-Method**: This page offers even more insight into how the agents inference mechanism, namely the DQN-Method, is implemented.
- **About**: This page offers an overview of the Dependencies of this project.

The content of this Website is for educational purposes only.

## Local Installation

To run the code on a local machine please follow the listed steps:

### Pre-Setup

1. Install NodeJS, NPM (ships with NodeJS) & git (if not done yet)
  - please follow the steps on their respictive website [node, npm](https://www.nodejs.org) & [git](https://git-scm.com/) or in any given Web-Tutorial

2. Install Typescript & Angular CLI as global dependencies
  - please follow the following steps in your command line (or the steps on their respective websites)

```
npm install -g typescript @angular/cli
```

### Actual Installation

3. In your command line change into a target directory and clone the code via `git` into this directory

```
git clone https://github.com/mvrahden/learning-agents.git
```

4. Change into the newly created directory `cd learning-agents`
5. Install all project related dependencies via `npm install`
6. Run the code via the Angular CLI `ng serve --open`
  - this should open a new tab in your configured web browser

### Update the GitHub Page

1. `ng build` the current code base.
2. replace the compiled JavaScript bundles from the `./docs` directory with the created ones from the `./dist` directory. 
3. in case of modified `assets`, also move those assets into the `./docs/assets` directory.
4. delete the `./dist` directory again
5. `git commit` and `git push`

## Dependencies

1. [Learning Agents](https://github.com/mvrahden/learning-agents): Implementation of the Simulation Flow Control and the Frontend View
2. [Learning Agents Model](https://github.com/mvrahden/learning-agents-model): Implementation of the Entities involved in the Simulation
3. [reinforce-js](https://github.com/mvrahden/reinforce-js): Implementation of the DQN-Solver (also available via [NPM](https://www.npmjs.com/package/reinforce-js))
4. [recurrent-js](https://github.com/mvrahden/recurrent-js): Implementation of neural networks graph model and matrix operations (also available via [NPM](https://www.npmjs.com/package/recurrent-js))
5. [Angular](https://angular.io): Mobile & Desktop Frontend Framework
6. [Angular Material](https://material.angular.io): Material Design Components for the Angular Frontend Framework

## License

As of License-File: [MIT](LICENSE)