# Avoiding Agents

## Rewards

#### Collision-based Rewards

* Items: Single Reward on Collision (`+1` or `-1`)

#### Detection-based Rewards

* Agents: Cumulative linear increasing Punishment based on Distance (`0` to `-1`)
* Walls: Distinctive exponential increasing Punishment based on Distance (`0` to `-1`)

## Limitations

#### Conceptual Limitations: Exploration and Learning

- Exploration-based inefficiency: Fixed Epsilon limits the agents ability to exploit optimal strategies when reached an optimal solution space.
- Missing feature *wisdom of old age*: Continuous learning doesn't let the agent get immune to false signals.

#### Implementational Limitations: Rewards

- Due to identity-less environment scanning the detection-based Rewards are doomed to be either cumulative over all sensor-detections e.g. on detection of other agents or distinctive based on the rewards value.
  - Solution: Give `WorldObjects` an identity and memorize the identity on detection in `SensedObject`.
