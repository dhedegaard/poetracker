import React from "react";
import * as SignalR from '@aspnet/signalr';

import { Datapoint, LeagueType, DatapointResult } from "./main.component";

export interface InitialPayload {
  leagues: LeagueType[];
  latestDatapoints: DatapointResult[];
}

interface SignalRComponentProps {
  onSignalRNotifyNewData: (data: DatapointResult[]) => void;
  onSignalRInitialPayload: (data: InitialPayload) => void;
  onSignalRConnectionClosed: () => void;
}

/**
 * Handles the wrapping of the SignalR stuff, emits events with data from the callbacks in props.
 */
export default class SignalRComponent extends React.Component<SignalRComponentProps, {}> {
  connection!: SignalR.HubConnection;

  constructor(props: SignalRComponentProps) {
    super(props);
    this.connectSignalR = this.connectSignalR.bind(this);
  }

  /**
   * Connects to the SignalR hub and sets up various handlers.
   */
  connectSignalR() {
    // Build the connection.
    this.connection = new SignalR.HubConnectionBuilder()
      .withUrl("/data")
      .build();

    // Add handlers.
    this.connection.on('NotifyNewData', this.props.onSignalRNotifyNewData);
    this.connection.on('InitialPayload', this.props.onSignalRInitialPayload);

    // Handle connection errors to the hub (using private API, fix this later when proper error handling has been implemented).
    (this.connection as any).closedCallbacks.push(() => {
      console.log('The SignalR connection got closed.');
      this.props.onSignalRConnectionClosed();
    });

    // Connect and retry on failure, notifying the user.
    this.connection.start()
      .catch((reason) => {
        console.log('Unable to connect because:', reason);
        this.props.onSignalRConnectionClosed();
      });
  }


  componentDidMount() {
    // Setup the SignalR connection.
    this.connectSignalR();
  }


  componentWillUnmount() {
    // Tear down the SignalR connection.
    if (this.connection) {
      this.connection.stop();
    }
  }

  render() {
    // Don't render anything, this component is simply here for managing
    // SignalR and doing callbacks when new data arrive.
    return null;
  }
}
