import { RLAgent, Item } from 'learning-agents-model';

import { Collisions } from './collision.utility';

export class CollisionStats {

  public collisions: Array<Collisions>;
  public collisionHistory: Array<Array<Array<number>>>;
  public itemChange: Array<number>;
  public itemChangeHistory: Array<Array<number>>;
  public historicalDataTick: number;

  constructor(agents: Array<RLAgent>, items: Array<Item>) {
    this.init(agents, items);
  }

  private init(agents: Array<RLAgent>, items: Array<Item>): void {
    this.resetCollisionRecords(agents);
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
    this.collisionHistory = new Array<Array<Array<number>>>();
    for (const id of agents.keys()) {
      this.collisionHistory.push([[currentSecond, 0, 0, 0, 0]]);
    }
  }

  public reset(agents: Array<RLAgent>, items: Array<Item>): void {
    this.init(agents, items);
  }

  public tick(worldClock: number, agents: Array<RLAgent>, items: Array<Item>, ticksPerSecond: number): void {
    this.tickCollisions(agents);
    this.tickItemChange(items);

    const timestamp = this.getTimestamp();
    this.tickCollisionHistory(worldClock, timestamp, agents, ticksPerSecond);
    this.tickItemHistory(worldClock, timestamp, items, ticksPerSecond);
    this.historicalDataTick++;
  }

  private tickCollisions(agents: Array<RLAgent>): void {
    for (const [i, agent] of agents.entries()) {
      this.recordAgentCollisions(i, agent);
    }
  }

  private tickItemChange(items: Array<Item>): void {
    const [item0, item1] = this.getItemCounts(items);
    this.itemChange[0] += items.length;
    this.itemChange[1] += item0;
    this.itemChange[2] += item1;
  }

  private recordAgentCollisions(id: number, agent: RLAgent): void {
    this.collisions[id].totalItem0Collisions = agent.sensory.totalItem0Collisions;
    this.collisions[id].totalItem1Collisions = agent.sensory.totalItem1Collisions;

    this.collisions[id].item0Collisions += agent.sensory.item0CollisionsPerTick;
    this.collisions[id].item1Collisions += agent.sensory.item1CollisionsPerTick;
    this.collisions[id].wallDetectionReward += agent.sensory.wallDetectionRewardPerTick;
    this.collisions[id].agentDetectionReward += agent.sensory.agentDetectionRewardPerTick;
  }

  private tickCollisionHistory(worldClock: number, timestamp: number, agents: Array<RLAgent>, ticksPerSecond: number): void {
    if (worldClock % ticksPerSecond === 0) {
      for (const id of agents.keys()) {
        this.recordAgentsCollisionHistory(id, timestamp, ticksPerSecond);
      }
      this.resetCollisionRecords(agents);
    }
  }

  private getTimestamp(): number {
    return new Date().getTime();
  }

  private recordAgentsCollisionHistory(id: number, timestamp: number, ticksPerSecond: number) {
    this.collisionHistory[id].push(
      [timestamp,
        this.collisions[id].item0Collisions,
        this.collisions[id].item1Collisions,
        this.collisions[id].wallDetectionReward,
        this.collisions[id].agentDetectionReward]
    );
  }

  private resetCollisionRecords(agents: Array<RLAgent>) {
    this.collisions = new Array<Collisions>(agents.length);
    for (const [id, agent] of agents.entries()) {
      this.collisions[id] = new Collisions(agent.sensory.totalItem0Collisions, agent.sensory.totalItem1Collisions);
    }
  }

  private tickItemHistory(worldClock: number, timestamp: number, items: Array<Item>, ticksPerSecond: number): void {
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
