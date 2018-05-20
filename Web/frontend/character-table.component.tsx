import React from "react";
import { Datapoint } from "./main.component";

interface CharacterTableComponentProps {
    selectedLeague: string;
    datapoints: Datapoint[];
}

export default class CharacterTableComponent extends React.Component<CharacterTableComponentProps, {}> {
    render() {
        return (
            <table className="table table-bordered table-hover table-sm">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Character name</th>
                        <th>Account name</th>
                        <th>Class</th>
                        <th>Level</th>
                        <th>Experience</th>
                        {!this.props.selectedLeague && (
                            <th>League</th>
                        ) || undefined}
                    </tr>
                </thead>
                <tbody>
                    {this.props.datapoints.map((datapoint) => {
                        /* If the user selected a league, and it's not the currently selected one, skip it. */
                        if (this.props.selectedLeague && this.props.selectedLeague !== datapoint.leagueId) {
                            return undefined;
                        }

                        return (
                            <tr key={datapoint.charname + datapoint.experience}>
                                <td>{datapoint.globalRank}</td>
                                <td>
                                    <a href={`http://poe-profile.info/profile/${datapoint.accountId}/${datapoint.charname}`} target="_blank" rel="nofollow">
                                        {datapoint.charname}
                                    </a>
                                    {datapoint.dead && (
                                        <small className="text-muted"> [DEAD]</small>
                                    )}
                                </td>
                                <td>{datapoint.accountId}</td>
                                <td>{datapoint.class}</td>
                                <td>{datapoint.level}</td>
                                <td>{datapoint.experience}</td>
                                {!this.props.selectedLeague && (
                                    <td>{datapoint.leagueId}</td>
                                ) || undefined}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}