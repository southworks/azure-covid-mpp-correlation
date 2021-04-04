const reports = {
    twitter: {
      showPages: false,
      title: "Tweets, Demises, and Cases",
      id: "<power-bi-report-id>",
      description: "Tweets containing the #COVID hashtag, Cases and Demises by Date. The left Y axis represents Tweets and Demises, and the right Y axis represents the Cases. As we cannot determine the country of each tweet, this chart is global."
    },
    chropleth: {
      showPages: false,
      title: "Cases by Country",
      id: "<power-bi-report-id>",
      description: "This chart visualizes the amount of cases in each country. Stronger colors mean a higher number of cases. The data is fetched from: USA, Brazil, Spain, France, and Japan."
    },
    forecast: { 
      showPages: true,
      title: "Forecast", 
      id: "<power-bi-report-id>",
      description: "Forecast of the growth of the COVID Cases, based on historical data. Forecast are represented in Page 1: using Linear Prediction (top chart) and ETS (bottom chart) algorithms and in Page 2: using ARIMA algorithm. The data is fetched from: USA, Brazil, Spain, France, and Japan."
    },
    pastTracker: {
      showPages: false,
      title: "Last 15 days",
      id: "<power-bi-report-id>",
      description: "Last 15 days of COVID getted data, matched with Flights, Mobility Index and Weather Temperature. Use a time gap between COVID data and the others of the stats of 15 days"
    },
    multilineDatabricks: {
      showPages: false,
      title: "COVID Cases by Time",
      id: "<power-bi-report-id>",
      description: "Historical information related to the number of reported COVID Cases, Flights, Mobility Index and Temperature by Date. The left Y axis represents the Cases and Flights, and the right Y axis represents the Mobility Index and Temperature. The data is fetched from: USA, Brazil, Spain, France, and Japan. This chart can be filtered by Country."
    },
    multilineSynapse: {
      showPages: false,
      title: "COVID Demises by Time",
      id: "<power-bi-report-id>",
      description: "Historical information related to the number of reported COVID Demises, Flights, Mobility Index and Temperature by Date. The left Y axis represents the Cases and Flights, and the right Y axis represents the Mobility Index and Temperature. The data is fetched from: USA, Brazil, Spain, France, and Japan. This chart can be filtered by Country."
    },
    correlationsDatabricks: {
      showPages: false,
      title: "Correlations",
      id: "<power-bi-report-id>",
      description: "Use the Correlation Coefficient to evaluate the correlation between COVID and Flights, Mobility Index and Weather Temperature. The value of this coefficient is in between -1 and 1; where 1 is directly correlated, 0 indicates not correlation found and -1 is inversaly correlated. The data is fetched from: USA, Brazil, Spain, France, and Japan.",
    },
  };

  export default reports