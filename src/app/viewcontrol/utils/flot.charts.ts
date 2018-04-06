import { Stats } from "./stats.utility";

export class Flot {
  stats: Stats;

  private container: any;
  private $: any;
  private xaxisLength: number;
  private yInterval: Array<number> = [-140, 15];
  private opt: any;
  private getOptsFor: Function = (xMin: number, xMax: number, yMin: number = this.yInterval[0], yMax: number = this.yInterval[1]): any => {
    return {
      grid: {
        borderWidth: 1,
        minBorderMargin: 20,
        labelMargin: 10,
        margin: {
          top: 10,
          bottom: 10,
          left: 10,
        }
      },
      xaxis: { mode: "time", timeformat: "%I:%M", min: xMin, max: xMax, borderWidth: 1 },
      yaxis: { min: yMin, max: yMax }
    };
  };

  constructor(htmlId: string, document: any, $: any, stats: Stats, xMax: number = 1000) {
    this.container = document.getElementById(htmlId);
    this.$ = $;
    this.stats = stats;
    this.xaxisLength = xMax;
    this.opt = this.getOptsFor(new Date().getTime(), new Date().getTime() + 1000 * this.xaxisLength, this.yInterval[0], this.yInterval[1]);
  }

  private init(): any {
  }

  public reset(): void {
    this.init();
  }

  public plot(numOfAgents: number): void {
    const data = Array<any>();
    for (let i = 0; i < numOfAgents; i++) {
      const res = this.gatherData(i, numOfAgents);
      data.push(res[0]);
      data.push(res[1]);
      data.push(res[2]);
      data.push(res[3]);
    }
    this.ensureXAxisInterval();

    this.$.plot(this.container, data, this.opt);
  }

  private gatherData(i: number, numOfAgents: number) {
    const [item0, item1, wall, agent] = this.getHistoricalDataForAgent(i, numOfAgents);
    return [{
      label: "Agent " + (i + 1) + " (item0)",
      data: item0,
      lines: { fill: false, lineWidth: 0.4 },
      points: { show: false },
      shadowSize: 0
    }, {
      label: "Agent " + (i + 1) + " (item1)",
      data: item1,
      lines: { fill: false, lineWidth: 0.4 },
      points: { show: false },
      shadowSize: 0
    }, {
      label: "Agent " + (i + 1) + " (wall)",
      data: wall,
      lines: { fill: false, lineWidth: 0.4 },
      points: { show: false },
      shadowSize: 0
    }, {
      label: "Agent " + (i + 1) + " (agent)",
      data: agent,
      lines: { fill: false, lineWidth: 0.4 },
      points: { show: false },
      shadowSize: 0
    }];
  }

  private getHistoricalDataForAgent(agentId: number, numOfAgents: number): Array<any> {
    const item0 = new Array<Array<number>>(1000);
    const item1 = new Array<Array<number>>(1000);
    const wall = new Array<Array<number>>(1000);
    const agent = new Array<Array<number>>(1000);
    const lowerBound = Math.max(0, this.stats.rewardHistory[agentId].length - 1000);
    for (let j = lowerBound; j < this.stats.rewardHistory[agentId].length; j++) {
      item0[j - lowerBound] = [this.stats.rewardHistory[agentId][j][0], this.stats.rewardHistory[agentId][j][1]]
      item1[j - lowerBound] = [this.stats.rewardHistory[agentId][j][0], this.stats.rewardHistory[agentId][j][2]]
      wall[j - lowerBound] = [this.stats.rewardHistory[agentId][j][0], this.stats.rewardHistory[agentId][j][3]]
      agent[j - lowerBound] = [this.stats.rewardHistory[agentId][j][0], this.stats.rewardHistory[agentId][j][4]]
    }

    return [item0, item1, wall, agent];
  }

  private ensureXAxisInterval() {
    const length = this.stats.rewardHistory[0].length;
    if (length > this.xaxisLength) {
      const xMin = this.stats.rewardHistory[0][length - this.xaxisLength - 1][0];
      const xMax = this.stats.rewardHistory[0][length - 1][0];
      this.opt = this.getOptsFor(xMin, xMax);
    }
  }
}
