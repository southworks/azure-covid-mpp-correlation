-- Replace everything values between <> 

CREATE MASTER KEY ENCRYPTION BY PASSWORD = '<your strong password>';


CREATE DATABASE SCOPED CREDENTIAL <storageaccountSAS>
WITH IDENTITY = 'SHARED ACCESS SIGNATURE',
SECRET = '<Data Lake Storage SAS>';


CREATE EXTERNAL DATA SOURCE [<SecuredDataSource>] WITH (
	LOCATION = 'https://<datalakestoragename>.blob.core.windows.net', 
	CREDENTIAL = [<storageaccountSAS>])
GO

CREATE EXTERNAL FILE FORMAT [<CsvNoHeaderFileFormat>] WITH (
	FORMAT_TYPE = DELIMITEDTEXT, 
	FORMAT_OPTIONS (FIELD_TERMINATOR = N',', STRING_DELIMITER = N'"', USE_TYPE_DEFAULT = False))
GO


CREATE EXTERNAL FILE FORMAT [<CsvFileFormat>] WITH (
	FORMAT_TYPE = DELIMITEDTEXT, 
	FORMAT_OPTIONS (FIELD_TERMINATOR = N',', 
	STRING_DELIMITER = N'"', 
	FIRST_ROW = 2, USE_TYPE_DEFAULT = False))
GO


-- Airport list
CREATE EXTERNAL TABLE [dbo].[airports]
(
	[ICAO] [varchar](10) ,
	[IATA] [varchar](10) ,
	[Name] [varchar](200),
	[Location] [varchar](200) ,
	[Country] [varchar](100) ,
	[iso] [varchar](3) 
)
WITH (
	DATA_SOURCE = [SecuredDataSource],
	LOCATION = '/openskyarrivals/airportlist.csv',
	FILE_FORMAT = [CsvFileFormat]
	)
GO

-- Test 
SELECT * FROM [airports];

-- Airport arrivals data
CREATE EXTERNAL TABLE [dbo].[arrivals]
(
	[icao24] [nvarchar](4000),
	[firstSeen] [bigint] ,
	[estDepartureAirport] [nvarchar](4000) ,
	[lastSeen] [bigint] ,
	[estArrivalAirport] [nvarchar](4000) ,
	[callsign] [nvarchar](4000) ,
	[estDepartureAirportHorizDistance] [bigint] ,
	[estDepartureAirportVertDistance] [bigint] ,
	[estArrivalAirportHorizDistance] [bigint] ,
	[estArrivalAirportVertDistance] [bigint] ,
	[departureAirportCandidatesCount] [bigint] ,
	[arrivalAirportCandidatesCount] [bigint] 
)
WITH (  DATA_SOURCE = [SecuredDataSource],
		LOCATION = '/openskyarrivals/csv/', 
		FILE_FORMAT = [CsvNoHeaderFileFormat]
		)
GO

-- Test
SELECT TOP 10 * FROM [dbo].[arrivals];

-- Countries for mobility
CREATE EXTERNAL TABLE [dbo].[countries]
(
	[COUNTRY] [varchar](100),
	[ITU] [varchar](10),
	[EXTENDED_COUNTRY_CODE] [varchar](2),
	[EBU_COUNTRY_CODE] [varchar](1),
	[ISO] [varchar](3)
)
WITH (DATA_SOURCE = [SecuredDataSource],
LOCATION = '/mobilitydata/countries.csv',
FILE_FORMAT = [CsvFileFormat])
GO

-- Test
SELECT * FROM [dbo].[countries]

-- Countries for weather
CREATE EXTERNAL TABLE [dbo].[countries_weather]
(
	[city_id] [varchar](100),
	[city_name] [varchar](100),
	[state_code] [varchar](10),
	[country_code] [varchar](3),
	[country_full] [varchar](50),
	[lat] [varchar](50),
	[lon] [varchar](50),
	[iso] [varchar](3)
)
WITH (
	DATA_SOURCE = [SecuredDataSource],
	LOCATION = '/weatherdata/citiesweather.csv',
	FILE_FORMAT = [CsvFileFormat])
GO

-- Test
SELECT * FROM [dbo].[countries_weather]


-- Mobility 
CREATE EXTERNAL TABLE [dbo].[mobility]
(
	[mid] [nvarchar](4000) ,
	[JF] [nvarchar](4000),
	[EBU_COUNTRY_CODE] [nvarchar](4000) ,
	[EXTENDED_COUNTRY_CODE] [nvarchar](4000) ,
	[CREATED_TIMESTAMP] [nvarchar](4000)
)
WITH (
	DATA_SOURCE = [SecuredDataSource]
	,LOCATION = '/mobilitydata/csv/',FILE_FORMAT = [CsvNoHeaderFileFormat])
GO

-- Test
SELECT TOP 100 * FROM [dbo].[mobility];


-- Weather
CREATE EXTERNAL TABLE [dbo].[weather]
(
	[country_code] [nvarchar](10) ,
	[city_name] [nvarchar](100) ,
	[datetime] [nvarchar](100) ,
	[temp] [nvarchar](10) 
)
WITH (
	DATA_SOURCE = [SecuredDataSource],
	LOCATION = '/weatherdata/csv/',
	FILE_FORMAT = [CsvNoHeaderFileFormat])
GO

-- Test
SELECT TOP 100 * FROM [dbo].[weather]


-- Twitter 
CREATE EXTERNAL TABLE [dbo].[twitter]
(
	[id] [bigint],
	[text] [varchar](500),
	[created_at] [datetime]
)
WITH (
	DATA_SOURCE = [SecuredDataSource],
	LOCATION = '/twitterdataraw/',
	FILE_FORMAT = [CsvNoHeaderFileFormat])
GO

-- Test
SELECT TOP 100 * FROM [dbo].[twitter]


-- View for historical arrivals
CREATE VIEW [dbo].[view_historical_arrivals]
AS SELECT COUNT(*) cant, AP.[ISO], FORMAT(dateadd(S, [lastSeen], '1970-01-01'), 'yyyy-MM-dd') date
  FROM [dbo].[arrivals] A
  INNER JOIN [dbo].[airports] AP ON A.[estArrivalAirport] = AP.ICAO
  --WHERE dateadd(S, [lastSeen], '1970-01-01') = '2020-11-17'
  GROUP BY AP.[ISO], FORMAT(dateadd(S, [lastSeen], '1970-01-01'), 'yyyy-MM-dd');
GO


/*
-- Not used, direct connection to Microsoft Pandemic data

CREATE VIEW [dbo].[covid_history] AS
SELECT * FROM OPENROWSET(
        BULK     'https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/ecdc_cases/latest/ecdc_cases.parquet',
        FORMAT = 'parquet'
    ) AS [r]
GO 

*/

-- COVID 19 historical data
-- DROP EXTERNAL TABLE [dbo].[covid_history]
CREATE EXTERNAL TABLE [dbo].[covid_history]
  (
	   [date_rep] varchar(10)
	  ,[day] int 
      ,[month] int
      ,[year] int
      ,[cases] bigint
      ,[deaths] bigint
      ,[countries_and_territories] varchar(100)
      ,[geo_id] varchar(100)
      ,[country_territory_code] varchar(50)
      ,[pop_data_2018] bigint
      ,[continent_exp] varchar(50)
      ,[comulative14] float
) WITH (
	DATA_SOURCE = [SecuredDataSource],
	LOCATION = '/covid/csv',
	FILE_FORMAT = [CsvFileFormat])
GO


-- View for multiline report
CREATE VIEW [dbo].[multiline_live]
AS SELECT CW.[country_full] country 
	  , C.ISO country_iso
	  , AVG(CAST(LTRIM(RTRIM(M.JF)) as FLOAT)) jam_factor
	  , FORMAT(cast(SUBSTRING ( M.CREATED_TIMESTAMP ,1 , 10 )  as date), 'yyyy-MM-dd') created  
	  , AVG(CH.[deaths]) covid_deaths
	  , AVG(ISNULL(CH.[cases], 0)) covid_cases
	  , AVG(CAST(W.temp AS NUMERIC)) avg_country_temp
	  , AVG(CAST(ISNULL(HA.cant, 0) AS BIGINT)) avg_country_flight_arrivals
  FROM [dbo].[mobility] M
  INNER JOIN [dbo].[countries] C ON C.EBU_COUNTRY_CODE = M.EBU_COUNTRY_CODE AND C.EXTENDED_COUNTRY_CODE = M.EXTENDED_COUNTRY_CODE
  INNER JOIN [dbo].[covid_history] CH ON CH.date_rep = FORMAT(cast(SUBSTRING ( M.CREATED_TIMESTAMP ,1 , 10 )  as date), 'yyyy-MM-dd') 
				AND CH.[country_territory_code] = C.ISO
  INNER JOIN [dbo].[weather] W ON FORMAT(cast(SUBSTRING ( W.[datetime], 1, 10 )  as date), 'yyyy-MM-dd') = CH.date_rep
				AND C.ISO = (SELECT TOP 1 iso FROM countries_weather WHERE [country_code] = W.country_code)
  LEFT JOIN [dbo].[view_historical_arrivals] HA ON HA.ISO = C.ISO AND FORMAT(cast(SUBSTRING ( M.CREATED_TIMESTAMP ,1 , 10 )  as date), 'yyyy-MM-dd') = HA.[date]
  INNER JOIN [dbo].[countries_weather] CW ON CW.iso = C.ISO
  GROUP BY FORMAT(cast(SUBSTRING ( M.CREATED_TIMESTAMP ,1 , 10 )  as date), 'yyyy-MM-dd'), CW.country_full, C.ISO, CH.date_rep;
GO

-- CETAS for historical arrivals
CREATE EXTERNAL TABLE [dbo].[historical_arrivals]
WITH (
	DATA_SOURCE = [SecuredDataSource],
	LOCATION = '/openskyarrivals/historical_arrivals',
	FILE_FORMAT = [CsvNoHeaderFileFormat])
AS 
 SELECT COUNT(*) cant, AP.[ISO], FORMAT(dateadd(S, [lastSeen], '1970-01-01'), 'yyyy-MM-dd') date
  FROM [dbo].[arrivals] A
  INNER JOIN [dbo].[airports] AP ON A.[estArrivalAirport] = AP.ICAO
  GROUP BY AP.[ISO], FORMAT(dateadd(S, [lastSeen], '1970-01-01'), 'yyyy-MM-dd')
GO

-- Test
SELECT TOP 100 * FROM [dbo].[historical_arrivals]

-- CETAS for mobility data
CREATE EXTERNAL TABLE [dbo].[mobility_plain]
WITH (
	DATA_SOURCE = [SecuredDataSource],
	LOCATION = '/openskyarrivals/mobility_plain',
	FILE_FORMAT = [CsvNoHeaderFileFormat])
AS
SELECT  FORMAT(cast(SUBSTRING ( M.CREATED_TIMESTAMP ,1 , 10 )  as date), 'yyyy-MM-dd') created
, C.ISO
, AVG(CAST(LTRIM(RTRIM(M.JF)) as FLOAT)) jam_factor
FROM [dbo].[mobility] M
INNER JOIN [dbo].[countries] C ON C.EBU_COUNTRY_CODE = M.EBU_COUNTRY_CODE AND C.EXTENDED_COUNTRY_CODE = M.EXTENDED_COUNTRY_CODE
GROUP BY FORMAT(cast(SUBSTRING ( M.CREATED_TIMESTAMP ,1 , 10 )  as date), 'yyyy-MM-dd'), C.ISO

-- Test
SELECT * FROM [dbo].[multiline_plain]


-- CETAS for Multiline report
--DROP EXTERNAL TABLE [dbo].[multiline_plain]
CREATE EXTERNAL TABLE [dbo].[multiline_plain]
WITH (
	DATA_SOURCE = [SecuredDataSource],
	LOCATION = '/openskyarrivals/multiline_plain',
	FILE_FORMAT = [CsvNoHeaderFileFormat])
AS SELECT CW.[country_full] country 
	  , M.ISO country_iso
	  , AVG(M.jam_factor) jam_factor
	  , M.created 
	  , AVG(CH.[deaths]) covid_deaths
	  , AVG(ISNULL(CH.[cases], 0)) covid_cases
	  , AVG(CAST(W.temp AS NUMERIC)) avg_country_temp
	  , AVG(CAST(ISNULL(HA.cant, 0) AS BIGINT)) avg_country_flight_arrivals
  FROM [dbo].[mobility_plain] M
    INNER JOIN [dbo].[covid_history] CH ON CH.date_rep = M.created 
				AND CH.[country_territory_code] = M.ISO
  INNER JOIN [dbo].[weather] W ON FORMAT(cast(SUBSTRING ( W.[datetime], 1, 10 )  as date), 'yyyy-MM-dd') = CH.date_rep
				AND M.ISO = (SELECT TOP 1 iso FROM countries_weather WHERE [country_code] = W.country_code)
  LEFT JOIN [dbo].[historical_arrivals] HA ON HA.ISO = M.ISO AND M.created = HA.[date]
  INNER JOIN [dbo].[countries_weather] CW ON CW.iso = M.ISO
  GROUP BY M.created, CW.country_full, M.ISO, CH.date_rep;
GO


-- CETAS for twitter historical tweets
-- DROP EXTERNAL TABLE [dbo].[historical_covid_tweets];
CREATE EXTERNAL TABLE [dbo].[historical_covid_tweets]
WITH (
	DATA_SOURCE = [SecuredDataSource],
	LOCATION = '/openskyarrivals/historical_covid_tweets',
	FILE_FORMAT = [CsvNoHeaderFileFormat])
AS SELECT CONVERT(DATE, c.date_rep,103) date_rep
  , MAX(c.cases) cases
  , MAX(c.deaths) deaths
  , ISNULL(COUNT(t.id), 0) tweets  
  FROM [dbo].[covid_history] c
  INNER JOIN [dbo].[twitter] t ON FORMAT(cast(t.created_at as date), 'dd/MM/yyyy') = c.date_rep
GROUP BY c.date_rep;
GO

-- Test
SELECT * FROM [dbo].[historical_covid_tweets]

-- View for correlation report
CREATE VIEW [dbo].[correlation_arrivals_cases]
AS SELECT C.country_territory_code, 
	SUM(ISNULL([cases], 0)) cases , SUM(A.cant) cant,
	(COUNT(*) * SUM(CAST(ISNULL([cases], 1) AS float) * A.cant) - SUM(CAST(ISNULL([cases], 1) AS float)) * SUM(CAST(A.cant AS float))) / 
    (SQRT(COUNT(*) * SUM(CAST(ISNULL([cases], 1) AS float) * (CAST(ISNULL([cases], 0) AS float))) - SUM(CAST(ISNULL([cases], 1) AS float)) * SUM((CAST(ISNULL([cases], 1) AS float))))
                    * SQRT(COUNT(*) * SUM(CAST(A.cant AS float) * CAST(A.cant AS float)) - SUM(CAST(A.cant AS float)) * SUM(CAST(A.cant AS float)))) as correlation
  FROM [dbo].[covid_history] C
  INNER JOIN (
	SELECT DISTINCT cant, ISO, date FROM [dbo].[historical_arrivals]
  ) A ON A.ISO = C.country_territory_code AND A.date = C.date_rep
  WHERE C.country_territory_code != 'USA'
 group by C.country_territory_code;
GO


-- View for mobility report
CREATE VIEW [dbo].[correlation_mobility_cases]
AS SELECT C.country_territory_code, 
	SUM(CAST(ISNULL([cases], 0) AS float)) cases , AVG(CAST(A.JF as float)) JF,
	(COUNT(*) * SUM(CAST(ISNULL([cases], 1) AS float) * CAST(A.JF AS float)) - SUM(CAST(ISNULL([cases], 1) AS float)) * SUM(CAST(A.JF AS float))) / 
    (SQRT(COUNT(*) * SUM(CAST(ISNULL([cases], 1) AS float) * (CAST(ISNULL([cases], 0) AS float))) - SUM(CAST(ISNULL([cases], 1) AS float)) * SUM((CAST(ISNULL([cases], 1) AS float))))
                    * SQRT(COUNT(*) * SUM(CAST(A.JF AS float) * CAST(A.JF AS float)) - SUM(CAST(A.JF AS float)) * SUM(CAST(A.JF AS float)))) as correlation
  FROM [dbo].[covid_history] C
  INNER JOIN [dbo].[mobility] A ON C.date_rep = FORMAT(cast(SUBSTRING ( A.CREATED_TIMESTAMP ,1 , 10 )  as date), 'yyyy-MM-dd') 
  INNER JOIN [dbo].[countries] B ON B.EBU_COUNTRY_CODE = A.EBU_COUNTRY_CODE AND B.EXTENDED_COUNTRY_CODE = A.EXTENDED_COUNTRY_CODE
	AND C.[country_territory_code] = B.ISO
  WHERE C.country_territory_code != 'USA'
 group by C.country_territory_code;
GO

-- CETAS for weather and covid cases
-- DROP EXTERNAL TABLE [dbo].[correlation_weather_cases]
CREATE EXTERNAL TABLE [dbo].[correlation_weather_cases]
WITH (
	DATA_SOURCE = [SecuredDataSource],
	LOCATION = '/openskyarrivals/correlation_weather_cases',
	FILE_FORMAT = [CsvNoHeaderFileFormat])
AS SELECT C.country_territory_code, 
	SUM(CAST(ISNULL([cases], 0) AS float)) cases , AVG(CAST(A.temp as float)) temp ,
	(COUNT(*) * SUM(CAST(ISNULL([cases], 1) AS float) * CAST(A.temp AS float)) - SUM(CAST(ISNULL([cases], 1) AS float)) * SUM(CAST(A.temp AS float))) / 
    (SQRT(COUNT(*) * SUM(CAST(ISNULL([cases], 1) AS float) * (CAST(ISNULL([cases], 1) AS float))) - SUM(CAST(ISNULL([cases], 1) AS float)) * SUM((CAST(ISNULL([cases], 1) AS float))))
                    * SQRT(COUNT(*) * SUM(CAST(A.temp AS float) * CAST(A.temp AS float)) - SUM(CAST(A.temp AS float)) * SUM(CAST(A.temp AS float)))) as correlation
  FROM [dbo].[covid_history] C
  INNER JOIN dbo.weather A ON 
		FORMAT(cast(SUBSTRING ( A.[datetime], 1, 10 )  as date), 'yyyy-MM-dd') = FORMAT(CONVERT(DATE, C.date_rep, 103), 'yyyy-MM-dd') 
  WHERE C.country_territory_code NOT IN('USA','GRL', 'VGB','MHL', 'TLS', 'BRN', 'VUT', 'FLK') AND C.cases is not null AND CAST(A.temp as float) > 0 AND CAST(C.cases AS float) > 0
 group by C.country_territory_code;
GO

-- CETAS for historical covid
CREATE EXTERNAL TABLE [dbo].[historical_covid]
WITH (
	DATA_SOURCE = [SecuredDataSource],
	LOCATION = '/openskyarrivals/historical_covid_plain',
	FILE_FORMAT = [CsvNoHeaderFileFormat])
AS SELECT ISNULL(B.cases, (
				SELECT AVG(cases) 
					FROM [dbo].[covid_history] 
					WHERE date_rep between DATEADD(day,-30, B.date_rep) AND B.date_rep AND iso_country=B.iso_country )
					) cases,
		ISNULL(B.deaths, (
				SELECT AVG(deaths) 
					FROM [dbo].[covid_history] 
					WHERE date_rep between DATEADD(day,-30, B.date_rep) AND B.date_rep AND iso_country=B.iso_country )
					) deaths,
		B.date_rep,
		B.iso_country,
		B.country_territory_code
	FROM (

			SELECT [date_rep]
					, MAX([cases]) cases
					, MAX([deaths]) deaths
					, iso_country
					, country_territory_code
				FROM [dbo].[covid_history]
				group by  iso_country, country_territory_code, date_rep
		) B;
GO

