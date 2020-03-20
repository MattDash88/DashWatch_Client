import React from 'react';

import './assets/fomantic/dist/semantic.css';
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

// Import other elements 
import NavBar from "./components/elements/NavBarNew"

class Labs extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Container fluid>
                <NavBar
          showPage="elections"
        />
        <h1>This is a new page</h1>
            </Container>
        )
    }
}