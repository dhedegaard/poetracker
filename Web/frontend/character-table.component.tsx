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
    this.getPoeProfileURL = this.getPoeProfileURL.bind(this);
    this.getPassiveSkillTreeURL = this.getPassiveSkillTreeURL.bind(this);
  }

  getPoeProfileURL(accountId: string, charname: string) {
    return `http://poe-profile.info/profile/${accountId}/${charname}`;
  }

  getPassiveSkillTreeURL(accountId: string, charname: string) {
    return `https://www.pathofexile.com/character-window/view-passive-skill-tree?accountName=${accountId}&character=${charname}`;
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
                    />{' '}
                    <span>{datapoint.datapoint.globalRank}</span>
                    {datapoint.previousDatapoint && datapoint.previousDatapoint.globalRank !== datapoint.datapoint.globalRank && (
                      <React.Fragment>
                        {' '}
                        <span className={'badge ' + (datapoint.datapoint.globalRank > datapoint.previousDatapoint.globalRank ? 'badge-success' : 'badge-danger')}>
                          {datapoint.datapoint.globalRank > datapoint.previousDatapoint.globalRank && (
                            <React.Fragment>+</React.Fragment>
                          )}
                          {datapoint.datapoint.globalRank - datapoint.previousDatapoint.globalRank}
                        </span>
                      </React.Fragment>
                    )}
                  </td>
                  <td className="text-nowrap" title={`Account name: ${datapoint.datapoint.accountId}`}>
                    <div className="float-right">
                      <a href={this.getPoeProfileURL(datapoint.datapoint.accountId, datapoint.datapoint.charname)} target="_blank" rel="nofollow" className="badge badge-info">
                        Profile
                    </a>
                      {' '}
                      <a href={this.getPassiveSkillTreeURL(datapoint.datapoint.accountId, datapoint.datapoint.charname)} rel="nofollow" target="_blank" title="Click to see the passive skill tree" className="badge badge-danger">
                        Tree
                    </a>
                      {datapoint.datapoint.dead && (
                        <small className="badge badge-dark"></small>
                      )}
                    </div>
                    {datapoint.datapoint.charname}
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
                    {datapoint.datapoint.level}
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