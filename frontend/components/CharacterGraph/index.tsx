import { ChartPoint } from "chart.js";
import React from "react";
import { Line } from "react-chartjs-2";
import {
  ICharacterGraphDispatchToProps,
  ICharacterGraphStateToProps,
} from "../../containers/character-graph";
import Loader from "./Loader";

type IProps = ICharacterGraphStateToProps & ICharacterGraphDispatchToProps;

const CharacterGraph = (props: IProps) => {
  const { graphData, from } = props;

  if (props.isLoadingGraphData) {
    return <Loader />;
  }

  if (!graphData || graphData.length < 2) {
    return (
      <div className="alert alert-danger">
        Not enough datapoints, sorry. Click on the character row above to hide
        me again.
      </div>
    );
  }

  const onSelectChanged = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    props.fromChanged(evt.currentTarget.value as poetracker.GraphFromType);
  };

  /* Filter the dataset, if applicable. */
  let fromDate: Date | null = null;
  /* Refactor to redux store later. */
  switch (from) {
    case "1 week":
      fromDate = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7);
      break;
    case "3 days":
      fromDate = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3);
      break;
    case "1 day":
      fromDate = new Date(new Date().getTime() - 1000 * 60 * 60 * 24);
      break;
    case "6 hours":
      fromDate = new Date(new Date().getTime() - 1000 * 60 * 60 * 6);
      break;
    case "1 hour":
      fromDate = new Date(new Date().getTime() - 1000 * 60 * 60 * 1);
      break;
    case "forever":
      break;
    default:
      throw new Error(`Unhandled case: ${props.from}`);
  }

  return (
    <>
      <div className="row" style={{ paddingBottom: 20 }}>
        <label
          htmlFor="id_graph_from"
          className="form-label col-3 col-sm-2 offset-1 text-muted text-right"
        >
          <small>Show from:</small>
        </label>
        <div className="col-sm-2 col-4">
          <select
            id="id_graph_from"
            className="form-control form-control-sm"
            onChange={onSelectChanged}
            defaultValue={props.from}
          >
            <option key="forever" value="forever">
              Forever
            </option>
            <option key="1 week" value="1 week">
              The last week
            </option>
            <option key="3 days" value="3 days">
              Last three days
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
          <Line
            data={{
              datasets: [
                {
                  backgroundColor: "#17a2b8",
                  borderColor: "#17a2b8",
                  data: graphData.map((e) => ({
                    x: e.timestampDate,
                    y: e.experience,
                  })),
                  fill: false,
                  label: "Experience",
                  pointRadius: 2,
                  yAxisID: "xp-axis",
                },
                {
                  backgroundColor: "#4b367c",
                  borderColor: "#4b367c",
                  data: graphData.map((e) => ({
                    x: e.timestampDate,
                    y: e.globalRank,
                  })),
                  fill: false,
                  label: "Global rank",
                  pointRadius: 2,
                  yAxisID: "rank-axis",
                },
              ],
              labels: graphData.map((e) => e.timestampDate.toLocaleString()),
            }}
            options={{
              animation: false as any,
              legend: {
                display: false,
              },
              scales: {
                xAxes: [
                  {
                    distribution: "linear",
                    ticks: {
                      autoSkip: true,
                      source: "auto",
                    },
                    time: {
                      displayFormats: {
                        minute: "YYYY-MM-DD HH:MM",
                      },
                      max: new Date().getTime() as any,
                      min: fromDate ? fromDate : (undefined as any),
                      unit: "minute",
                    },
                    type: "time",
                  },
                ],
                yAxes: [
                  {
                    id: "xp-axis",
                    position: "left",
                    scaleLabel: {
                      display: true,
                      fontColor: "#17a2b8",
                      fontStyle: "bold",
                      labelString: "Experience",
                    },
                    ticks: {
                      beginAtZero: true,
                      callback: (value) => {
                        if (Number.isInteger(value)) {
                          return (value as number).toLocaleString() as any;
                        }
                      },
                      fontColor: "#17a2b8",
                    },
                  },
                  {
                    id: "rank-axis",
                    position: "right",
                    scaleLabel: {
                      display: true,
                      fontColor: "#4b367c",
                      fontStyle: "bold",
                      labelString: "Global rank",
                    },
                    ticks: {
                      callback: (value) => {
                        if (Number.isInteger(value)) {
                          return value;
                        }
                      },
                      fontColor: "#4b367c",
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
                    const datasetLabel = dataset.label || "";
                    const point = dataset.data![item.index!] as ChartPoint;
                    return `${datasetLabel}: ${point.y!.toLocaleString()}`;
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </>
  );
};
export default CharacterGraph;
