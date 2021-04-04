using Microsoft.Extensions.Options;
using QuebecPowerBI_Connector.Models;
using System;

namespace QuebecPowerBI_Connector.Services
{
    public class ConfigValidatorService
    {
        /// <summary>
        /// Validates whether all the configuration parameters are set in appsettings.json file
        /// </summary>
        /// <param name="appSettings">Contains appsettings.json configuration values</param>
        /// <returns></returns>
        public static string ValidateConfig(IOptions<AzureAd> azureAd, IOptions<PowerBI> powerBI, bool isRequiredReport = true)
        {
            string message = null;
            bool isAuthModeMasterUser = azureAd.Value.AuthenticationMode.Equals("masteruser", StringComparison.InvariantCultureIgnoreCase);
            bool isAuthModeServicePrincipal = azureAd.Value.AuthenticationMode.Equals("serviceprincipal", StringComparison.InvariantCultureIgnoreCase);

            if (string.IsNullOrWhiteSpace(azureAd.Value.AuthenticationMode))
            {
                message = "Authentication mode is not set in appsettings.json file";
            }
            else if (string.IsNullOrWhiteSpace(azureAd.Value.AuthorityUri))
            {
                message = "Authority is not set in appsettings.json file";
            }
            else if (string.IsNullOrWhiteSpace(azureAd.Value.ClientId))
            {
                message = "Client Id is not set in appsettings.json file";
            }
            else if (isAuthModeServicePrincipal && string.IsNullOrWhiteSpace(azureAd.Value.TenantId))
            {
                message = "Tenant Id is not set in appsettings.json file";
            }
            else if (azureAd.Value.Scope is null || azureAd.Value.Scope.Length == 0)
            {
                message = "Scope is not set in appsettings.json file";
            }
            else if (string.IsNullOrWhiteSpace(powerBI.Value.WorkspaceId))
            {
                message = "Workspace Id is not set in appsettings.json file";
            }
            else if (!IsValidGuid(powerBI.Value.WorkspaceId))
            {
                message = "Please enter a valid guid for Workspace Id in appsettings.json file";
            }
            else if (isRequiredReport && string.IsNullOrWhiteSpace(powerBI.Value.ReportId))
            {
                message = "Report Id is not set in appsettings.json file";
            }
            else if (isRequiredReport && !IsValidGuid(powerBI.Value.ReportId))
            {
                message = "Please enter a valid guid for Report Id in appsettings.json file";
            }
            else if (isAuthModeMasterUser && string.IsNullOrWhiteSpace(azureAd.Value.PbiUsername))
            {
                message = "Master user email is not set in appsettings.json file";
            }
            else if (isAuthModeMasterUser && string.IsNullOrWhiteSpace(azureAd.Value.PbiPassword))
            {
                message = "Master user password is not set in appsettings.json file";
            }
            else if (isAuthModeServicePrincipal && string.IsNullOrWhiteSpace(azureAd.Value.ClientSecret))
            {
                message = "Client secret is not set in appsettings.json file";
            }

            return message;
        }

        /// <summary>
        /// Checks whether a string is a valid guid
        /// </summary>
        /// <param name="configParam">String value</param>
        /// <returns>Boolean value indicating validity of the guid</returns>
        private static bool IsValidGuid(string configParam)
        {
            Guid result = Guid.Empty;
            return Guid.TryParse(configParam, out result);
        }
    }
}
