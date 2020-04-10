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

// Import other elements 
//import Header from '../components/headers/IndexHeader';
//import ScrollButton from '../components/elements/ScrollButton';  // Scroll to top button

const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const getListOfMonths = () => {
    return (
        new Promise((resolve) => {
            fetch(`http://localhost:8080/list/listOfMonths`)
                .then((res) => {
                    resolve(res.json())
                })
        })
    )
}

// API query requesting Report List data
const getReleaseList = () => {
    return (
        new Promise((resolve) => {
            fetch(`http://localhost:8080/dataset/reportList`)
                .then((res) => {
                    resolve(res.json())
                })
        })
    )
}

function createDropdownList(monthObject) {
    try {
        var dropdownList = []
        Object.values(monthObject).map((item) => {
            dropdownList.push({
                key: item.month_name,
                value: item.month_name,
                text: `${month[item.month]} ${item.year}`,
            })
        })
        return dropdownList
    } catch (e) {
        return {
            key: 'error',
            value: '',
            text: 'Something went wrong',
        }
    }
}

class Month extends React.Component {
    static async getInitialProps(ctx) {
        const props = {
            month: ctx.query.month,   
            url: ctx.pathname,
            as: ctx.asPath,
        }
        return props
    }

    constructor(props) {
        super(props);

        this.state = {
            month: props.month,
            showType: 'table',
            listOfMonths: '',
            releaseListData: '',
            optOutListData: '',
            url: '/reports',
            as: props.as,
        }

        // Bind functions used in class
        this.handleMonthChange = this.handleMonthChange.bind(this);
        this.handleItemClick = this.handleItemClick.bind(this);
        this.callEvent = this.callEvent.bind(this);
    }

    // Function initiated when a month list button is pressed
    handleMonthChange(e, { value, text })  {
        e.preventDefault();
        this.setState({
            month: value,        // Change state to load different month
            //as: `/reportlist?month=${event.currentTarget.id}`,
        })

        //window.history.pushState(this.state, '', `/reportlist?month=${event.currentTarget.id}`)   // Push State to history
        //trackEvent('Reports Page', 'Changed Month')                 // Track Event on Google Analytics    
    }

    // Google Analytics function to track User interaction on page
    callEvent(e) {
        e.preventDefault();
        trackEvent('Reports Page','clicked ' + e.currentTarget.className)
    }

    // Google Analytics function to track User interaction on page
    handleItemClick(e, { name }) {
        e.preventDefault();
        this.setState({
            showType: name,
        })
    }

    componentDidMount() {
        // To handle calls from history (forward and back buttons)
        onpopstate = e => {
            if (e.state) {
                this.setState(e.state)
            }
        }
       
        trackPage(`/reports`)   // Track Pageview in Analytics

        // Promise to get the initial "month list" records 
        Promise.resolve(getListOfMonths()).then(data => {
            var dropdownList = []
            Object.values(data).map((item) => {
                dropdownList.push({
                    key: item.month_name,
                    value: item.month_name,
                    text: `${month[item.month-1]} ${item.year}`,
                })
            })
            this.setState({
                listOfMonths: dropdownList,
            })
        })

        // Promise to get the initial "month list" records 
        Promise.resolve(getReleaseList()).then(data => {
            this.setState({
                releaseListData: data,
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
            releaseListData,
            optOutListData,
            listOfMonths,
            showType,
        } = this.state

        // Still loading Airtable data
        return (
            <Container>
    <Menu>
        <Menu.Item
          name='table'
          active={showType === 'table'}
          onClick={this.handleItemClick}
        >
          Editorials
        </Menu.Item>

        <Menu.Item
          name='grid'
          active={showType === 'grid'}
          onClick={this.handleItemClick}
        >
          Reviews
        </Menu.Item>
    </Menu>
    <Dropdown
        placeholder='Select a month'
        scrolling
        search
        clearable
        multiple
        selection
        options={listOfMonths}
        onChange={this.handleMonthChange}
    />
      {
                  showType == 'table' &&
               <Segment>
               {
                    (releaseListData.length !== 0 ) && (
               <Table selectable singleLine unstackable compact>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Proposal</Table.HeaderCell>
                        <Table.HeaderCell textAlign='center'>Report Link</Table.HeaderCell>
                        <Table.HeaderCell textAlign='center'>Proposal Type</Table.HeaderCell>
                        <Table.HeaderCell textAlign='center'>Voting Status</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {releaseListData.map((row) =>
                        <Table.Row key={row.unique_id}>
                            <Table.Cell textAlign='left'>{row.project_name} by {row.proposal_owner}</Table.Cell>
                            <Table.Cell textAlign='center'><a href={row.report_link}>LINK</a></Table.Cell>
                            <Table.Cell textAlign='center'>{row.proposal_type}</Table.Cell>
                            <Table.Cell textAlign='center'>Placeholder</Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
                    )
                    }
               </Segment>
    }
    {
                  showType == 'grid' &&
               <Segment>
               {
                    (releaseListData.length !== 0 ) && (
               <Grid columns={4} divided='vertically'>
                <Grid.Row>
                        <Grid.Column><h3>Proposal</h3></Grid.Column>
                        <Grid.Column textAlign='center'><h3>Report Link</h3></Grid.Column>
                        <Grid.Column textAlign='center'><h3>Proposal Type</h3></Grid.Column>
                        <Grid.Column textAlign='center'><h3>Voting Status</h3></Grid.Column>
                </Grid.Row>
                    {releaseListData.map((row) =>
                        <Grid.Row key={row.unique_id}>
                            <Grid.Column textAlign='left'>{row.project_name} by {row.proposal_owner}</Grid.Column>
                            <Grid.Column textAlign='center'><a href={row.report_link}>LINK</a></Grid.Column>
                            <Grid.Column textAlign='center'>{row.proposal_type}</Grid.Column>
                            <Grid.Column textAlign='center'>Placeholder</Grid.Column>
                        </Grid.Row>
                    )}
            </Grid>
                    )
                    }
               </Segment>
    }
            </Container>
        )

    }
}



export default Month