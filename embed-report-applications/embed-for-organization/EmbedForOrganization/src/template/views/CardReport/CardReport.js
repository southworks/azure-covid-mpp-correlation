import GridItem from "../../components/Grid/GridItem";
import Card from "../../components/Card/Card";
import CardHeader from "../../components/Card/CardHeader";
import CardIcon from "../../components/Card/CardIcon";
import CardFooter from "../../components/Card/CardFooter";
import GridContainer from "../../components/Grid/GridContainer";

import ReportContainer from "../../../app/components/ReportContainer";
import styles from "../../assets/jss/material-dashboard-react/layouts/adminStyle";
import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";

const CardReport=(props) => {
    const useStyles = makeStyles(styles);
    const classes = useStyles();
    return (

        <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                <Card>
                    <CardHeader color="warning" stats icon>
                        <CardIcon color="warning">
                            {props.report.title}
                        </CardIcon>
                        <ReportContainer
                            access_token={props.access_token}
                            report_id={props.report.id}
                            show_pages = {props.report.showPages}
                        />
                    </CardHeader>
                    <CardFooter stats>
                        <div className={classes.stats}>
                            {props.report.description}
                        </div>
                    </CardFooter>
                </Card>
            </GridItem>
        </GridContainer>
    )
}
export default CardReport;
