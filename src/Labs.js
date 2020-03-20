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

// Analytics
import { trackPage, trackEvent } from './components/functions/analytics';

// Import css

// Import other elements 
//import Header from './components/headers/LabsHeader';
import LabsOverview from "./components/labs_content/Overview";
import Wallets from "./components/labs_content/Wallets";
import Websites from "./components/labs_content/Websites";
//import KpiExplorer from "../components/labs_content/KpiExplorer";

const getCountryList = () => {
  return (
    new Promise((resolve) => {
      fetch(`http://localhost:8080/api/dataset/labsCountryList`)
        .then((res) => res.json()
          .then((res) => {
            resolve(res)
          })
        )
    })
  )
}

class Labs extends React.Component {
  static async getInitialProps(ctx) {

    const props = {
      tab: typeof ctx.query.tab == 'something' ? "overview" : ctx.query.tab,        // Default tab is explorer
      project: typeof ctx.query.project == "undefined" ? 0 : ctx.query.project,     // Default project is the first in the list
      kpi: typeof ctx.query.kpi == "undefined" ? 0 : ctx.query.kpi,                 // Default kpi is the first in the list
      country: typeof ctx.query.country == "undefined" ? 'Brazil' : ctx.query.country,  // Default country is the first alphabetically
      chart: ctx.query.chart,
      url: ctx.pathname,
      as: ctx.asPath,
    }
    return props
  }


  constructor(props) {
    super(props)

    this.state = {
      countryList: '',
      view: 'largeScreen',
      showSidebar: false,

      // States that can be set by queries 

      // Booleans for POS systems

      // Booleans for Wallets

      activeTab: props.tab,
      url: '/labs',
      as: props.as,
    }

    // Binding functions in this class
    this.handleSelectTab = this.handleSelectTab.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
  }

  handleSelectTab(event, { name }) {
    event.preventDefault();
    this.setState({
      activeTab: name,
      as: `/labs?tab=${name}`,
    })
    window.history.pushState(this.state, '', `/labs?tab=${name}`)     // Push State to history
    trackEvent('Labs Page', `Changed Tab to ${name}`)                 // Track Event on Google Analytics
  }

  toggleSidebar(event, { name }) {
    event.preventDefault();
    this.setState({
      showSidebar: !this.state.showSidebar,
    })
    trackEvent('Labs Page', `Changed Tab to ${name}`)                 // Track Event on Google Analytics
  }

  componentDidMount() {
    // To handle calls from history (forward and back buttons)
    onpopstate = event => {
      if (event.state) {
        this.setState(event.state)
      }
    }
    var countryListPromise = Promise.resolve(getCountryList())

    Promise.all([countryListPromise]).then(data => {
      var countryListData = data[0]

      this.setState({
        countryList: countryListData,
      })
    })//.then(history.replaceState(this.state, '', `${this.state.as}`))
    trackPage(`/labs`)  // Track Pageview in Analytics
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.labsData !== this.state.labsData || prevState.labsTabId !== this.state.labsTabId || prevState.showPosChart !== this.state.showPosChart || prevState.showWalletChart !== this.state.showWalletChart
      || prevState.showWalletType !== this.state.showWalletType || prevState.showWalletCountry !== this.state.showWalletCountry) {// Just a history state update because it doesn't always work as desired in functions
      window.history.replaceState(this.state, '', `${this.state.as}`)
    }
  }

  render() {
    const { // Declare data arrays used in class
      view,
      countryList,
      activeTab,
    } = this.state

    return (
      <Container fluid>
        <section style={{
          marginTop: '10px',
        }}>
          <Menu>
              <Menu.Item 
              name='overview'
              content='Overview'
              onClick={this.handleSelectTab}
              />
            <Menu.Item 
            name='wallets'
            content='Wallets'
            onClick={this.handleSelectTab}
            />
              <Menu.Item 
            name='websites'
            content='Websites'
            onClick={this.handleSelectTab}
            />
            <Menu.Item
              name='kpiExplorer'
              active={activeTab === 'kpiExplorer'}
              onClick={this.handleSelectTab}
            >
              KPI Explorer
              </Menu.Item>
          </Menu>
        </section>
        {
            (countryList.length !== 0 && view == 'largeScreen') && (
              <section>
                {
                  activeTab == 'overview' &&
                  <LabsOverview
                    countryList={countryList}
                  />
                }
                {
                  activeTab == 'wallets' &&
                  <Wallets
                    countryList={countryList}
                  />
                }
                {
                  activeTab == 'websites' &&
                  <Websites
                    countryList={countryList}
                  />
                }
               
              </section>
            ) || (<Segment loading height={20} />)
          }        
      </Container>
    )
  }
}

export default Labs