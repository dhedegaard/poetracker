import { ChartPoint } from 'chart.js'
import React from 'react'
import { Line } from 'react-chartjs-2'
import { ICharacterGraphStateToProps } from '../../containers/character-graph'
import Loader from './Loader'
import ShowFromSelect from './ShowFromSelect'

type IProps = ICharacterGraphStateToProps

const CharacterGraph = (props: IProps) => {
  const { graphData, fromDate } = props

  if (props.isLoadingGraphData) {
    return <Loader />
  }

  if (!graphData || graphData.length < 2) {
    return (
      <div className="alert alert-danger">
        Not enough datapoints, sorry. Click on the character row above to hide
        me again.
      </div>
    )
  }

  return (
    <>
      <ShowFromSelect />
      <div className="row">
        <div className="col-10 offset-1">
          <Line
            data={{
              datasets: [
                {
                  backgroundColor: '#17a2b8',
                  borderColor: '#17a2b8',
                  data: graphData.map(e => ({
                    x: e.timestampDate.getTime(),
                    y: e.experience
                  })),
                  fill: false,
                  label: 'Experience',
                  pointRadius: 2,
                  yAxisID: 'xp-axis'
                },
                {
                  backgroundColor: '#4b367c',
                  borderColor: '#4b367c',
                  data: graphData.map(e => ({
                    x: e.timestampDate.getTime(),
                    y: e.globalRank
                  })),
                  fill: false,
                  label: 'Global rank',
                  pointRadius: 2,
                  yAxisID: 'rank-axis'
                }
              ],
              labels: graphData.map(e => e.timestampDate.toLocaleString())
            }}
            options={{
              animation: {
                duration: 0
              },
              legend: {
                display: false
              },
              scales: {
                xAxes: [
                  {
                    distribution: 'linear',
                    ticks: {
                      autoSkip: true,
                      source: 'auto'
                    },
                    time: {
                      displayFormats: {
                        minute: 'YYYY-MM-DD HH:MM'
                      },
                      max: new Date().toISOString(),
                      min: fromDate ? fromDate.toISOString() : undefined,
                      minUnit: 'minute',
                      unit: 'minute',
                    },
                    type: 'time'
                  }
                ],
                yAxes: [
                  {
                    id: 'xp-axis',
                    position: 'left',
                    scaleLabel: {
                      display: true,
                      fontColor: '#17a2b8',
                      fontStyle: 'bold',
                      labelString: 'Experience'
                    },
                    ticks: {
                      beginAtZero: true,
                      callback: value => {
                        if (Number.isInteger(value)) {
                          return value.toLocaleString()
                        }
                      },
                      fontColor: '#17a2b8'
                    }
                  },
                  {
                    id: 'rank-axis',
                    position: 'right',
                    scaleLabel: {
                      display: true,
                      fontColor: '#4b367c',
                      fontStyle: 'bold',
                      labelString: 'Global rank'
                    },
                    ticks: {
                      callback: value => {
                        if (Number.isInteger(value)) {
                          return value
                        }
                      },
                      fontColor: '#4b367c',
                      min: 1,
                      reverse: true
                    }
                  }
                ]
              },
              tooltips: {
                callbacks: {
                  label: (item, data) => {
                    const dataset = data.datasets![item.datasetIndex!]
                    const datasetLabel = dataset.label || ''
                    const point = dataset.data![item.index!] as ChartPoint
                    return `${datasetLabel}: ${point.y!.toLocaleString()}`
                  }
                }
              }
            }}
          />
        </div>
      </div>
    </>
  )
}
export default CharacterGraph
