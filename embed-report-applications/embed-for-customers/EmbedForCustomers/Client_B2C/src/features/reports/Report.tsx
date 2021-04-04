import React from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';
import { IEmbedParams } from '../../app/models/report';

interface IReportProps extends IEmbedParams{
  showPages: boolean;
}

const Report: React.FC<IReportProps> = ({embedReports, embedToken, type, showPages}) => {
  return (
    <PowerBIEmbed
      embedConfig={{
          type: type.toLowerCase(),   // Supported types: report, dashboard, tile, visual and qna
          id: embedReports[0].reportId,
          embedUrl: embedReports[0].embedUrl,
          accessToken: embedToken.token,    // Keep as empty string, null or undefined
          tokenType: models.TokenType.Embed,
          settings: {
            panes: {
              filters: {
                expanded: false,
                visible: false
              },
              pageNavigation: {
                visible: showPages
              }
            },
            background: models.BackgroundType.Transparent,
          }
      }}
      cssClassName = { "ReportIframe" }
    />
  );
  
};

export default Report;