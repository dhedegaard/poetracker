import React from 'react';
import ReactDOM from 'react-dom';

import MainComponent, { IMainComponentProps } from './main.component';

const initialPayload = (window as any).InitialPayload as IMainComponentProps;

ReactDOM.render(
  <MainComponent
    accounts={initialPayload ? initialPayload.accounts : null}
    latestDatapoints={initialPayload ? initialPayload.latestDatapoints : null}
    leagues={initialPayload ? initialPayload.leagues : null}
  />,
  document.getElementById('app'),
);
