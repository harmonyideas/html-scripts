import urllib.request
import gzip
from io import BytesIO
import pandas as pd
import json
import sys
from datetime import datetime,timedelta
import pytz

def download_covid19_data(file_date):
  """Downloads the COVID-19 data for the given date.

  Args:
    file_date: The date of the COVID-19 data to download.

  Returns:
    A Pandas DataFrame containing the COVID-19 data.
  """

  url = f"https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/{FILE_DATE}"
  try:
    response = urllib.request.urlopen(url)
  except urllib.error.URLError as err:
    print(err)
    sys.exit(1)

  covid19_data = pd.read_csv(response, iterator=True, chunksize=1000)
  covid19_df = pd.concat([chunk[chunk['Province_State'] == 'New Jersey'] for chunk in covid19_data])
  return covid19_df

def update_njcounties_json(covid19_df, file_local, file_www):
  """Updates the local njcounties.json file with the given COVID-19 data.

  Args:
    covid19_df: A Pandas DataFrame containing the COVID-19 data.
    file_local: The path to the local njcounties.json file.
  """

  with open(file_local, 'r') as f_local:
    data = json.load(f_local)

  for updaterow in covid19_df.itertuples():
    for row in data['features']:
      if (int(float(row['properties']['GEOID'])) == updaterow.FIPS):
        row['properties']['COVID19_CASES'] = updaterow.Confirmed
        row['properties']['COVID19_DEATHS'] = updaterow.Deaths

  with open(file_www, 'w+') as f_www:
    json.dump(data, f_www, separators=(',', ":"))

#file_date = datetime.datetime.now(pytz.timezone('US/Eastern'))
#file_date -= datetime.timedelta(days=1)
#file_date = file_date.strftime("%m-%d-%Y") + '.csv'
FILE_DATE = '03-09-2023.csv'

covid19_df = download_covid19_data(FILE_DATE)
update_njcounties_json(covid19_df, '/usr/local/bin/www-scripts/njcounties.json', '/var/www/html/harmonyideas.com/map/njcounties.json')
