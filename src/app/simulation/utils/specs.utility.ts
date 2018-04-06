import { RLAgent } from 'learning-agents-model';

export class Specs {
  id: number;
  alpha: number;
  epsilon: number;
  gamma: number;
  experienceSize: number;
  experienceAddEvery: number;
  learningStepsPerIteration: number;
  tdErrorClamp: number;
  numHiddenUnits: number;

  constructor(id: number, agent: RLAgent) {
    this.id = id;
    this.alpha = agent.getOpt().get('alpha');
    this.epsilon = agent.getOpt().get('epsilon');
    this.gamma = agent.getOpt().get('gamma');
    this.experienceSize = agent.getOpt().get('experienceSize');
    this.experienceAddEvery = agent.getOpt().get('experienceAddEvery');
    this.learningStepsPerIteration = agent.getOpt().get('learningStepsPerIteration');
    this.tdErrorClamp = agent.getOpt().get('tdErrorClamp');
    this.numHiddenUnits = agent.getOpt().get('numHiddenUnits');
  }
}
