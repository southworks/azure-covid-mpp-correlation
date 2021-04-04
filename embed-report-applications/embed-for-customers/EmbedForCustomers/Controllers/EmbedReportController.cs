using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using QuebecPowerBI_Connector.Models;
using QuebecPowerBI_Connector.Services;
using System;
using System.Threading.Tasks;

namespace QuebecPowerBI_Connector.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmbedReportController : ControllerBase
    {
        private readonly PbiEmbedService pbiEmbedService;
        private readonly IOptions<AzureAd> azureAd;
        private readonly IOptions<PowerBI> powerBI;

        public EmbedReportController(PbiEmbedService pbiEmbedService, IOptions<AzureAd> azureAd, IOptions<PowerBI> powerBI)
        {
            this.pbiEmbedService = pbiEmbedService;
            this.azureAd = azureAd;
            this.powerBI = powerBI;
        }

        [HttpGet("{id}")]
        public async Task<EmbedParams> Get(string id)
        {
            powerBI.Value.ReportId = id;

            // Validate whether all the required configurations are provided in appsettings.json
            string configValidationResult = ConfigValidatorService.ValidateConfig(azureAd, powerBI);
            if (configValidationResult != null)
            {
                throw new ArgumentException();
            }

            EmbedParams embedParams = await pbiEmbedService.GetEmbedParams(new Guid(powerBI.Value.WorkspaceId), new Guid(powerBI.Value.ReportId));
            return embedParams;
        }
    }
}