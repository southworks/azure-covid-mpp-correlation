using Microsoft.PowerBI.Api;
using Microsoft.PowerBI.Api.Models;
using Microsoft.Rest;
using QuebecPowerBI_Connector.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading.Tasks;

namespace QuebecPowerBI_Connector.Services
{
    public class PbiEmbedService
    {
        private readonly AadService aadService;
        private readonly string urlPowerBiServiceApiRoot = "https://api.powerbi.com";

        public PbiEmbedService(AadService aadService)
        {
            this.aadService = aadService;
        }

        /// <summary>
        /// Get Power BI client
        /// </summary>
        /// <returns>Power BI client object</returns>
        public PowerBIClient GetPowerBIClient()
        {
            var tokenCredentials = new TokenCredentials(aadService.GetAccessToken(), "Bearer");
            return new PowerBIClient(new Uri(urlPowerBiServiceApiRoot), tokenCredentials);
        }

        /// <summary>
        /// Get embed params for a report
        /// </summary>
        /// <returns>Wrapper object containing Embed token, Embed URL, Report Id, and Report name for single report</returns>
        public async Task<EmbedParams> GetEmbedParams(Guid workspaceId, Guid reportId, [Optional] Guid additionalDatasetId)
        {
            PowerBIClient pbiClient = GetPowerBIClient();

            // Get reports info
            var pbiReport = await pbiClient.Reports.GetReportInGroupAsync(workspaceId, reportId);

            // Create list of datasets
            var datasetIds = new List<Guid>();

            // Add dataset associated to the report
            datasetIds.Add(Guid.Parse(pbiReport.DatasetId));

            // Append additional dataset to the list to achieve dynamic binding later
            if (additionalDatasetId != Guid.Empty)
            {
                datasetIds.Add(additionalDatasetId);
            }

            // Add report data for embedding
            var embedReports = new List<EmbedReport> {
                new EmbedReport {
                    ReportId = pbiReport.Id,
                    ReportName = pbiReport.Name,
                    EmbedUrl = pbiReport.EmbedUrl
                }
            };

            // Get Embed token multiple resources
            var embedToken = await GetEmbedToken(reportId, datasetIds, workspaceId);

            // Capture embed params
            var embedParams = new EmbedParams
            {
                EmbedReports = embedReports,
                Type = "Report",
                EmbedToken = embedToken
            };

            return embedParams;
        }

        /// <summary>
        /// Get Embed token for single report, multiple datasets, and an optional target workspace
        /// </summary>
        /// <returns>Embed token</returns>
        public async Task<EmbedToken> GetEmbedToken(Guid reportId, IList<Guid> datasetIds, [Optional] Guid targetWorkspaceId)
        {
            PowerBIClient pbiClient = GetPowerBIClient();

            // Create a request for getting Embed token 
            // This method works only with new Power BI V2 workspace experience
            var tokenRequest = new GenerateTokenRequestV2(
                reports: new List<GenerateTokenRequestV2Report>() { new GenerateTokenRequestV2Report(reportId) },
                datasets: datasetIds.Select(datasetId => new GenerateTokenRequestV2Dataset(datasetId.ToString())).ToList(),
                targetWorkspaces: targetWorkspaceId != Guid.Empty ? new List<GenerateTokenRequestV2TargetWorkspace>() { new GenerateTokenRequestV2TargetWorkspace(targetWorkspaceId) } : null
            );

            // Generate Embed token
            var embedToken = await pbiClient.EmbedToken.GenerateTokenAsync(tokenRequest);

            return embedToken;
        }

        /// <summary>
        /// Get embed params for a report
        /// </summary>
        /// <returns>Wrapper object containing Embed token, Embed URL, Report Id, and Report name for all reports in Workspace</returns>
        public EmbedParams GetEmbedParams(Guid workspaceId, [Optional] IList<Guid> additionalDatasetIds)
        {
            PowerBIClient pbiClient = GetPowerBIClient();

            // Get reports info
            //var pbiReport = pbiClient.Reports.GetReportInGroup(workspaceId, reportId);
            //var pbiReports = pbiClient.Reports.GetReport(workspaceId);

            // Create list of datasets
            var datasetIds = new List<Guid>();
            var reportsIds = new List<Guid>() { new Guid("454188d2-f217-4dbe-b6bb-bdbcde471f33"), new Guid("454188d2-f217-4dbe-b6bb-bdbcde471f33") };
            var embedReports = new List<EmbedReport>();

            var pbiReports = reportsIds.Select(r => pbiClient.Reports.GetReport(workspaceId, r));

            foreach (var report in pbiReports)
            {
                // Add dataset associated to the report
                datasetIds.Add(Guid.Parse(report.DatasetId));

                // Add report data for embedding
                embedReports.Add(new EmbedReport
                {
                    ReportId = report.Id,
                    ReportName = report.Name,
                    EmbedUrl = report.EmbedUrl
                });

                //reportsIds.Add(report.Id);
            }

            // Append additional dataset to the list to achieve dynamic binding later
            if (additionalDatasetIds != null && additionalDatasetIds.Any())
            {
                datasetIds.AddRange(additionalDatasetIds.Where(adsid => adsid != Guid.Empty) );
            }

            // Get Embed token multiple resources
            var embedToken = GetEmbedToken(reportsIds, datasetIds, workspaceId);

            // Capture embed params
            var embedParams = new EmbedParams
            {
                EmbedReports = embedReports,
                Type = "Report",
                EmbedToken = embedToken
            };

            return embedParams;
        }

        /// <summary>
        /// Get Embed token for multiple reports, datasets, and an optional target workspace
        /// </summary>
        /// <returns>Embed token</returns>
        public EmbedToken GetEmbedToken(IList<Guid> reportIds, IList<Guid> datasetIds, [Optional] Guid targetWorkspaceId)
        {
            // Note: This method is an example and is not consumed in this sample app

            PowerBIClient pbiClient = GetPowerBIClient();

            // Convert report Ids to required types
            var reports = reportIds.Select(reportId => new GenerateTokenRequestV2Report(reportId)).ToList();
            reports.ForEach(r => r.AllowEdit = false);

            // Convert dataset Ids to required types
            var datasets = datasetIds.Select(datasetId => new GenerateTokenRequestV2Dataset(datasetId.ToString())).ToList();

            // Create a request for getting Embed token 
            // This method works only with new Power BI V2 workspace experience
            var tokenRequest = new GenerateTokenRequestV2(
                datasets: datasets,
                reports: reports,
                targetWorkspaces: targetWorkspaceId != Guid.Empty ? new List<GenerateTokenRequestV2TargetWorkspace>() { new GenerateTokenRequestV2TargetWorkspace(targetWorkspaceId) } : null
            );

            // Generate Embed token
            var embedToken = pbiClient.EmbedToken.GenerateToken(tokenRequest);

            return embedToken;
        }
    }
}
