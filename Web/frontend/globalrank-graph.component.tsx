import { ChartPoint } from "chart.js";
import React from "react";
import { Line } from "react-chartjs-2";

import { IGraphData } from "./character-table-row.component";

interface IComponentProps {
  graphData: IGraphData[];
}
export default class GlobalrankGraphComponent extends React.Component<IComponentProps, {}> {
  render() {
    if (!this.props.graphData || this.props.graphData.length < 2) {
      return (
        <div className="alert alert-danger">
          Not enough datapoints, sorry. Click on the character row above to hide me again.
        </div>
      );
    }

    return (
      <div className="row">
        <div className="col-10 offset-1">
          <Line data={{
            datasets: [
              {
                backgroundColor: '#17a2b8',
                borderColor: '#17a2b8',
                data: this.props.graphData.map((e) => ({
                  x: e.timestampDate,
                  y: e.experience,
                })),
                fill: false,
                label: 'Experience',
                yAxisID: 'xp-axis',
              },
              {
                backgroundColor: '#4b367c',
                borderColor: '#4b367c',
                data: this.props.graphData.map((e) => ({
                  x: e.timestampDate,
                  y: e.globalRank,
                })),
                fill: false,
                label: 'Global rank',
                yAxisID: 'rank-axis',
              },
            ],
            labels: this.props.graphData.map((e) => e.timestampDate.toLocaleString()),
          }} options={{
            animation: false as any,
            scales: {
              xAxes: [{
                distribution: 'linear',
                ticks: {
                  autoSkip: true,
                  source: 'auto',
                },
                time: {
                  displayFormats: {
                    minute: 'YYYY-MM-DD HH:MM',
                  },
                  unit: 'minute',
                },
                type: 'time',
              }],
              yAxes: [
                {
                  id: 'xp-axis',
                  position: 'left',
                  scaleLabel: {
                    display: true,
                    fontColor: '#17a2b8',
                    fontStyle: 'bold',
                    labelString: 'Experience',
                  },
                  ticks: {
                    beginAtZero: true,
                    callback: (value) => {
                      if (Number.isInteger(value)) {
                        return (value as number).toLocaleString() as any;
                      }
                    },
                    fontColor: '#17a2b8',
                  },
                },
                {
                  id: 'rank-axis',
                  position: 'right',
                  scaleLabel: {
                    display: true,
                    fontColor: '#4b367c',
                    fontStyle: 'bold',
                    labelString: 'Global rank',
                  },
                  ticks: {
                    callback: (value) => {
                      if (Number.isInteger(value)) {
                        return value;
                      }
                    },
                    fontColor: '#4b367c',
                    min: 1,
                    reverse: true,
                  },
                },
              ],
            },
            tooltips: {
              callbacks: {
                label: (item, data) => {
                  const dataset = data.datasets![item.datasetIndex!];
                  const datasetLabel = dataset.label || '';
                  const point = dataset.data![item.index!] as ChartPoint;
                  return `${datasetLabel}: ${point.y!.toLocaleString()}`;
                },
              },
            },
          }}
          />
        </div>
      </div>
    );
  }
}
