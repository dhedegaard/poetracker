import * as aspnet_SignalR from '@aspnet/signalr'
import React from 'react'
import {
  ISignalRDispatchToProps,
  ISignalRStateToProps
} from '../containers/signalr'

type IProps = ISignalRStateToProps & ISignalRDispatchToProps

/**
 * Handles the wrapping of the SignalR stuff, emits events with data from the callbacks in props.
 */
export default class SignalR extends React.Component<IProps, {}> {
  connection!: aspnet_SignalR.HubConnection

  constructor(props: IProps) {
    super(props)
    this.connectSignalR = this.connectSignalR.bind(this)
  }

  async componentDidUpdate() {
    const { props } = this
    const { getCharData } = props
    if (getCharData) {
      const result = await this.getCharData(
        getCharData.leagueId,
        getCharData.charname
      )
      props.receivedCharData({
        charname: getCharData.charname,
        leagueId: getCharData.leagueId,
        result
      })
    }
  }

  /**
   * Connects to the SignalR hub and sets up various handlers.
   */
  connectSignalR() {
    // Build the connection.
    this.connection = new aspnet_SignalR.HubConnectionBuilder()
      .withUrl('/data')
      .build()

    // Add handlers.
    this.connection.on('NotifyNewData', this.props.onSignalRNotifyNewData)
    this.connection.on('InitialPayload', this.props.onSignalRInitialPayload)

    // Handle connection errors to the hub (using private API, fix this later when proper error handling has been
    // implemented).
    ;(this.connection as any).closedCallbacks.push(() => {
      console.log('The SignalR connection got closed.')
      this.props.onSignalRConnectionClosed()
    })

    // Connect and retry on failure, notifying the user.
    this.connection.start().catch(reason => {
      console.log('Unable to connect because:', reason)
      this.props.onSignalRConnectionClosed()
    })
  }

  componentDidMount() {
    // Setup the SignalR connection.
    this.connectSignalR()
  }

  componentWillUnmount() {
    // Tear down the SignalR connection.
    if (this.connection) {
      this.connection.stop()
    }
  }

  /**
   * Fetches data for a given character, returning a resolvable promise.
   */
  getCharData = (
    leagueId: string,
    charname: string
  ): Promise<poetracker.IGraphData[]> => {
    return new Promise(resolve => {
      /* Define a handler, that responds to character data. */
      const handler = (data: poetracker.IGetCharDataResult) => {
        /* If this data is not what we expect, skip it. */
        if (data.leagueId !== leagueId || data.charname !== charname) {
          return
        }
        /* Otherwise, remove the handler and return the datapoints. */
        this.connection.off('GetCharData', handler)
        return resolve(data.result)
      }

      /* Add the handler and invoke the SignalR method on the Hub. */
      this.connection.on('GetCharData', handler)
      this.connection.invoke('GetCharData', leagueId, charname)
    })
  }

  render() {
    // Don't render anything, this component is simply here for managing
    // SignalR and doing callbacks when new data arrive.
    return null
  }
}
