import React from 'react';
import ReactDOM from 'react-dom';

import MainContainer, { IMainContainerProps } from "./containers/main";

const initialPayload = (window as any).InitialPayload as IMainContainerProps;

ReactDOM.render(
  <MainContainer
    accounts={initialPayload ? initialPayload.accounts : null}
    latestDatapoints={initialPayload ? initialPayload.latestDatapoints : null}
    leagues={initialPayload ? initialPayload.leagues : null}
  />,
  document.getElementById('app'),
);
