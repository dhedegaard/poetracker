import React from "react";

import GlobalrankGraphComponent from "./character-graph.component";
import { IDatapoint, IDatapointResult } from "./main.component";

interface IComponentProps {
  datapoint: IDatapointResult;
  getCharData: (leagueId: string, charname: string) => Promise<IDatapoint[]>;
  selectedLeague: string;
  clickedRow: (charname: string, leagueId: string) => void;
  isSelected: boolean;
}

export interface IGraphData extends IDatapoint {
  timestampDate: Date;
}

interface IComponentState {
  graphData: IGraphData[];
}

export default class CharacterTableRowComponent extends React.Component<IComponentProps, IComponentState> {
  constructor(props: IComponentProps) {
    super(props);
    this.onRowClick = this.onRowClick.bind(this);
    this.ensureGraphData = this.ensureGraphData.bind(this);
    this.state = {
      graphData: [],
    };
  }

  onRowClick() {
    this.props.clickedRow(
      this.props.datapoint.datapoint.charname,
      this.props.datapoint.datapoint.leagueId);
  }

  componentDidMount() {
    this.ensureGraphData();
  }

  componentDidUpdate() {
    this.ensureGraphData();
  }

  async ensureGraphData() {
    /* If this row is not the currently selected one, or there already is some data: Avoid fetching new graph data. */
    if (!this.props.isSelected || this.state.graphData.length) {
      return;
    }

    /* Fetch data for the given character. */
    const data = await this.props.getCharData(
      this.props.datapoint.datapoint.leagueId,
      this.props.datapoint.datapoint.charname);
    console.log('GetCharData:', data);

    /* Put the data in the state, if there's a change. */
    const filteredData = data.map((e) => {
      const res = e as IGraphData;
      res.timestampDate = new Date(e.timestamp);
      return res;
    });
    this.setState((oldState) => {
      /* Only update the graph data state, if there's a change. */
      if (oldState.graphData !== filteredData && filteredData.length) {
        return {
          graphData: filteredData,
        };
      }
      return null;
    });
  }

  render() {
    const datapoint = this.props.datapoint;
    const isVisible = this.props.isSelected && this.state.graphData && this.state.graphData.length;

    return (
      <React.Fragment>
        <tr
          className={isVisible ? 'table-secondary' : undefined}
          onClick={this.onRowClick}
        >
          <td className="text-nowrap">
            <img
              src={`https://www.pathofexile.com/image/ladder/${datapoint.datapoint.online ? 'online' : 'offline'}.png`}
              title={datapoint.datapoint.online ? 'Online' : 'Offline'} width={15} height={15}
            />
            {' '}
            <span>{datapoint.datapoint.globalRank || '15000+'}</span>
            {datapoint.previousDatapoint &&
              (datapoint.previousDatapoint.globalRank || 15001) !== (datapoint.datapoint.globalRank || 15001) && (
                <React.Fragment>
                  {' '}
                  <small
                    title={
                      datapoint.previousDatapoint && datapoint.previousDatapoint.timestamp ?
                        `Compared to: ${new Date(datapoint.previousDatapoint.timestamp).toLocaleString()}` :
                        undefined
                    }
                    className={
                      'badge ' + (
                        (datapoint.datapoint.globalRank || 15001) < (datapoint.previousDatapoint.globalRank || 15001) ?
                          'badge-success' : 'badge-danger')}
                  >
                    {String.fromCharCode(
                      (datapoint.datapoint.globalRank || 15001) > (datapoint.previousDatapoint.globalRank || 15001) ?
                        8595 : 8593)}
                    {' '}
                    {Math.abs(
                      (datapoint.datapoint.globalRank || 15001) -
                      (datapoint.previousDatapoint.globalRank || 15001))}
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
                <span
                  title={
                    datapoint.previousDatapoint && datapoint.previousDatapoint.timestamp ?
                      `Compared to: ${new Date(datapoint.previousDatapoint.timestamp).toLocaleString()}` :
                      undefined
                  }
                  className="badge badge-success"
                >
                  +{datapoint.datapoint.level - datapoint.previousDatapoint.level}
                </span>
                {' '}
              </React.Fragment>
            )}
            <span title={`XP: ${datapoint.datapoint.experience.toLocaleString()}`}>
              {datapoint.datapoint.level}
            </span>
          </td>
        </tr>
        {isVisible && (
          <tr>
            <td colSpan={4} className="bg-light">
              <GlobalrankGraphComponent
                graphData={this.state.graphData}
              />
            </td>
          </tr>
        ) || null}
      </React.Fragment>
    );
  }
}
