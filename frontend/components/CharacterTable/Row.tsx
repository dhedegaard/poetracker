import React from "react";
import styled from "styled-components";

import CharacterGraphContainer from "../../containers/character-graph";

const TwitchBadge = styled.a`
  &,
  &:link,
  &:visited,
  &:hover,
  &:active {
    background-color: #4b367c !important;
  }
`;

interface IProps {
  datapoint: poetracker.IDatapointResult;
  getCharData?: (
    leagueId: string,
    charname: string,
  ) => Promise<poetracker.IDatapoint[]>;
  clickedRow: (charname: string, leagueId: string) => void;
  isSelected: boolean;
}

const Row = (props: IProps) => {
  const { datapoint, isSelected } = props;

  const onRowClick = () => {
    props.clickedRow(
      props.datapoint.datapoint.charname,
      props.datapoint.datapoint.leagueId,
    );
  };

  return (
    <>
      <tr
        className={isSelected ? "table-active" : undefined}
        onClick={onRowClick}
      >
        <td className="text-nowrap">
          <img
            src={`/${datapoint.datapoint.online ? "online" : "offline"}.png`}
            title={datapoint.datapoint.online ? "Online" : "Offline"}
            width={15}
            height={15}
          />{" "}
          <span>{datapoint.datapoint.globalRank || "15000+"}</span>
          {datapoint.previousDatapoint &&
            (datapoint.previousDatapoint.globalRank || 15001) !==
              (datapoint.datapoint.globalRank || 15001) && (
              <>
                {" "}
                <small
                  title={
                    datapoint.previousDatapoint &&
                    datapoint.previousDatapoint.timestamp
                      ? `Compared to: ${new Date(
                          datapoint.previousDatapoint.timestamp,
                        ).toLocaleString()}`
                      : undefined
                  }
                  className={
                    "badge " +
                    ((datapoint.datapoint.globalRank || 15001) <
                    (datapoint.previousDatapoint.globalRank || 15001)
                      ? "badge-success"
                      : "badge-danger")
                  }
                >
                  {String.fromCharCode(
                    (datapoint.datapoint.globalRank || 15001) >
                      (datapoint.previousDatapoint.globalRank || 15001)
                      ? 8595
                      : 8593,
                  )}{" "}
                  {Math.abs(
                    (datapoint.datapoint.globalRank || 15001) -
                      (datapoint.previousDatapoint.globalRank || 15001),
                  )}
                </small>
              </>
            )}
        </td>
        <td
          className="text-nowrap"
          title={
            `Account name: ${datapoint.datapoint.accountId}\n` +
            `League: ${datapoint.datapoint.leagueId}`}
        >
          <div className="float-right d-none d-sm-block">
            {datapoint.datapoint.account.twitchURL && (
              <>
                <TwitchBadge
                  href={datapoint.datapoint.account.twitchURL}
                  target="_blank "
                  rel="nofollow noreferrer"
                  className="badge badge-dark"
                  title={`Twitch username: ${
                    datapoint.datapoint.account.twitchUsername
                  }`}
                >
                  Twitch
                </TwitchBadge>{" "}
              </>
            )}
            <a
              href={datapoint.datapoint.poeProfileURL}
              target="_blank"
              rel="nofollow noreferrer"
              className="badge badge-info"
            >
              Profile
            </a>
          </div>
          {datapoint.datapoint.charname}
          {datapoint.datapoint.dead && (
            <>
              {" "}
              <small className="badge badge-danger">Dead</small>
            </>
          )}
        </td>
        <td>{datapoint.datapoint.class}</td>
        <td className="text-right text-nowrap">
          {datapoint.previousDatapoint &&
            datapoint.previousDatapoint.level !== datapoint.datapoint.level && (
              <>
                <span
                  title={
                    datapoint.previousDatapoint &&
                    datapoint.previousDatapoint.timestamp
                      ? `Compared to: ${new Date(
                          datapoint.previousDatapoint.timestamp,
                        ).toLocaleString()}`
                      : undefined
                  }
                  className="badge badge-success"
                >
                  +
                  {datapoint.datapoint.level -
                    datapoint.previousDatapoint.level}
                </span>{" "}
              </>
            )}
          <span
            title={`XP: ${datapoint.datapoint.experience.toLocaleString()}`}
          >
            {datapoint.datapoint.level}
          </span>
        </td>
      </tr>
      {(isSelected && (
        <tr>
          <td colSpan={4} className="bg-light">
            <CharacterGraphContainer />
          </td>
        </tr>
      )) ||
        null}
    </>
  );
};
export default Row;
