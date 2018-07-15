import React from 'react';

import CharacterTable from './character-table';
import Filter from './filter';

export interface IProps {
  error: string;
  leagues: poetracker.ILeagueType[];
  datapoints: poetracker.IDatapointResult[];
  accounts: poetracker.IAccountType[];
  selectedLeague: string;
  getCharData?: (leagueId: string, charname: string) => Promise<poetracker.IDatapoint[]>;
  forceUpdate: () => void;
}

const Main = (props: IProps) => {
  const filterComponent = React.createRef<Filter>();

  const datapoints = (filterComponent.current || new Filter({} as any))
    .filterDatapoints(props.datapoints);

  return (
    <React.Fragment>
      {props.leagues && props.leagues.length && (
        <React.Fragment>
          {props.error && (
            <React.Fragment>
              <div className="alert alert-danger">
                <b>Error</b>: {props.error}
                {' '}
                <a onClick={() => { window.location.reload(); }}
                  className="text-primary" href="javascript:void(0);">
                  <b>Reload page</b>
                </a>
              </div>
              <hr />
            </React.Fragment>
          )}
          <Filter
            accounts={props.accounts}
            onFilterChanged={props.forceUpdate}
            leagues={props.leagues}
            ref={filterComponent}
          />
          <hr />
          <CharacterTable
            leagues={props.leagues}
            datapoints={datapoints}
            selectedLeague={props.selectedLeague}
            getCharData={props.getCharData}
          />
        </React.Fragment>
      ) || (
          // No data yet.
          <React.Fragment>
            <br />
            <div className="alert alert-info text-center">Loading data...</div>
          </React.Fragment>
        )}
    </React.Fragment>
  );
};
export default Main;
