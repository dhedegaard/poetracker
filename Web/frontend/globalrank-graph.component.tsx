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
        <div className="col-6">
          <Line data={{
            datasets: [{
              backgroundColor: '#4b367c',
              borderColor: '#4b367c',
              data: this.props.graphData.map((e) => ({
                x: e.timestampDate,
                y: e.globalRank,
              })),
              fill: false,
              label: 'Global rank',
            }],
            labels: this.props.graphData.map((e) => e.timestampDate.toLocaleString()),
          }} options={{
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
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  callback: (value) => {
                    if (Number.isInteger(value)) {
                      return value;
                    }
                  },
                },
              }],
            },
          }}
          />
        </div>
        <div className="col-6">
          <Line data={{
            datasets: [{
              backgroundColor: '#17a2b8',
              borderColor: '#17a2b8',
              data: this.props.graphData.map((e) => ({
                x: e.timestampDate,
                y: e.experience,
              })),
              fill: false,
              label: 'Experience',
            }],
            labels: this.props.graphData.map((e) => e.timestampDate.toLocaleString()),
          }} options={{
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
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  callback: (value) => {
                    if (Number.isInteger(value)) {
                      return value;
                    }
                  },
                },
              }],
            },
          }}
          />
        </div>
      </div>
    );
  }
}
