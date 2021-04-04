import React from "react";
import {
  AuthenticationState,
  AzureAD,
  IAzureADFunctionProps,
} from "react-aad-msal";
import { ReduxStore } from "../stores/reduxStore";

// Import the authentication provider which holds the default settings
import { authProvider } from "../config/authProvider";

import { Grid, Segment } from "semantic-ui-react";
import "./App.css";
import LoginLogoutButton from "../common/auth/LoginLogoutButton";
import { Route, Switch } from "react-router-dom";
import ReportFrame from "../../features/reports/ReportFrame";
import reportsOptions from "../common/options/reportsOptions";
import DashBoard from "./DashBoard";
import HomeDashboard from "./HomeDashboard";
import AboutProject from "./AboutProject";

const App = () => {
  return (
    <AzureAD provider={authProvider} reduxStore={ReduxStore}>
      {({ authenticationState, accountInfo, error }: IAzureADFunctionProps) => {
        const isInProgress =
          authenticationState === AuthenticationState.InProgress;
        const isAuthenticated =
          authenticationState === AuthenticationState.Authenticated;
        const isUnauthenticated =
          authenticationState === AuthenticationState.Unauthenticated;

        console.log("user info:", accountInfo);

        if (isAuthenticated) {
          return (
            <React.Fragment>
              <DashBoard
                accountInfo={accountInfo}
                isAuthenticated={isAuthenticated}
              >
                <Switch>
                  <Route
                    exact
                    path="/"
                    render={() => (
                      <HomeDashboard reportsOptions={reportsOptions} />
                    )}
                  />
                  <Route
                    exact
                    path="/multiline"
                    render={() => (
                      <Grid columns={1} className={"p-0"}>
                        <Grid.Column className={"ph-0"}>
                          <Segment>
                            <ReportFrame
                              reportDescription={
                                reportsOptions.multilineDatabricks.description
                              }
                              reportTitle={
                                reportsOptions.multilineDatabricks.title
                              }
                              reportId={reportsOptions.multilineDatabricks.id}
                            />
                          </Segment>
                        </Grid.Column>
                        <Grid.Column className={"ph-0"}>
                          <Segment>
                            <ReportFrame
                              reportDescription={
                                reportsOptions.multilineSynapse.description
                              }
                              reportTitle={
                                reportsOptions.multilineSynapse.title
                              }
                              reportId={reportsOptions.multilineSynapse.id}
                            />
                          </Segment>
                        </Grid.Column>
                      </Grid>
                    )}
                  />
                  <Route
                    exact
                    path="/twitter"
                    render={() => (
                      <Segment>
                        <ReportFrame
                          reportDescription={reportsOptions.twitter.description}
                          reportTitle={reportsOptions.twitter.title}
                          reportId={reportsOptions.twitter.id}
                        />
                      </Segment>
                    )}
                  />
                  <Route
                    exact
                    path="/correlations"
                    render={() => (
                      <Segment>
                        <ReportFrame
                          reportDescription={
                            reportsOptions.correlationsDatabricks.description
                          }
                          reportTitle={
                            reportsOptions.correlationsDatabricks.title
                          }
                          reportId={reportsOptions.correlationsDatabricks.id}
                        />
                      </Segment>
                    )}
                  />
                  <Route
                    exact
                    path="/choropleth"
                    render={() => (
                      <Segment>
                        <ReportFrame
                          reportDescription={
                            reportsOptions.chropleth.description
                          }
                          reportTitle={reportsOptions.chropleth.title}
                          reportId={reportsOptions.chropleth.id}
                        />
                      </Segment>
                    )}
                  />
                  <Route
                    exact
                    path="/forecast"
                    render={() => (
                      <Grid columns={1} className={"p-0"}>
                        <Grid.Column className={"ph-0"}>
                          <Segment>
                            <ReportFrame
                              reportDescription={
                                reportsOptions.pastTracker.description
                              }
                              reportTitle={reportsOptions.pastTracker.title}
                              reportId={reportsOptions.pastTracker.id}
                            />
                          </Segment>
                        </Grid.Column>
                        <Grid.Column className={"ph-0"}>
                          <Segment>
                            <ReportFrame
                              reportDescription={
                                reportsOptions.forecast.description
                              }
                              reportTitle={reportsOptions.forecast.title}
                              reportId={reportsOptions.forecast.id}
                              showPages
                            />
                          </Segment>
                        </Grid.Column>
                      </Grid>
                    )}
                  />
                </Switch>
              </DashBoard>
            </React.Fragment>
          );
        } else if (isUnauthenticated || isInProgress) {
          return (
            <React.Fragment>
              <DashBoard
                accountInfo={accountInfo}
                isAuthenticated={isAuthenticated}
              >
                <Segment textAlign="center">
                  <AboutProject />
                  <LoginLogoutButton />
                  <h1>You must to login to watch the reports.</h1>
                </Segment>
              </DashBoard>
            </React.Fragment>
          );
        }
      }}
    </AzureAD>
  );
};

export default App;
