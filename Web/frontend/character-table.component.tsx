import React from "react";
import { LeagueType, DatapointResult } from "./main.component";

interface CharacterTableComponentProps {
  selectedLeague: string;
  datapoints: DatapointResult[];
  leagues: LeagueType[];
  clickedLeague: (leagueId: string) => void;
}

export default class CharacterTableComponent extends React.Component<CharacterTableComponentProps, {}> {

  constructor(props: CharacterTableComponentProps) {
    super(props);
  }

  render() {
    const datapoints = this.props.datapoints.filter(e => !this.props.selectedLeague || this.props.selectedLeague === e.datapoint.leagueId);
    return (
      <div className="table-responsive">
        <table className="table table-bordered table-hover table-dark">
          <thead>
            <tr>
              <th>Rank</th>
              <th className="text-nowrap">Character name</th>
              <th>Class</th>
              <th className="text-right">Level</th>
              {!this.props.selectedLeague && (
                <th className="d-none d-sm-block">League</th>
              ) || undefined}
            </tr>
          </thead>
          <tbody>
            {datapoints.map((datapoint) => {
              /* All done, render the given table row. */
              return (
                <tr key={datapoint.datapoint.charname + datapoint.datapoint.experience + datapoint.datapoint.online + datapoint.datapoint.dead}>
                  <td className="text-nowrap">
                    <img
                      src={`https://www.pathofexile.com/image/ladder/${datapoint.datapoint.online ? 'online' : 'offline'}.png`}
                      title={datapoint.datapoint.online ? 'Online' : 'Offline'} width={15} height={15}
                    />
                    {' '}
                    <span>{datapoint.datapoint.globalRank}</span>
                    {datapoint.previousDatapoint && datapoint.previousDatapoint.globalRank !== datapoint.datapoint.globalRank && (
                      <React.Fragment>
                        {' '}
                        <span className={'badge ' + (datapoint.datapoint.globalRank < datapoint.previousDatapoint.globalRank ? 'badge-success' : 'badge-danger')}>
                          {datapoint.datapoint.globalRank > datapoint.previousDatapoint.globalRank && (
                            <React.Fragment>+</React.Fragment>
                          )}
                          {datapoint.previousDatapoint.globalRank - datapoint.datapoint.globalRank}
                        </span>
                      </React.Fragment>
                    )}
                  </td>
                  <td className="text-nowrap" title={`Account name: ${datapoint.datapoint.accountId}`}>
                    <div className="float-right d-none d-sm-block">
                      {datapoint.datapoint.account.twitchURL && (
                        <React.Fragment>
                          <a href={datapoint.datapoint.account.twitchURL} target="_blank" rel="nofollow" className="badge badge-dark badge-twitch" title={`Twitch username: ${datapoint.datapoint.account.twitchUsername}`} >
                            Twitch
                          </a>
                          {' '}
                        </React.Fragment>
                      )}
                      <a href={datapoint.datapoint.poeProfileURL} target="_blank" rel="nofollow" className="badge badge-info">
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
                  <td>
                    {datapoint.datapoint.class}
                  </td>
                  <td className="text-right">
                    {datapoint.previousDatapoint && datapoint.previousDatapoint.level !== datapoint.datapoint.level && (
                      <React.Fragment>
                        <span className="badge badge-success">+{datapoint.datapoint.level - datapoint.previousDatapoint.level}</span>
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
                        <a href="javascript:void(0);" onClick={() => { this.props.clickedLeague(datapoint.datapoint.leagueId); }} title="Go to the league" className="badge badge-light float-right text-nowrap">
                          Filter this league
                        </a>
                        {datapoint.datapoint.leagueId}
                      </small>
                    </td>
                  ) || undefined}
                </tr>
              );
            })}
            {!datapoints.length && (
              <tr>
                <td colSpan={4} className="text-center"><b>Sorry!</b> I've got no datapoints for the given league, try filtering on another league.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}