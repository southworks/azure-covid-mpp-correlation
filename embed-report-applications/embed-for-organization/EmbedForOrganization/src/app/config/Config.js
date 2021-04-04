export const scopes = ["https://analysis.windows.net/powerbi/api/Report.Read.All"];

// Client Id (Application Id) of the AAD app.
export const clientId = "your-aad-application-id";

// Id of the workspace where the report is hosted
export const workspaceId = "powerbi_workspace_id";

export const reports = {
	last_15_days: {
		title: "Last 15 days",
		id: "last_15_days_report_id",
		description: "We present historic tracker report shown the captured data but only for the past 15 days. "+
			"We are gathering data from the following countries: USA, Brazil, Spain, France, and Japan.",
		showPages: false
	},
	tweets_demises_cases: {
		title: "Tweets, Demises, and Cases by Date",
		id: "tweets_demises_cases_report_id",
		description: "Shows the relation between Tweets containing the #COVID hashtag, Cases and Demises by Date. "+
			"The left Y axis represents Tweets and Demises, and the right Y axis represents the Cases. "+
			"As we cannot determine the country of each tweet, this chart is global. ",
		showPages: false
	},
	temp_jam_flights_demises_cases: {
		title: "Temperature, Mobility index, Flights, and Demises",
		id: "temp_jam_flights_demises_cases_report_id",
		description: "Multiline chart of all the captured data.\n" +
			"The left Y axis represents the Cases and Flights, and right Y axis represents the Mobility Index and Temperature.\n" +
			"The chart can be filtered by Country.",
		showPages: false
	},
	temp_flights_mobility_cases: {
		title: "Temperature, Flights, Mobility index, and Cases by date",
		id: "temp_flights_mobility_cases_report_id",
		description: "We present historical information related to the number of Cases, Flights, Mobility and Temperature by date. "+
			"The left Y axis represents the Cases and Flights, and the right Y axis represents the Mobility Index and Temperature. "+
			"The chart can be filtered by Country.",
		showPages: false
	},
	forecast: {
		title: "Forecast",
		id: "Forecast_report_id",
		description: "Based on a historical data, we are forecasting the growth of the COVID-19 cases. "+
			"We are using an external visualization tool of Power BI that handles the forecasting. "+
			"The one that we are using, uses the algorithm ETS. "+
			"There are other ones such as ARIMA, that are worth checking.",
		showPages: true
	},
	countries: {
		title: "Cases by Country",
		id: "Cases_by_Country_report_id",
		description: "This chart visualizes the amount of cases in each country. " +
			"Stronger colors mean a higher number of cases.",
		showPages: false
	},
	correlations: {
		title: "Correlations",
		id: "Correlations_report_id",
		description: "Shows how each individual factor influenced in COVID evolution. " +
			"We are using the Correlation Coefficient to evaluate the relation. "+
			"The value of this coefficient is in between -1 and 1; "+
			"where 1 is highly correlated and -1 is not correlated at all.",
		showPages: false
	}
}
