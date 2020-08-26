import React from 'react';
import Row from '../row';
import { PersonDetails, PersonList } from '../sw-components'
import { withRouter, Route } from 'react-router-dom';

const PeoplePage = ({ history, match }) => {
  const { id } = match.params;
  
  
  return (
    
    <div>
      <Route path="/people" 
            render={() => <h2>People</h2>}
            exact={true} />

      <Row 
      left={<PersonList onItemSelected={(id) => history.push(id)} />}
      right={<PersonDetails itemId={id} />} />
    </div>
      
  )
};



export default withRouter(PeoplePage);