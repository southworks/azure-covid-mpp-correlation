import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import ReportFrame from "../components/ReportFrame";
import * as config from "../config/Config";
import Content from "../../template/views/Content/Content";
import "./App.css";
import CardHome from "../../template/views/Home/CardHome";
import Authenticate from "../common/Authenticate";

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = { accessToken : null }
	}

	render() {
		return (
			<div className="app">
				<Router>
					<Content>
						<Switch>
							<Route exact={true} path="/webapp-internal/index.html/">
								<CardHome access_token={this.state.accessToken}/>
							</Route>
							<Route exact path="/webapp-internal/index.html/multiline">
								<ReportFrame report={config.reports.temp_jam_flights_demises_cases} access_token={this.state.accessToken} />
								<ReportFrame report={config.reports.temp_flights_mobility_cases} access_token={this.state.accessToken} />
							</Route>
							<Route exact path="/webapp-internal/index.html/tweets">
								<ReportFrame report={config.reports.tweets_demises_cases} access_token={this.state.accessToken} />
							</Route>
							<Route exact path="/webapp-internal/index.html/time">
								<ReportFrame report={config.reports.last_15_days}  access_token={this.state.accessToken}/>
								<ReportFrame report={config.reports.forecast}  access_token={this.state.accessToken}/>
							</Route>
							<Route path="/webapp-internal/index.html/countries">
								<ReportFrame report={config.reports.countries} access_token={this.state.accessToken} />
							</Route>
							<Route exact path="/webapp-internal/index.html/correlations">
								<ReportFrame report={config.reports.correlations}  access_token={this.state.accessToken}/>
							</Route>
						</Switch>
					</ Content>
				</Router>
			</div>
		);
	}

	componentDidMount() {
		(async ()=>{
			const accessToken=await (new Authenticate().getToken());
			this.setState({accessToken : accessToken})
		})();

	}
}

export default App;
