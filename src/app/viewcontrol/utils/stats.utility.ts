import { RLAgent, Item } from 'learning-agents-model';

import { Rewards } from './rewards.utility';

export class Stats {

  public rewards: Array<Rewards>;
  public rewardHistory: Array<Array<Array<number>>>;
  public itemChange: Array<number>;
  public itemChangeHistory: Array<Array<number>>;
  public historicalDataTick: number;

  constructor(agents: Array<RLAgent>, items: Array<Item>) {
    this.init(agents, items);
  }

  private init(agents: Array<RLAgent>, items: Array<Item>): void {
    this.resetRewardRecords(agents);
    this.resetItemChangeRecord();
    const currentSecond = this.getTimestamp();
    this.initCollisionHistory(agents, currentSecond);
    this.initItemChangeHistory(items, currentSecond);
    this.historicalDataTick = 1;
  }

  private resetItemChangeRecord(): void {
    this.itemChange = [0, 0, 0];
  }

  private initItemChangeHistory(items: Array<Item>, currentSecond: number): void {
    this.itemChangeHistory = new Array<Array<number>>();
    const [item0, item1] = this.getItemCounts(items);
    this.itemChangeHistory.push([currentSecond, items.length, item0, item1]);
  }

  private getItemCounts(items: Array<Item>): [number, number] {
    let item0 = 0;
    let item1 = 0;
    for (const item of items) {
      if (item.type === 1) { item0++; }
      else if (item.type === 2) { item1++; }
    }
    return [item0, item1];
  }

  private initCollisionHistory(agents: any[], currentSecond: number): void {
    this.rewardHistory = new Array<Array<Array<number>>>();
    for (const id of agents.keys()) {
      this.rewardHistory.push([[currentSecond, 0, 0, 0, 0]]);
    }
  }

  public reset(agents: Array<RLAgent>, items: Array<Item>): void {
    this.init(agents, items);
  }

  public tick(worldClock: number, agents: Array<RLAgent>, items: Array<Item>, ticksPerSecond: number): void {
    this.logRewards(agents);
    this.logItemChange(items);

    const timestamp = this.getTimestamp();
    this.logRewardHistory(worldClock, timestamp, agents, ticksPerSecond);
    this.logItemHistory(worldClock, timestamp, items, ticksPerSecond);
    this.historicalDataTick++;
  }

  private logRewards(agents: Array<RLAgent>): void {
    for (const [i, agent] of agents.entries()) {
      this.recordAgentRewards(i, agent);
    }
  }

  private logItemChange(items: Array<Item>): void {
    const [item0, item1] = this.getItemCounts(items);
    this.itemChange[0] += items.length;
    this.itemChange[1] += item0;
    this.itemChange[2] += item1;
  }

  private recordAgentRewards(id: number, agent: RLAgent): void {
    this.rewards[id].totalItem0Collisions = agent.sensory.totalItem0Collisions;
    this.rewards[id].totalItem1Collisions = agent.sensory.totalItem1Collisions;

    this.rewards[id].item0Collisions += agent.sensory.item0CollisionsPerTick;
    this.rewards[id].item1Collisions += agent.sensory.item1CollisionsPerTick;
    this.rewards[id].wallDetectionReward += agent.sensory.wallDetectionRewardPerTick;
    this.rewards[id].agentDetectionReward += agent.sensory.agentDetectionRewardPerTick;
  }

  private logRewardHistory(worldClock: number, timestamp: number, agents: Array<RLAgent>, ticksPerSecond: number): void {
    if (worldClock % ticksPerSecond === 0) {
      for (const id of agents.keys()) {
        this.recordAgentsRewardHistory(id, timestamp, ticksPerSecond);
      }
      this.resetRewardRecords(agents);
    }
  }

  private getTimestamp(): number {
    return new Date().getTime();
  }

  private recordAgentsRewardHistory(id: number, timestamp: number, ticksPerSecond: number) {
    this.rewardHistory[id].push(
      [timestamp,
        this.rewards[id].item0Collisions,
        this.rewards[id].item1Collisions,
        this.rewards[id].wallDetectionReward,
        this.rewards[id].agentDetectionReward]
    );
  }

  private resetRewardRecords(agents: Array<RLAgent>) {
    this.rewards = new Array<Rewards>(agents.length);
    for (const [id, agent] of agents.entries()) {
      this.rewards[id] = new Rewards(agent.sensory.totalItem0Collisions, agent.sensory.totalItem1Collisions);
    }
  }

  private logItemHistory(worldClock: number, timestamp: number, items: Array<Item>, ticksPerSecond: number): void {
    if (worldClock % ticksPerSecond === 0) {
      this.itemChangeHistory.push(
        [timestamp,
          this.itemChange[0] / ticksPerSecond,
          this.itemChange[1] / ticksPerSecond,
          this.itemChange[2] / ticksPerSecond]
      );
      this.resetItemChangeRecord();
    }
  }

}
