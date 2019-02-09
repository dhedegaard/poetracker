import { ChartPoint } from 'chart.js'
import React from 'react'
import { Line } from 'react-chartjs-2'
import { ICharacterGraphStateToProps } from '../../containers/character-graph'
import Loader from './Loader'

type IProps = ICharacterGraphStateToProps

const CharacterGraph = (props: IProps) => {
  const { graphData, from } = props

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

  /* Filter the dataset, if applicable. */
  let fromDate: Date | null = null
  /* Refactor to redux store later. */
  switch (from) {
    case '1 week':
      fromDate = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7)
      break
    case '3 days':
      fromDate = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3)
      break
    case '1 day':
      fromDate = new Date(new Date().getTime() - 1000 * 60 * 60 * 24)
      break
    case '6 hours':
      fromDate = new Date(new Date().getTime() - 1000 * 60 * 60 * 6)
      break
    case '1 hour':
      fromDate = new Date(new Date().getTime() - 1000 * 60 * 60 * 1)
      break
    case 'forever':
      break
    default:
      throw new Error(`Unhandled case: ${props.from}`)
  }

  return (
    <div className="row">
      <div className="col-10 offset-1">
        <Line
          data={{
            datasets: [
              {
                backgroundColor: '#17a2b8',
                borderColor: '#17a2b8',
                data: graphData.map(e => ({
                  x: e.timestampDate.toISOString(),
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
                  x: e.timestampDate.toISOString(),
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
                    unit: 'minute'
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
  )
}
export default CharacterGraph
