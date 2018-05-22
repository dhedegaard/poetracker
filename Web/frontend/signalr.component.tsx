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

    // Handle connection errors to the hub.
    this.connection.onclose = (error) => {
      this.setState({
        error: error.toString(),
      });
    };

    // Connect and retry on failure, notifying the user.
    this.connection.start()
      .catch((reason) => {
        this.setState({
          error: reason,
        });
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
