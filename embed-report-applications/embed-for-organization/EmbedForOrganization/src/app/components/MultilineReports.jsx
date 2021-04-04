import React from 'react'
import ReportFrame from './ReportFrame'
import { reports } from '../config/Config'

export default class MultilineReports extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div>
				<ReportFrame report={reports.temp_jam_flights_demises_cases} access_token={this.props.access_token} />
				<ReportFrame report={reports.temp_flights_mobility_cases} access_token={this.props.access_token} />
			</div>
		)
	}
}
