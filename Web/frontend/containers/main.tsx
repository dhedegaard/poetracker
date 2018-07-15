import * as React from 'react';

import Main from "../components/main";
import SignalRComponent from "../components/signalr";

export interface IMainContainerProps {
  leagues: poetracker.ILeagueType[] | null;
  latestDatapoints: poetracker.IDatapointResult[] | null;
  accounts: poetracker.IAccountType[] | null;
}

interface IState {
  error: string;
  leagues: poetracker.ILeagueType[];
  selectedLeague: string;
  datapoints: poetracker.IDatapointResult[];
  accounts: poetracker.IAccountType[];
}

export default class MainContainer extends React.Component<IMainContainerProps, IState> {
  signalRComponent: React.RefObject<SignalRComponent>;

  constructor(props: IMainContainerProps) {
    super(props);
    this.onSignalRConnectionClosed = this.onSignalRConnectionClosed.bind(this);
    this.onSignalRInitialPayload = this.onSignalRInitialPayload.bind(this);
    this.onSignalRNotifyNewData = this.onSignalRNotifyNewData.bind(this);
    this.signalRComponent = React.createRef();
    this.state = {
      accounts: props.accounts || [],
      datapoints: props.latestDatapoints || [],
      error: '',
      leagues: props.leagues || [],
      selectedLeague: '',
    };
  }

  componentDidMount() {
    // Patch in a font and use it everywhere (after it's done loading).
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css?family=Open+Sans:400,700';
    link.rel = 'stylesheet';
    link.onload = () => {
      document.body.style.fontFamily = '"Open Sans", sans-serif';
    };
    document.head.appendChild(link);
  }

  /**
   * Triggers on the initial payload, just after the connection was established.
   */
  onSignalRInitialPayload(data: poetracker.IInitialPayload) {
    let selectedLeague = '';

    // Check for an existing selectedLeague value from the localStorage.
    if (window.localStorage && window.localStorage.getItem('selectedLeague')) {
      selectedLeague = window.localStorage.getItem('selectedLeague')!;
    }

    // Check if what we have is valid, otherwise default to the first element (if any).
    if (!selectedLeague || !data.leagues || !data.leagues.filter((e) => e.id === selectedLeague)) {
      selectedLeague = '';
    }

    // If there's no league selected, and there's no league data in the localStorage,
    // select the last league that's not either HC or SSF.
    if (selectedLeague === '' && window.localStorage && window.localStorage.getItem('selectedLeague') === null) {
      selectedLeague = data.leagues.filter((e) => e.id.indexOf('HC') === -1 && e.id.indexOf('SSF') === -1)[0].id;
    }

    this.setState({
      accounts: data.accounts,
      datapoints: data.latestDatapoints,
      leagues: data.leagues,
      selectedLeague,
    });
    console.log('initial payload:', data);
  }

  /**
   * Triggers when there's new delta data to work on.
   */
  onSignalRNotifyNewData(data: poetracker.IDatapointResult[]) {
    console.log('NotifyNewData:', data);
    // Copy the datapoints state.
    let datapoints = this.state.datapoints.slice();

    // Iterate on the delta update, handling changes as we go along.
    for (const datapoint of data) {

      // Remove any existing entries for the given char, probably not the
      // most efficient if there's a lot of datapoints.
      datapoints = datapoints.filter((e) => !(
        e.datapoint.charname === datapoint.datapoint.charname &&
        e.datapoint.leagueId === datapoint.datapoint.leagueId));

      // Push the new datapoint.
      datapoints.push(datapoint);
    }

    // Set the new state.
    this.setState({
      datapoints,
    });
  }

  /**
   * Gets called wheneveer the SignalR connection gets closed for some reason. For now there's no reason for the
   * disconnect.
   */
  onSignalRConnectionClosed() {
    this.setState({
      error: 'You have been disconnected',
    });
  }

  render() {
    return (
      <React.Fragment>
        <Main
          accounts={this.state.accounts}
          datapoints={this.state.datapoints}
          error={this.state.error}
          leagues={this.state.leagues}
          selectedLeague={this.state.selectedLeague}
          getCharData={this.signalRComponent.current ? this.signalRComponent.current.getCharData : undefined}
          forceUpdate={() => { this.forceUpdate(); }}
        />
        <SignalRComponent
          ref={this.signalRComponent}
          onSignalRConnectionClosed={this.onSignalRConnectionClosed}
          onSignalRInitialPayload={this.onSignalRInitialPayload}
          onSignalRNotifyNewData={this.onSignalRNotifyNewData}
        />
      </React.Fragment>
    );
  }
}
