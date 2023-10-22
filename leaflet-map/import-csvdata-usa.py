import csv
import urllib.request
import gzip
from io import BytesIO
import pandas as pd
import json
import sys
from datetime import datetime, timedelta
import pytz

def compressFileToString(inputFile):
  """
  read the given open file, compress the data and return it as string.
  """
  stream = BytesIO()
  compressor = gzip.GzipFile(fileobj=stream, mode='w')
  while True:  # until EOF
    chunk = inputFile.read(8192)
    if not chunk:  # EOF?
      compressor.close()
      return stream.getvalue()
    compressor.write(chunk)

def download_covid19_data(file_date):
  """Downloads the COVID-19 data for the given date.

  Args:
    file_date: The date of the COVID-19 data to download.

  Returns:
    A Pandas DataFrame containing the COVID-19 data.
  """

  url = f'https://raw.githubusercontent.com/nytimes/covid-19-data/master/{file_date}'
  try:
    response = urllib.request.urlopen(url)
  except urllib.error.URLError as err:
    print(err)
    sys.exit(1)

  covid19_data = pd.read_csv(response, iterator=True, chunksize=1000)  
  covid19_df = pd.concat([chunk for chunk in covid19_data])
  date_value = '2023-03-23' # latest COVID-19 stats
  filtered_df = covid19_df[covid19_df['date'] == date_value]
  return filtered_df

def update_usacounties_json(covid19_df, file_local, file_www):
  """Updates the local usacounties.json file with the given COVID-19 data.

  Args:
    covid19_df: A Pandas DataFrame containing the COVID-19 data.
    file_local: The path to the local usacounties.json file.
    file_www: The path to the web usacounties.json file.
  """

  with open(file_local, 'r') as f_local:
    data = json.load(f_local)

  for updaterow in covid19_df.itertuples():
    for row in data['features']:
      if ((row['properties']['GEOID']) == updaterow.fips):
        row['properties']['COVID19_CASES'] = updaterow.cases
        row['properties']['COVID19_DEATHS'] = updaterow.deaths
  f_local.close()

  with open(file_www, 'w+') as f_www:
    json.dump(data, f_www, separators=(',', ':'))
    compressFileToString(f_www)
  f_www.close()

if __name__ == '__main__':
  file_date = 'us-counties-2023.csv'
  covid19_df = download_covid19_data(file_date)
  update_usacounties_json(covid19_df, '/usr/local/bin/www-scripts/usacounties.json', '/var/www/html/harmonyideas.com/map/usacounties.json')
