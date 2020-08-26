import React from 'react';

const withChildFunction = (fn) => (Wrapped) => {
  function WithChildFunction(props) {
    return (
      <Wrapped {...props}>
        {fn}
      </Wrapped>
    )
  }
  return WithChildFunction;
};

export default withChildFunction;