import { ChartPoint } from "chart.js";
import React from "react";
import { Line } from "react-chartjs-2";

import { IGraphData } from "./character-table-row.component";

interface IComponentProps {
  graphData: IGraphData[];
}

interface IComponentState {
  from: 'forever' | '1 day' | '6 hours' | '1 hour';
}

export default class CharacterGraphComponent extends React.Component<IComponentProps, IComponentState> {
  constructor(props: IComponentProps) {
    super(props);
    this.state = {
      from: localStorage.getItem('graph-from') || 'forever' as any,
    };
    this.onChangeFrom = this.onChangeFrom.bind(this);
  }

  onChangeFrom(evt: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({
      from: evt.currentTarget.value as any,
    });
    localStorage.setItem('graph-from', evt.currentTarget.value);
  }

  render() {
    if (!this.props.graphData || this.props.graphData.length < 2) {
      return (
        <div className="alert alert-danger">
          Not enough datapoints, sorry. Click on the character row above to hide me again.
        </div>
      );
    }

    /* Filter the dataset, if applicable. */
    let fromDate: Date | null = null;
    switch (this.state.from) {
      case 'forever': break;
      case '1 day':
        fromDate = new Date(new Date().getTime() - 1000 * 60 * 60 * 12);
        break;
      case '6 hours':
        fromDate = new Date(new Date().getTime() - 1000 * 60 * 60 * 6);
        break;
      case '1 hour':
        fromDate = new Date(new Date().getTime() - 1000 * 60 * 60 * 1);
        break;
    }
    const graphData = this.props.graphData;

    return (
      <React.Fragment>
        <div className="row" style={{ paddingBottom: 20 }}>
          <label htmlFor="id_graph_from" className="form-label col-3 col-sm-2 offset-1 text-muted text-right">
            <small>Show from:</small>
          </label>
          <div className="col-sm-2 col-4">
            <select
              id="id_graph_from"
              className="form-control form-control-sm"
              onChange={this.onChangeFrom} value={this.state.from}
            >
              <option key="forever" value="forever">
                Forever
              </option>
              <option key="1 day" value="1 day">
                The last day
              </option>
              <option key="6 hours" value="6 hours">
                Last six hours
              </option>
              <option key="1 hour" value="1 hour">
                Last hour
              </option>
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-10 offset-1">
            <Line data={{
              datasets: [
                {
                  backgroundColor: '#17a2b8',
                  borderColor: '#17a2b8',
                  data: graphData.map((e) => ({
                    x: e.timestampDate,
                    y: e.experience,
                  })),
                  fill: false,
                  label: 'Experience',
                  pointRadius: 2,
                  yAxisID: 'xp-axis',
                },
                {
                  backgroundColor: '#4b367c',
                  borderColor: '#4b367c',
                  data: graphData.map((e) => ({
                    x: e.timestampDate,
                    y: e.globalRank,
                  })),
                  fill: false,
                  label: 'Global rank',
                  pointRadius: 2,
                  yAxisID: 'rank-axis',
                },
              ],
              labels: graphData.map((e) => e.timestampDate.toLocaleString()),
            }} options={{
              animation: false as any,
              legend: {
                display: false,
              },
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
                    max: new Date().getTime() as any,
                    min: fromDate ? fromDate : undefined as any,
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
      </React.Fragment>
    );
  }
}
