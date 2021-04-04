using Microsoft.PowerBI.Api.Models;
using System.Collections.Generic;

namespace QuebecPowerBI_Connector.Models
{
    public class EmbedParams
    {
        // Type of the object to be embedded
        public string Type { get; set; }

        // Report to be embedded
        public List<EmbedReport> EmbedReports { get; set; }

        // Embed Token for the Power BI report
        public EmbedToken EmbedToken { get; set; }
    }
}
