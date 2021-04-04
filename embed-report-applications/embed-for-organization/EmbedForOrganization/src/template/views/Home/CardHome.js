import React from "react";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import Card from "../../components/Card/Card";
import CardHeader from "../../components/Card/CardHeader";
import CardIcon from "../../components/Card/CardIcon";
import * as config from "../../../app/config/Config";
import ReportContainer from "../../../app/components/ReportContainer";
import {Button, CardContent, Typography, withStyles} from "@material-ui/core";
import CardFooter from "../../components/Card/CardFooter";
import authenticate from "../../../app/common/Authenticate";

const ColorButton = withStyles((theme) => ({
    root: {
        backgroundColor: "var(--color-main)",
        color: "var(--color-text-title)",
        '&:hover': {
            backgroundColor: "var(--color-background)",
        },
    },
}))(Button);
const dashBoard=(accessToken)=>{return (<GridContainer>
    <GridItem xs={12} sm={12} md={8}>
        <Card>
            <CardHeader color="warning" stats icon>
                <CardIcon color="warning">
                    {config.reports["countries"].title}
                </CardIcon>
                <ReportContainer
                    access_token={accessToken}
                    report_id={config.reports["countries"].id}
                    show_pages = {config.reports["countries"].showPages}
                />
            </CardHeader>
        </Card>
    </GridItem>
    <GridItem xs={12} sm={12} md={4}>
        <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                <Card>
                    <CardHeader color="warning" stats icon>
                        <CardIcon color="warning">
                            {config.reports["last_15_days"].title}
                        </CardIcon>
                        <ReportContainer
                            access_token={accessToken}
                            report_id={config.reports["last_15_days"].id}
                            show_pages = {config.reports["last_15_days"].showPages}
                        />
                    </CardHeader>
                </Card>
            </GridItem>
            <GridItem xs={12} sm={12} md={12}>
                <Card>
                    <CardHeader color="warning" stats icon>
                        <CardIcon color="warning">
                            {config.reports["correlations"].title}
                        </CardIcon>
                        <ReportContainer
                            access_token={accessToken}
                            report_id={config.reports["correlations"].id}
                            show_pages = {config.reports["correlations"].showPages}
                        />
                    </CardHeader>
                </Card>
            </GridItem>
        </GridContainer>
    </GridItem>
</GridContainer>)};
const notLoggedIn=
    <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
            <Card>
                <CardHeader>
                    <Typography variant={"h4"} style={{"color":"#fc4c02"}} component={"p"}> COVID Data
                        Engineering </Typography>
                </CardHeader>
                <CardContent>
                    <Card>
                        <CardContent>
                            <Typography variant="body1" component="p">
                                The objective is to identify the impact of different factors in the
                                COVID-19 pandemic evolution and how its evolution is reflected in social
                                networks, in this case Twitter. For this purpose, we collected,
                                via public APIs, daily information on incoming flights, weather
                                temperatures, traffic and mobility data, also tweets with the tag
                                #covid and, of course, data on the pandemic spread (new cases and demises) .
                                All the mentioned before applied for 5 main countries: Japan, Spain,
                                France, United States and Brazil.
                            </Typography>
                        </CardContent>
                    </Card>
                </CardContent>
                <CardFooter style={{"justifyContent":"center "}}>
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={12}>
                            <ColorButton onClick={()=>{authenticate(true)}}>Log-In</ColorButton>
                        </GridItem>
                    </GridContainer>
                </CardFooter>
            </Card>
        </GridItem>
    </GridContainer>
;

const CardHome= (props)=>{
    return (
        <div className="report_frame">
            {(props.access_token? dashBoard(props.access_token) : notLoggedIn)}
        </div>
    )

}

export default CardHome