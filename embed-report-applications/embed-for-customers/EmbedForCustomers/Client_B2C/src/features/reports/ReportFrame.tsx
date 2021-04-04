import React, { useState, useEffect, Fragment } from 'react';
import { IEmbedParams } from '../../app/models/report';
import agent from '../../app/api/agent';
import Report from './Report';
import { Dimmer, Grid, Label, Loader } from 'semantic-ui-react';

interface IReportFrameProps{
  reportId: string;
  reportTitle: string;
  reportDescription: string;
  showPages?: boolean;
  frameClass?: string;

}

const ReportFrame: React.FC<IReportFrameProps> = ({reportId, reportTitle, reportDescription, showPages, frameClass}) => {
  const [embedParams, setEmbedParams] = useState<IEmbedParams>();
  const [loading, isLoading] = useState<boolean>(true);

  useEffect(() => {
    isLoading(true);
    try{
      agent.Reports.getReport(reportId)
      .then(params => {
        console.log('params:', params)
        setEmbedParams(params);
        isLoading(false);
      });
    }
    catch(error){
      console.log(error);
    }
  }, [reportId]);

  if(loading || !embedParams){
    return(
      <Fragment>
        <Label className={'ReportLabel'}>
          {reportTitle}
        </Label>
        <div className={frameClass??"Frame"}>
          <Dimmer active>
            <Loader size='massive' className={'ReportLoader'}>Loading Report</Loader>
          </Dimmer>
        </div>
      </Fragment>
    );
  }
  else{
    return (
      <Fragment>
        <Label className={'ReportLabel'}>
          {reportTitle}
        </Label>
        <Grid columns={1}>
          <Grid.Column>
          <div className= {frameClass??"Frame"}>
              <Report
                embedReports={embedParams!.embedReports}
                type={embedParams!.type}
                embedToken={embedParams!.embedToken}
                showPages={showPages ? true : false}
              />
            </div>
          </Grid.Column>
          {!frameClass && (
            <Grid.Column>
            <p>{reportDescription}</p>
          </Grid.Column>)} 
        </Grid>
        
      </Fragment>
    );
  }
  
};

export default ReportFrame;