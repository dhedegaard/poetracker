import * as React from 'react';

export interface IErrorProps {
  error: string;
}

const Error = (props: IErrorProps) => {
  if (!props.error) {
    return null;
  }
  return (
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
  );
};
export default Error;
