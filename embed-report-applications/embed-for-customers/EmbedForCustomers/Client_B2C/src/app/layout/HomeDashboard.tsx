import React from "react";
import { Grid, Segment } from "semantic-ui-react";
import ReportFrame from "../../features/reports/ReportFrame";
import AboutProject from "./AboutProject";
interface IHomeDashboardProps {
  reportsOptions: any;
}
const HomeDashboard: React.FC<IHomeDashboardProps> = ({ reportsOptions }) => {
  return (
    <React.Fragment>
      <AboutProject />
      <Segment>
        <Grid>
          <Grid.Row>
            <Grid.Column computer={10} tablet={16} mobile={16}>
              <ReportFrame
                reportDescription={reportsOptions.chropleth.description}
                reportTitle={reportsOptions.chropleth.title}
                reportId={reportsOptions.chropleth.id}
                frameClass={"HomeFrameBig"}
              />
            </Grid.Column>
            <Grid.Column computer={6} tablet={16} mobile={16}>
              <Grid>
              <Grid.Row>
                <Grid.Column>
                  <ReportFrame
                      reportDescription={reportsOptions.pastTracker.description}
                      reportTitle={reportsOptions.pastTracker.title}
                      reportId={reportsOptions.pastTracker.id}
                      frameClass={"HomeFrame"}
                    />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <ReportFrame
                      reportDescription={
                        reportsOptions.correlationsDatabricks.description
                      }
                      reportTitle={reportsOptions.correlationsDatabricks.title}
                      reportId={reportsOptions.correlationsDatabricks.id}
                      frameClass={"HomeFrame"}
                    />
                </Grid.Column>
              </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </React.Fragment>
  );
};

export default HomeDashboard;
