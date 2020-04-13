import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  matchPath,
//  useRouteMatch,
} from "react-router-dom";
import queryString from 'query-string';
//

//import './assets/fomantic/src/semantic.less';
import {
  Container,
  Dropdown,
  Label,
  Form,
  Checkbox,
  Segment,
  Button,
  Divider,
  TextArea,
  Input,
  Message,
  Dimmer,
  Tab,
  Menu,
  Sidebar,
  Grid,
} from 'semantic-ui-react';

import Reports from './Reports';
import Labs from './Labs';

// Import components
import NavBar from "./components/elements/NavBarNew"

var url = new URL(window.location);
var query = new URLSearchParams(document.location.search);

function App() {
  return (    
    <Router>
      <div>
          <NavBar 
            showPage = {url.pathname} 
            searchQuery = {query.get('search') !== query.get('search') ? this : '' }
            />
        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        <Switch>
          <Route exact path="/">
            <h1>blank</h1>
          </Route>
          <Route path="/reports" search='' render={() =>
          <Reports 
            month={query.get('month') !== null ? query.get('month') : '' }
            year={query.get('year') !== null ? query.get('year') : '' }
          /> } /> 
          <Route path="/about">
          <h1>About</h1>
          </Route>
          <Route path="/dashboard">
          <h1>Dashboard</h1>
          </Route>          
          <Route path="/labs" search='' render={() =>
          <Labs 
            tab={query.get('tab') !== null ? query.get('tab') : 'overview' }
          /> } />          
        </Switch>
      </div>
    </Router>
  );
}

export default App;
