import React, {useEffect, useState} from 'react'
import GridItem from "../../template/components/Grid/GridItem";
import Card from "../../template/components/Card/Card";
import CardHeader from "../../template/components/Card/CardHeader";
import CardIcon from "../../template/components/Card/CardIcon";
import ReportContainer from "./ReportContainer";
import CardFooter from "../../template/components/Card/CardFooter";
import GridContainer from "../../template/components/Grid/GridContainer";
import makeStyles from "@material-ui/core/styles/makeStyles";
import styles from "../../template/assets/jss/material-dashboard-react/layouts/adminStyle";

const ReportFrame = (props)=> {

	const [reportProperties, setReportProperties] = useState(null);
	useEffect(() => {
		setReportProperties(null)
		if (props && props.report && props.report.id)
			setReportProperties({...props});
	}, [props]);
	const useStyles = makeStyles(styles);
	const classes = useStyles();
	if (!reportProperties) return (<div></div>);
	return (
		<div className="report_frame">
			<GridContainer>
				<GridItem xs={12} sm={12} md={12}>
					<Card>
						<CardHeader color="warning" stats icon>
							<CardIcon color="warning">
								{reportProperties.report.title}
							</CardIcon>
							<ReportContainer
								access_token={props.access_token}
								report_id={reportProperties.report.id}
								show_pages = {reportProperties.report.showPages}
							/>
						</CardHeader>
						<CardFooter stats>
							<div className={classes.stats}>
								{reportProperties.report.description}
							</div>
						</CardFooter>
					</Card>
				</GridItem>
			</GridContainer>
		</div>
	)
}

export default ReportFrame;

