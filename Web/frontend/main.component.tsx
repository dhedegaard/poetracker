import React from 'react';
import * as SignalR from '@aspnet/signalr';

export interface Datapoint {
    accountId: string;
    charname: string;
    experience: number;
    globalRank: number;
    leagueId: string;
    level: number;
    timestamp: string;
    class: string;
    dead: boolean;
    online: boolean;
}

export interface LeagueType {
    id: string;
    startAt: string;
    endAt?: string;
}

interface InitialPayload {
    leagues: LeagueType[];
    latestDatapoints: Datapoint[];
}

interface MainComponentState {
    error: string;
    leagues: LeagueType[];
    selectedLeague: string;
    datapoints: Datapoint[];
}

export default class MainComponent extends React.Component<{}, MainComponentState> {
    connection!: SignalR.HubConnection;

    constructor(props: {}) {
        super(props);
        this.connectSignalR = this.connectSignalR.bind(this);
        this.state = {
            error: '',
            leagues: [],
            selectedLeague: '',
            datapoints: [],
        };
        this.onSignalRNotifyNewData = this.onSignalRNotifyNewData.bind(this);
        this.onSignalRInitialPayload = this.onSignalRInitialPayload.bind(this);
        this.onLeagueSelect = this.onLeagueSelect.bind(this);
        this.onClickReloadPage = this.onClickReloadPage.bind(this);
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
        this.connection.on('NotifyNewData', this.onSignalRNotifyNewData);
        this.connection.on('InitialPayload', this.onSignalRInitialPayload);

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

    /**
     * Triggers on the initial payload, just after the connection was established.
     */
    onSignalRInitialPayload(data: InitialPayload) {
        let selectedLeague = '';

        // Check for an existing selectedLeague value from the localStorage.
        if (window.localStorage && window.localStorage.getItem('selectedLeague')) {
            selectedLeague = window.localStorage.getItem('selectedLeague')!;
        }

        // Check if what we have is valid, otherwise default to the first element (if any).
        if (!selectedLeague || !data.leagues || !data.leagues.filter(e => e.id === selectedLeague)) {
            selectedLeague = '';
        }

        this.setState({
            leagues: data.leagues,
            selectedLeague: selectedLeague,
            datapoints: data.latestDatapoints
                .sort((a, b) => b.experience - a.experience),
        });
        console.log('initial payload:', data);
    }

    /**
     * Triggers when there's new delta data to work on.
     */
    onSignalRNotifyNewData(data: Datapoint[]) {
        console.log('TODO data:', data);
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

    /**
     * Reloads the page, use this as a click event handler when something goes haywire.
     */
    onClickReloadPage(evt: React.MouseEvent<HTMLAnchorElement>) {
        window.location.reload();
    }

    /**
     * Triggers when the league select element triggers a change event.
     */
    onLeagueSelect(evt: React.ChangeEvent<HTMLSelectElement>) {
        const value = evt.currentTarget.value;
        // Set the value in the state.
        this.setState({
            selectedLeague: value,
        });
        // Store the value in the localStorage for reloads and such.
        if (window.localStorage) {
            localStorage.setItem('selectedLeague', value);
        }
    }

    render() {
        return (
            <React.Fragment>
                <h2>Poetracker</h2>
                {this.state.error && (
                    <div className="alert alert-danger">
                        <b>Error</b>: {this.state.error}
                        <a onClick={this.onClickReloadPage} className="text-muted" href="javascript:void(0);"><b>Please try reloading the page</b></a>
                    </div>
                )}
                <hr />
                {!this.state.leagues && (
                    <div className="alert alert-warning">
                        Waiting for initial data, if this takes too long, try <a href="javascript:void(0);" onClick={this.onClickReloadPage} > reloading the page</a>
                    </div>
                )}
                {this.state.leagues && (
                    <React.Fragment>
                        <div className="row form-rom">
                            <label className="col-2 text-right" htmlFor="id_league_select">League:</label>
                            <div className="col-4">
                                <select className="form-control form-control-sm" id="id_league_select" value={this.state.selectedLeague} onChange={this.onLeagueSelect}>
                                    <option value="">-- Show all</option>
                                    {this.state.leagues.map((league) => (
                                        <option key={league.id} value={league.id}>{league.id}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <hr />
                        <table className="table table-bordered table-striped table-sm">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Character name</th>
                                    <th>Account name</th>
                                    <th>Class</th>
                                    <th>Level</th>
                                    <th>Experience</th>
                                    {!this.state.selectedLeague && (
                                        <th>League</th>
                                    ) || undefined}
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.datapoints.map((datapoint) => {
                                    /* If the user selected a league, and it's not the currently selected one, skip it. */
                                    if (this.state.selectedLeague && this.state.selectedLeague !== datapoint.leagueId) {
                                        return undefined;
                                    }

                                    return (
                                        <tr key={datapoint.charname + datapoint.experience}>
                                            <td>{datapoint.globalRank}</td>
                                            <td>
                                                {datapoint.charname}
                                                {datapoint.dead && (
                                                    <small className="text-muted"> [DEAD]</small>
                                                )}
                                            </td>
                                            <td>{datapoint.accountId}</td>
                                            <td>{datapoint.class}</td>
                                            <td>{datapoint.level}</td>
                                            <td>{datapoint.experience}</td>
                                            {!this.state.selectedLeague && (
                                                <td>{datapoint.leagueId}</td>
                                            ) || undefined}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </React.Fragment>
                )}
            </React.Fragment>
        );
    }
}
