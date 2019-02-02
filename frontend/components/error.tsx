import * as React from "react";

export interface IErrorProps {
  error: string;
}

const Error = (props: IErrorProps) => {
  if (!props.error) {
    return null;
  }

  const onClick = () => {
    window.location.reload();
  };

  return (
    <>
      <div className="alert alert-danger">
        <b>Error</b>: {props.error}
        {" "}
        <a
          onClick={onClick}
          className="text-primary"
          href="javascript:void(0);"
        >
          <b>Reload page</b>
        </a>
      </div>
      <hr />
    </>
  );
};
export default Error;
