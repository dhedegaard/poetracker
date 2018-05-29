import React from "react";

import { IDatapoint, IDatapointResult } from "./main.component";

interface IComponentProps {
  datapoint: IDatapointResult;
  getCharData: (charId: string) => Promise<IDatapoint[]>;
  selectedLeague: string;
  clickedLeague: (leagueId: string) => void;
}

interface IGraphData extends IDatapoint {
  timestampDate: Date;
}

interface IComponentState {
  graphData: IGraphData[];
}

export default class CharacterTableRowComponent extends React.Component<IComponentProps, IComponentState> {
  constructor(props: IComponentProps) {
    super(props);
    this.onRowClick = this.onRowClick.bind(this);
    this.state = {
      graphData: [],
    };
  }

  async onRowClick() {
    /* If there's already data, clear it to hide the graph again. */
    if (this.state.graphData && this.state.graphData.length) {
      this.setState({
        graphData: [],
      });
      return;
    }

    /* Fetch data for the given character. */
    const data = await this.props.getCharData(this.props.datapoint.datapoint.charId);

    /* Put the data in the state. */
    this.setState({
      graphData: data.map((e) => {
        const res = e as IGraphData;
        res.timestampDate = new Date(e.timestamp);
        return res;
      }),
    });
  }

  render() {
    const datapoint = this.props.datapoint;

    return (
      <React.Fragment>
        <tr onClick={this.onRowClick}>
          <td className="text-nowrap">
            <img
              src={`https://www.pathofexile.com/image/ladder/${datapoint.datapoint.online ? 'online' : 'offline'}.png`}
              title={datapoint.datapoint.online ? 'Online' : 'Offline'} width={15} height={15}
            />
            {' '}
            <span>{datapoint.datapoint.globalRank}</span>
            {datapoint.previousDatapoint &&
              datapoint.previousDatapoint.globalRank !== datapoint.datapoint.globalRank && (
                <React.Fragment>
                  {' '}
                  <small
                    className={
                      'badge ' + (datapoint.datapoint.globalRank < datapoint.previousDatapoint.globalRank ?
                        'badge-success' : 'badge-danger')}
                  >
                    {String.fromCharCode(
                      datapoint.datapoint.globalRank > datapoint.previousDatapoint.globalRank ? 8595 : 8593)}
                    {' '}
                    {Math.abs(datapoint.datapoint.globalRank - datapoint.previousDatapoint.globalRank)}
                  </small>
                </React.Fragment>
              )}
          </td>
          <td className="text-nowrap" title={
            `Account name: ${datapoint.datapoint.accountId}\n` +
            `League: ${datapoint.datapoint.leagueId}`
          }>
            <div className="float-right d-none d-sm-block">
              {datapoint.datapoint.account.twitchURL && (
                <React.Fragment>
                  <a
                    href={datapoint.datapoint.account.twitchURL}
                    target="_blank"
                    rel="nofollow"
                    className="badge badge-dark badge-twitch"
                    title={`Twitch username: ${datapoint.datapoint.account.twitchUsername}`}
                  >
                    Twitch
                  </a>
                  {' '}
                </React.Fragment>
              )}
              <a
                href={datapoint.datapoint.poeProfileURL}
                target="_blank"
                rel="nofollow"
                className="badge badge-info"
              >
                Profile
              </a>
            </div>
            {datapoint.datapoint.charname}
            {datapoint.datapoint.dead && (
              <React.Fragment>
                {' '}
                <small className="badge badge-danger">Dead</small>
              </React.Fragment>
            )}
          </td>
          <td>{datapoint.datapoint.class}</td>
          <td className="text-right">
            {datapoint.previousDatapoint && datapoint.previousDatapoint.level !== datapoint.datapoint.level && (
              <React.Fragment>
                <span className="badge badge-success">
                  +{datapoint.datapoint.level - datapoint.previousDatapoint.level}
                </span>
                {' '}
              </React.Fragment>
            )}
            <span title={`XP: ${datapoint.datapoint.experience.toLocaleString()}`}>
              {datapoint.datapoint.level}
            </span>
          </td>
          {!this.props.selectedLeague && (
            <td className="d-none d-sm-block">
              <small>
                <a
                  href="javascript:void(0);"
                  onClick={() => { this.props.clickedLeague(datapoint.datapoint.leagueId); }}
                  title="Go to the league"
                  className="badge badge-light float-right text-nowrap"
                >
                  Filter this league
                </a>
                {datapoint.datapoint.leagueId}
              </small>
            </td>
          ) || undefined}
        </tr>
      </React.Fragment>
    );
  }
}
