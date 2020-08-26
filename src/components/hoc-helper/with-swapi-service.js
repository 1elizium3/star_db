import React from 'react';
import { SwapiServiceConsumer } from '../swapi-service-context';

const withSwapiService = (mapMethodsToProps) => (Wrapped) => {
  function WithSwapiService(props) {
    return (
      <SwapiServiceConsumer>
        {
          (swapiService) => {
            const serviceProps = mapMethodsToProps(swapiService);

            return (
              <Wrapped {...props} {...serviceProps} />
            )
          }
        }
      </SwapiServiceConsumer>
    )
  };
  return WithSwapiService;
};

export default withSwapiService;