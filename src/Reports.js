import React from 'react';

//import './assets/fomantic/src/semantic.less';
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
        new Promise((resolve, reject) => {
            fetch(`http://localhost:8080/list/listOfMonths`)
                .then((res) => {
                    resolve(res.json())
                }).catch((error) => {
                    reject({ error })
                })
        })
    )
}

// API query requesting Report List data
const getReleaseList = (monthId) => {
    return (
        new Promise((resolve, reject) => {
            fetch(`http://localhost:8080/dataset/releaseList?month=${monthId}`)
                .then((res) => {
                    resolve(res.json())
                }).catch((error) => {
                    reject({ error })
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
                text: `${month[item.month - 1]} ${item.year}`,
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

// Function to search an Object for a value
function lookupObjectValueFunction(value, key, list) {
    var returnList
    Object.values(list).map((item) => {
        if (item[key] == value) {
            returnList = item
        }
    })
    if (typeof returnList !== 'undefined') {
        return returnList
    } else {
        return "Match not found"
    }
    
}

class Month extends React.Component {
    static async getInitialProps(ctx) {
        const props = {
            monthId: ctx.query.month,
            url: ctx.pathname,
            as: ctx.asPath,
        }
        return props
    }

    constructor(props) {
        super(props);

        this.state = {
            monthId: props.month,
            monthName: undefined,
            listOfMonths: '',
            url: '/reports',
            as: props.as,
        }

        // Bind functions used in class
        this.callEvent = this.callEvent.bind(this);
    }  

    // Google Analytics function to track User interaction on page
    callEvent(e) {
        e.preventDefault();
        trackEvent('Reports Page', 'clicked ' + e.currentTarget.className)
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
            var monthList = createDropdownList(data)

            // Code to set monthId and month name
            var monthId
            var monthName

            // If a month query is provided look for the related attributes in the list
            if (this.state.monthId !== '') {
                var targetMonthObject = lookupObjectValueFunction(this.state.monthId, 'value', monthList) 
                monthId = targetMonthObject.value
                monthName = targetMonthObject.text
            } else {    // If no month query is provided, default to the latest month
                monthId = monthList[monthList.length - 1].value
                monthName = monthList[monthList.length - 1].text
            }

            this.setState({
                listOfMonths: monthList,
                monthId: monthId,
                monthName: monthName,
            })
        }).catch((error) => {
            this.setState({
                listOfMonths: [],
                monthId: '',
                monthName: 'Error: something went wrong creating the list',
            })
        })
    }

    render() {
        const { // Declare data arrays used in class
            monthId,
            monthName,
            listOfMonths,
            showType,
        } = this.state

        return (
            <Container>                    
                    {
                        (listOfMonths.length !== 0) && (
                            <ReleaseTable
                                monthId={monthId}
                                monthName={monthName}
                                listOfMonths={listOfMonths}
                            />
                        )
                    }
            </Container>
        )

    }
}

class ReleaseTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            monthId: props.monthId,
            monthName: props.monthName,
            showType: 'grid',
            releaseListData: '',
            listOfMonths: props.listOfMonths,
        }

        // Bind functions used in class
        this.handleMonthChange = this.handleMonthChange.bind(this);
        this.handleItemClick = this.handleItemClick.bind(this);
        this.callEvent = this.callEvent.bind(this);
    }

    // Function initiated when a month list button is pressed
    handleMonthChange(e, { value, text }) {
        var monthData = lookupObjectValueFunction(value, 'value', this.state.listOfMonths)       
        console.log(monthData)
        this.setState({
            monthId: value,        // Change state to load different month
            monthName: monthData.text,
//            as: `/reports?month=${value}`,
        })
    }

    // Google Analytics function to track User interaction on page
    callEvent(e) {
        e.preventDefault();
        trackEvent('Reports Page', 'clicked ' + e.currentTarget.className)
    }

    // Google Analytics function to track User interaction on page
    handleItemClick(e, { name }) {
        e.preventDefault();
        this.setState({
            showType: name,
        })
    }

    componentDidMount() {
        Promise.resolve(getReleaseList(this.state.monthId)).then(data => {
            this.setState({
                releaseListData: data,
            })
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.monthId !== this.state.monthId) {
            Promise.resolve(getReleaseList(this.state.monthId)).then(data => {
                this.setState({
                    releaseListData: data,
                })
            })
        }
        
    }

    render() {
        const { // Declare data arrays used in class                        
            releaseListData,

            showType,
            monthName,
        } = this.state

        const { // Declare data arrays used in class                        
            listOfMonths,
        } = this.props

        return (
            <main>
                <Menu pointing secondary color={'blue'} attached='top' widths={5}>
                    <Menu.Item
                        name='table'
                        position='left'
                        as={Button}
                        size='massive'
                        active={showType === 'table'}
                        onClick={this.handleItemClick}
                    >
                        Editorials
                </Menu.Item>

                    <Menu.Item
                        name='grid'
                        position='left'
                        as={Button}
                        size='massive'
                        active={showType === 'grid'}
                        onClick={this.handleItemClick}
                    >
                        Reviews
                    </Menu.Item>
                </Menu>
                <Segment attached='bottom'>
                <Dropdown
                                placeholder='Select a month'
                                scrolling
                                search
                                clearable
                                selection
                                size='huge'
                                options={listOfMonths}
                                onChange={this.handleMonthChange}
                />
                <Divider />
                    <h2>Reports for {monthName}</h2>
                {
                    (releaseListData.length !== 0) && (
                        <Grid columns={4} divided='vertically'>
                            <Grid.Row>
                                <Grid.Column><h3>Proposal</h3></Grid.Column>
                                <Grid.Column textAlign='center'><h3>Report Link</h3></Grid.Column>
                                <Grid.Column textAlign='center'><h3>Proposal Type</h3></Grid.Column>
                                <Grid.Column textAlign='center'><h3>Voting Status</h3></Grid.Column>
                            </Grid.Row>
                            {releaseListData.map((row) =>
                                <Grid.Row key={row.unique_id}>
                                    <Grid.Column textAlign='left'>
                                        {row.project_name}
                                        <Divider fitted hidden />
                                        BY {row.proposal_owner}
                                    </Grid.Column>
                                    <Grid.Column textAlign='center'><a href={row.report_link}>LINK</a></Grid.Column>
                                    <Grid.Column textAlign='center'>{row.proposal_type}</Grid.Column>
                                    <Grid.Column textAlign='center'><a href={row.voting_link}>{row.voting_status}</a></Grid.Column>
                                </Grid.Row>
                            )}
                        </Grid>
                    )
                }
                </Segment>
            </main>
        )
    }
}

export default Month