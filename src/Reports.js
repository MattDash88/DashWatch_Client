import React from 'react';

import './assets/fomantic/dist/semantic.css';
import {
  Container,
  Dropdown,
  Label,
  Form,
  Checkbox,
  Segment,
  Table,
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

// Analytics
import { trackPage, trackEvent } from './components/functions/analytics';

// Import pages

// Import css


// Import other elements 
//import Header from '../components/headers/IndexHeader';
//import ScrollButton from '../components/elements/ScrollButton';  // Scroll to top button

// API query requesting Report List data
const getMonthList = (year, month) => {
    return (
        new Promise((resolve) => {
            fetch(`http://localhost:8080/dataset/reportList`)
                .then((res) => res.json()
                    .then((res) => {
                        resolve(res.data)
                    })
                )
        })
    )
}

class Month extends React.Component {
    static async getInitialProps(ctx) {
        const props = {
            month: ctx.query.month,   
            year: ctx.query.year,
            url: ctx.pathname,
            as: ctx.asPath,
        }
        return props
    }

    constructor(props) {
        super(props);

        this.state = {
            monthId: props.month,
            monthListData: '',
            optOutListData: '',
            url: '/reports',
            as: props.as,
        }

        // Bind functions used in class
        this.handleSelectMonth = this.handleSelectMonth.bind(this);
        this.callEvent = this.callEvent.bind(this);
    }

    // Function initiated when a month list button is pressed
    handleSelectMonth(event) {
        event.preventDefault();
        this.setState({
            monthId: event.currentTarget.id,        // Change state to load different month
            as: `/reportlist?month=${event.currentTarget.id}`,
        })

        window.history.pushState(this.state, '', `/reportlist?month=${event.currentTarget.id}`)   // Push State to history
        trackEvent('Reports Page', 'Changed Month')                 // Track Event on Google Analytics    
    }

    // Google Analytics function to track User interaction on page
    callEvent(event) {
        event.preventDefault();
        trackEvent('Reports Page','clicked ' + event.currentTarget.className)
    }

    componentDidMount() {
        // To handle calls from history (forward and back buttons)
        onpopstate = event => {
            if (event.state) {
                this.setState(event.state)
            }
        }
       
        trackPage(`/reports`)   // Track Pageview in Analytics

        // Promise to get the initial "month list" records 
        Promise.resolve(getMonthList()).then(data => {
            this.setState({
                monthListData: data.report_list,
                optOutListData: data.opted_out_list,
            })
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.monthId !== this.state.monthId) {// Just a history state update because it doesn't always work as desired in functions
            window.history.replaceState(this.state, '', `${this.state.as}`)
        }
    }

    render() {
        const { // Declare data arrays used in class
            monthListData,
            optOutListData,
            monthId,
        } = this.state

        let monthText
        if (monthId == "Nov19") {
            monthText = "Dash Watch November 2019 Reports"
        } else if (monthId == "Dec19") {
            monthText = "Dash Watch December 2019 Reports"
        } else if (monthId == "Jan20") {
            monthText = "Dash Watch January 2020 Reports"
        } else if (monthId == "Feb20") {
            monthText = "Dash Watch February 2020 Reports"
        } else {
            monthText = "Please select a month tab to view reports"
        }

        console.log(monthListData)

        // Still loading Airtable data
        return (
            <Container fluid>
               <Segment>
               {
                    (monthListData.length !== 0 ) && (
               <Table selectable singleLine unstackable fixed>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Proposal</Table.HeaderCell>
                        <Table.HeaderCell textAlign='right'>Report Link</Table.HeaderCell>
                        <Table.HeaderCell textAlign='right'>Proposal Type</Table.HeaderCell>
                        <Table.HeaderCell textAlign='right'>Voting Status</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {monthListData.map((row) =>
                        <Table.Row key={row.list_data.id}>
                            <Table.Cell textAlign='left'>{row.list_data.project_name} by {row.list_data.proposal_owner}</Table.Cell>
                            <Table.Cell textAlign='center'>Placeholder</Table.Cell>
                            <Table.Cell textAlign='center'>{row.list_data.proposal_type}</Table.Cell>
                            <Table.Cell textAlign='center'>Placeholder</Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
                    )
                    }
               </Segment>
            </Container>
        )

    }
}



export default Month