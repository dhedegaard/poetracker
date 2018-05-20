import React from "react";
import { Datapoint, LeagueType } from "./main.component";

interface CharacterTableComponentProps {
  selectedLeague: string;
  datapoints: Datapoint[];
  leagues: LeagueType[];
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
    return (
      <div className="table-responsive">
        <table className="table table-bordered table-hover table-sm">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Character name</th>
              <th>Class</th>
              <th className="text-right">Level</th>
              <th className="text-right">Experience</th>
              {!this.props.selectedLeague && (
                <th className="d-none d-sm-block">League</th>
              ) || undefined}
            </tr>
          </thead>
          <tbody>
            {this.props.datapoints.map((datapoint) => {
              /* If the user selected a league, and it's not the currently selected one, skip it. */
              if (this.props.selectedLeague && this.props.selectedLeague !== datapoint.leagueId) {
                return undefined;
              }

              /* All done, render the given table row. */
              return (
                <tr key={datapoint.charname + datapoint.experience + datapoint.online + datapoint.dead}>
                  <td>
                    <img
                      src={`https://www.pathofexile.com/image/ladder/${datapoint.online ? 'online' : 'offline'}.png`}
                      title={datapoint.online ? 'Online' : 'Offline'} width={15} height={15}
                    />{' '}
                    <span>{datapoint.globalRank}</span>
                  </td>
                  <td className="text-nowrap" title={`Account name: ${datapoint.accountId}`}>
                    <a href={this.getPoeProfileURL(datapoint.accountId, datapoint.charname)} target="_blank" rel="nofollow">
                      {datapoint.charname}
                    </a>
                    {datapoint.dead && (
                      <small className="text-muted"> [DEAD]</small>
                    )}
                  </td>
                  <td>
                    <a href={this.getPassiveSkillTreeURL(datapoint.accountId, datapoint.charname)} rel="nofollow" target="_blank" title="Click to see the passive skill tree">
                      {datapoint.class}
                    </a>
                  </td>
                  <td className="text-right">{datapoint.level}</td>
                  <td className="text-right">{datapoint.experience.toLocaleString()}</td>
                  {!this.props.selectedLeague && (
                    <td className="d-none d-sm-block">{datapoint.leagueId}</td>
                  ) || undefined}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}