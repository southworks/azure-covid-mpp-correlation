#block 1
spark.conf.set("fs.azure.account.key.<datalake-account-name>.blob.core.windows.net", "<datalake-access-key>") 
 
weather_path = "/mnt/datasource/weatherdata/"
covid_path = "/mnt/datasource/covid/"
openskyarrivals_path = "/mnt/datasource/openskyarrivals/"
mobilitydata_path = "/mnt/datasource/mobilitydata/"
config = {"fs.azure.account.key.<datalake-account-name>.blob.core.windows.net": "<datalake-access-key>"}


dbutils.fs.mount(source = "wasbs://openskyarrivals@stquebecdatalake.blob.core.windows.net/",mount_point = openskyarrivals_path,extra_configs = config)

dbutils.fs.mount(source = "wasbs://weatherdata@stquebecdatalake.blob.core.windows.net/",mount_point = weather_path,extra_configs = config)

dbutils.fs.mount(source = "wasbs://mobilitydata@stquebecdatalake.blob.core.windows.net/",mount_point = mobilitydata_path,extra_configs = config)

dbutils.fs.mount(source = "wasbs://covid@stquebecdatalake.blob.core.windows.net/",mount_point = covid_path,extra_configs = config)

if any(mount.mountPoint == openskyarrivals_path for mount in dbutils.fs.mounts()):
   dbutils.fs.mount(source = "wasbs://openskyarrivals@quebecstorageaccount.blob.core.windows.net/",mount_point = #openskyarrivals_path,extra_configs = config)
    
if any(mount.mountPoint == weather_path for mount in dbutils.fs.mounts()):
   dbutils.fs.mount(source = "wasbs://weatherdata@quebecstorageaccount.blob.core.windows.net/",mount_point = weather_path,extra_configs = #config)

if any(mount.mountPoint == mobilitydata_path for mount in dbutils.fs.mounts()):
   dbutils.fs.mount(source = "wasbs://mobilitydata@quebecstorageaccount.blob.core.windows.net/",mount_point = #mobilitydata_path,extra_configs = config)
  
if any(mount.mountPoint == covid_path for mount in dbutils.fs.mounts()):
   dbutils.fs.mount(source = "wasbs://covid@quebecstorageaccount.blob.core.windows.net/",mount_point = covid_path,extra_configs = config)
#endblock 1

#block 2
import pandas as pd
from pyspark.sql import SparkSession
from pyspark.sql.functions import regexp_replace, col, explode, size, from_unixtime, avg, min, max, expr,date_sub,to_date,max,sum,date_add
from pyspark.sql.types import StructField, StructType, StringType, IntegerType, FloatType

spark.conf.set("spark.sql.execution.arrow.enabled", "true")

countriesISO = [("FR", "FRA"), ("JP", "JPN"), ("US", "USA"), ("ES", "ESP"), ("BR", "BRA")]
countriesSchema = ["CountryISO", "CountryCode"]
df_countries = spark.createDataFrame(data = countriesISO, schema = countriesSchema)

df_covidData = spark.read.option("header","true").csv("/mnt/datasource/covid/csv/ECDCCases.csv_fe51ef49-4fc2-4e05-9f01-d4481ff133b2.csv")
df_covidData = df_countries.join(df_covidData, df_covidData.geoId == df_countries.CountryISO,"left").select(to_date(col("dateRep"),"dd/MM/yyyy").alias('Date'), col('geoId').alias('CountryISO'), col('countryterritoryCode').alias('CountryCode'), col("cases").alias('Cases'),col("deaths").alias("Fatalies"), col("countriesAndTerritories").alias('Country')).sort(col("Date").desc())



df_openSkyMap = spark.read.option("header","true").csv("/mnt/datasource/openskyarrivals/airportlist.csv")
df_openSkyData = spark.read.option("recursiveFileLookup","true").csv("/mnt/datasource/openskyarrivals/csv")
df_openSkyData = df_openSkyData.select(col("_c4").alias("ICAO"), col("_c3").alias("Date"))
df_openSkyData = df_openSkyData.join(df_openSkyMap, df_openSkyData.ICAO == df_openSkyMap.ICAO, "inner")
df_openSkyData = df_openSkyData.select(col("Country"), from_unixtime(col("Date"), 'yyyy-MM-dd').alias("Date"), col("iso").alias("CountryCode"))
df_openSkyData = df_openSkyData.groupBy("Country", "Date", "CountryCode").count()
df_openSkyData = df_openSkyData.select(col("Country"), col("Date"), col("CountryCode"), col("count").alias("Flights")).sort(col('Date').desc())

df_weatherData = spark.read.option("recursiveFileLookup","true").csv("/mnt/datasource/weatherdata/csv")
df_weatherData = df_weatherData.selectExpr('_c0 as CountryISO', 'substring(_c2, 1, 10) as Date', '_c3')
df_weatherData = df_weatherData.withColumn("Temperature", df_weatherData['_c3'].cast(FloatType())).drop('_c3')
df_weatherData = df_weatherData.groupBy("CountryISO", "Date").agg(avg("Temperature").alias("Temperature"))

df_mobilityMap = spark.read.option("header","true").csv("/mnt/datasource/mobilitydata/countries.csv")
df_mobilityData = spark.read.option("recursiveFileLookup","true").csv("/mnt/datasource/mobilitydata/csv/part-00000*")
df_mobilityData = df_mobilityData.join(df_mobilityMap, ((df_mobilityData._c3 == df_mobilityMap.EXTENDED_COUNTRY_CODE) & (df_mobilityData._c2 == df_mobilityMap.EBU_COUNTRY_CODE)), "inner")
df_mobilityData = df_mobilityData.selectExpr('_c1', 'substring(_c4, 1, 10) as Date', 'ISO as CountryCode')
df_mobilityData = df_mobilityData.withColumn("JAM", df_mobilityData['_c1'].cast(FloatType())).drop('_c1')
df_mobilityData = df_mobilityData.groupBy("CountryCode", "Date").agg(avg("JAM").alias("JAM"))

df_covidData.createOrReplaceTempView("COVID_VIEW")
df_openSkyData.createOrReplaceTempView("FLIGHTS_VIEW")
df_weatherData.createOrReplaceTempView("WEATHER_VIEW")
df_mobilityData.createOrReplaceTempView("MOBILITY_VIEW")


df_dataReport = spark.sql("select c.CountryISO as RawCountryISO, c.CountryCode, c.Country, c.Date as RawDate, f.Flights, w.Temperature, (m.JAM * 10) as JAM, c.Cases, c.Fatalies from COVID_VIEW c LEFT OUTER JOIN FLIGHTS_VIEW f ON c.CountryCode = f.CountryCode and c.Date = f.Date LEFT OUTER JOIN WEATHER_VIEW w ON c.CountryISO = w.CountryISO and c.Date = w.Date LEFT OUTER JOIN MOBILITY_VIEW m ON c.CountryCode = m.CountryCode and c.Date = m.Date") 

df_dates = df_dataReport.select(min('RawDate').alias('MinDate').cast('date'), max('RawDate').alias('MaxDate').cast('date'))
minDate = df_dates.select("MinDate").rdd.flatMap(lambda x: x).collect()
maxDate = df_dates.select("MaxDate").rdd.flatMap(lambda x: x).collect()

normalizedData = [("FR", minDate[0], maxDate[0]), ("JP", minDate[0], maxDate[0]), ("US", minDate[0], maxDate[0]), ("ES", minDate[0], maxDate[0]), ("BR", minDate[0], maxDate[0])]
normalizedSchema = ["CountryISO", "MinDate", "MaxDate"]
df_normalizedData = spark.createDataFrame(data = normalizedData, schema = normalizedSchema)
df_normalizedData = df_normalizedData.withColumn('Date', explode(expr('sequence(MinDate, MaxDate, interval 1 day)'))).drop('MinDate', 'MaxDate')

df_dataJoin = df_normalizedData.join(df_dataReport, ((df_normalizedData.CountryISO == df_dataReport.RawCountryISO) & (df_normalizedData.Date == df_dataReport.RawDate)), 'leftouter').drop('RawCountryISO', 'RawDate').sort(col('Date').desc(), col('CountryISO').asc())

panda_data = df_dataJoin.toPandas()

pdJP = panda_data[panda_data.CountryISO == 'JP']
pdJP.fillna(method ='bfill', inplace = True)
pdJP.fillna(method ='ffill', inplace = True)

pdUS = panda_data[panda_data.CountryISO == 'US']
pdUS.fillna(method ='bfill', inplace = True)
pdUS.fillna(method ='ffill', inplace = True)

pdFR = panda_data[panda_data.CountryISO == 'FR']
pdFR.fillna(method ='bfill', inplace = True)
pdFR.fillna(method ='ffill', inplace = True)

pdES = panda_data[panda_data.CountryISO == 'ES']
pdES.fillna(method ='bfill', inplace = True)
pdES.fillna(method ='ffill', inplace = True)


pdBR = panda_data[panda_data.CountryISO == 'BR']
pdBR.fillna(method ='bfill', inplace = True)
pdBR.fillna(method ='ffill', inplace = True)

pdDataConcat = pd.concat([pdJP, pdUS, pdFR, pdES,pdBR])
dfDataNormalized = spark.createDataFrame(pdDataConcat)
dfDataNormalized = dfDataNormalized.sort(col("Date").desc(), col("CountryISO").asc())
dfDataNormalized.createOrReplaceTempView("DATANORMALIZED_VIEW")
display(dfDataNormalized)
#endblock 2

#block 3


countries = pdDataConcat["Country"].unique()

dpDataCoefCorrelation = pd.DataFrame({'CountryCode':pd.Series([], dtype='str'),'Country':pd.Series([], dtype='str'),'CoefCorrMethod':pd.Series([], dtype='str'),'CoefCorrBy':pd.Series([], dtype='str'),'Cases':pd.Series([], dtype='double'),'Fatalies':pd.Series([], dtype='double'),'Flights':pd.Series([], dtype='double'),'JAM':pd.Series([], dtype='double'),'Temperature':pd.Series([], dtype='double')})

#Gap time for Covid data

pdCovidDifer = spark.sql("SELECT date_add(min(Date),15) DateCovidMin, date_sub(max(Date),15) DateCovidMax  FROM DATANORMALIZED_VIEW")

pdDifier= pdDataConcat

mindDate = pdCovidDifer.select("DateCovidMin").rdd.flatMap(lambda x: x).collect()
maxdDate = pdCovidDifer.select("DateCovidMax").rdd.flatMap(lambda x: x).collect()


filterDateCovidMin = pdDifier["Date"] >=  mindDate[0]
filterDateCovidMax = pdDifier["Date"] <= maxdDate[0]

pdCovidCasesFatalities = pdDifier.loc[filterDateCovidMin, ["Date,Cases","Fatalies"]]

# Data correlation


for x in countries:
  data = pdDifier.loc[pdDifier['Country'] == x]
  
  # Calculation of the correlation coefficient by Kendall the Pearson
  pdDataCorrelationPearson = ((data[['CountryISO','CountryCode','Country']]).head(2)).reset_index(drop=True) 
  pdForDataCorrPearson = (data[['Cases','Flights','Temperature', 'JAM','Fatalies']]).corr(method='pearson')
  pdDataCorrPearByCases = ((pdForDataCorrPearson.head(1)).rename_axis("Cases").rename_axis(None, axis=1)).reset_index(drop=True)   
  pdDataCorrPersByFatalies = ((pdForDataCorrPearson.tail(1)).rename_axis("Fatalies").rename_axis(None, axis=1)).reset_index(drop=True)
  pdDataCorrPearByCases["CoefCorrBy"]= "Cases"
  pdDataCorrPersByFatalies["CoefCorrBy"]= "Fatalies"
  pdForDataCorrPearsonConcat = (pd.concat([pdDataCorrPearByCases,pdDataCorrPersByFatalies])).reset_index(drop=True)  
  pdDataCorrelationPearson = pdDataCorrelationPearson.join(pdForDataCorrPearsonConcat)
  pdDataCorrelationPearson["CoefCorrMethod"]= "Pearson"
  dpDataCoefCorrelation = dpDataCoefCorrelation.append(pdDataCorrelationPearson)
  
  # Calculation of the correlation coefficient by Kendall the method
  pdDataCorrelationKendall = ((data[['CountryISO','CountryCode','Country']]).head(2)).reset_index(drop=True) 
  pdForDataCorrKendall = (data[['Cases','Flights','Temperature', 'JAM','Fatalies']]).corr(method='kendall')
  pdDataCorrKendallByCases = ((pdForDataCorrKendall.head(1)).rename_axis("Cases").rename_axis(None, axis=1)).reset_index(drop=True)   
  pdDataCorrKendallByFatalies = ((pdForDataCorrKendall.tail(1)).rename_axis("Fatalies").rename_axis(None, axis=1)).reset_index(drop=True)
  pdDataCorrKendallByCases["CoefCorrBy"]= "Cases"
  pdDataCorrKendallByFatalies["CoefCorrBy"]= "Fatalies"
  pdForDataCorrKendallConcat = (pd.concat([pdDataCorrKendallByCases,pdDataCorrKendallByFatalies])).reset_index(drop=True)  
  pdDataCorrelationKendall = pdDataCorrelationKendall.join(pdForDataCorrKendallConcat)
  pdDataCorrelationKendall["CoefCorrMethod"]= "Kendall"
  dpDataCoefCorrelation = dpDataCoefCorrelation.append(pdDataCorrelationKendall)
  
  # Calculation of the correlation coefficient by Spearman the method
  pdDataCorrelationSpearman = ((data[['CountryISO','CountryCode','Country']]).head(2)).reset_index(drop=True) 
  pdForDataCorrSpearman= (data[['Cases','Flights','Temperature', 'JAM','Fatalies']]).corr(method='kendall')
  pdDataCorrSpearmanByCases = ((pdForDataCorrSpearman.head(1)).rename_axis("Cases").rename_axis(None, axis=1)).reset_index(drop=True)   
  pdDataCorrSpearmanByFatalies = ((pdForDataCorrSpearman.tail(1)).rename_axis("Fatalies").rename_axis(None, axis=1)).reset_index(drop=True)
  pdDataCorrSpearmanByCases["CoefCorrBy"]= "Cases"
  pdDataCorrSpearmanByFatalies["CoefCorrBy"]= "Fatalies"
  pdForDataCorrSpearmanConcat = (pd.concat([pdDataCorrSpearmanByCases,pdDataCorrSpearmanByFatalies])).reset_index(drop=True)  
  pdDataCorrelationSpearman = pdDataCorrelationSpearman.join(pdForDataCorrSpearmanConcat)
  pdDataCorrelationSpearman["CoefCorrMethod"]= "Spearman"
  dpDataCoefCorrelation = dpDataCoefCorrelation.append(pdDataCorrelationSpearman)
  
dfDataCoefCorrelationReport = spark.createDataFrame(dpDataCoefCorrelation)
dfDataCoefCorrelationReport = dfDataCoefCorrelationReport.fillna(0)
dfDataCoefCorrelationReport = dfDataCoefCorrelationReport.sort(col("Country").asc(), col("CoefCorrMethod").asc(),col("CoefCorrBy").asc())

output_container_path = "wasbs://reports.@stquebecdatalake.blob.core.windows.net"
output_blob_folder = "%s/dataCorrelationReport" % output_container_path
# write the dataframe as a single file to blob storage
(dfDataCoefCorrelationReport
 .coalesce(1)
 .write
 .mode("overwrite")
 .format('csv')
 .save(output_blob_folder, header = 'true'))
# Get the name of the wrangled-data CSV file that was just saved to Azure blob storage (it starts with 'part-')
files = dbutils.fs.ls(output_blob_folder)
output_file = [x for x in files if x.name.startswith("part-")]
# Move the wrangled-data CSV file from a sub-folder (wrangled_data_folder) to the root of the blob container
# While simultaneously changing the file name
dbutils.fs.mv(output_file[0].path, "%s/dataCorrelationReportOutput.csv" % output_container_path)

display(dfDataCoefCorrelationReport)          
#endblock 3

#block 4
pdTrackerReport = spark.sql("SELECT CountryISO,Date,CountryCode,Country,Flights,Temperature,JAM,Cases,Fatalies,date_add(Date,15) as DateGap FROM DATANORMALIZED_VIEW WHERE to_date(Date) >= (SELECT date_sub(max(Date), 15) FROM DATANORMALIZED_VIEW) ORDER BY Date DESC, CountryISO ASC")

output_container_path = "wasbs://reports.@stquebecdatalake.blob.core.windows.net"
output_blob_folder = "%s/trackerReport" % output_container_path
# write the dataframe as a single file to blob storage
(pdTrackerReport
 .coalesce(1)
 .write
 .mode("overwrite")
 .format('csv')
 .save(output_blob_folder, header = 'true'))
# Get the name of the wrangled-data CSV file that was just saved to Azure blob storage (it starts with 'part-')
files = dbutils.fs.ls(output_blob_folder)
output_file = [x for x in files if x.name.startswith("part-")]
# Move the wrangled-data CSV file from a sub-folder (wrangled_data_folder) to the root of the blob container
# While simultaneously changing the file name
dbutils.fs.mv(output_file[0].path, "%s/trackerReportOutput.csv" % output_container_path)

display(pdTrackerReport)
#endblock 4

#block 5
output_container_path = "wasbs://reports.@stquebecdatalake.blob.core.windows.net"
output_blob_folder = "%s/covidMultiline" % output_container_path
# write the dataframe as a single file to blob storage
(dfDataNormalized
 .coalesce(1)
 .write
 .mode("overwrite")
 .format('csv')
 .save(output_blob_folder, header = 'true'))
# Get the name of the wrangled-data CSV file that was just saved to Azure blob storage (it starts with 'part-')
files = dbutils.fs.ls(output_blob_folder)
output_file = [x for x in files if x.name.startswith("part-")]
# Move the wrangled-data CSV file from a sub-folder (wrangled_data_folder) to the root of the blob container
# While simultaneously changing the file name
dbutils.fs.mv(output_file[0].path, "%s/covidMultilineOutput.csv" % output_container_path)

display(dfDataNormalized)
#endblock 5

#block 6
covidChoroplethReport = dfDataNormalized.select(col("CountryISO"),col("CountryCode"),col("Country"),col("Flights"),col("Temperature"),col("JAM"),col("Cases")).groupBy('CountryISO', 'CountryCode', 'Country').agg(sum('Flights').alias('Flights'), avg('Temperature').alias('Temperature'), avg('JAM').alias('JAM'), sum('Cases').alias('Cases')).sort(col("CountryISO").asc())
  
output_container_path = "wasbs://reports.@stquebecdatalake.blob.core.windows.net"
output_blob_folder = "%s/covidChoropleth" % output_container_path
# write the dataframe as a single file to blob storage
(covidChoroplethReport
 .coalesce(1)
 .write
 .mode("overwrite")
 .format('csv')
 .save(output_blob_folder, header = 'true'))
# Get the name of the wrangled-data CSV file that was just saved to Azure blob storage (it starts with 'part-')
files = dbutils.fs.ls(output_blob_folder)
output_file = [x for x in files if x.name.startswith("part-")]
# Move the wrangled-data CSV file from a sub-folder (wrangled_data_folder) to the root of the blob container
# While simultaneously changing the file name
dbutils.fs.mv(output_file[0].path, "%s/covidChoroplethOutput.csv" % output_container_path)

display(covidChoroplethReport)
#endblock 6
