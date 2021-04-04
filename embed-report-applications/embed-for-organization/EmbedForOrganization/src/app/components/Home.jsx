import React from 'react'
import ReportFrame from './ReportFrame'
import * as Config from '../config/Config'

export default class Home extends React.Component {
	constructor(props) {
		super(props)
	}

	render = () =>
		<div>
			<ReportFrame
				access_token={this.props.access_token}
				report={Config.reports.correlations}
			/>
		</div>
}