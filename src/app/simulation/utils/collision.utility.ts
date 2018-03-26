export class Collisions {
  totalItem0Collisions: number;
  totalItem1Collisions: number;
  
  item0Collisions: number;
  item1Collisions: number;
  wallDetectionReward: number;
  agentDetectionReward: number;

  constructor(totalItem0: number, totalItem1: number) {
    this.totalItem0Collisions = totalItem0;
    this.totalItem1Collisions = totalItem1;
    
    this.item0Collisions = 0;
    this.item1Collisions = 0;
    this.wallDetectionReward = 0;
    this.agentDetectionReward = 0;
  }
}
