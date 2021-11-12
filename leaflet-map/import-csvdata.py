import urllib2
import pandas as pd
import json
import sys
import datetime
import timedelta
import pytz

file_date = datetime.datetime.now(pytz.timezone('US/Eastern'))
file_date -= datetime.timedelta(days=1)
file_date = file_date.strftime("%m-%d-%Y") + '.csv'
url = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/%s' % file_date

try:
    response = urllib2.urlopen(url)
except urllib2.URLError as err:
    print(err)
    sys.exit(1)

covid19_data = pd.read_csv(response, iterator=True, chunksize=1000)
covid19_df = pd.concat(
    [chunk[chunk['Province_State'] == 'New Jersey'] for chunk in covid19_data])
file_local = '/usr/local/bin/www-scripts/njcounties.json'
file_www = '/var/www/html/public/map/njcounties.json'
with open(file_local, 'r') as f:
    data = json.load(f)

for updaterow in covid19_df.itertuples():
    for row in data['features']:
        if (row['properties']['NAME'] == updaterow.Admin2):
            row['properties']['COVID19_CASES'] = updaterow.Confirmed
            row['properties']['COVID19_DEATHS'] = updaterow.Deaths


with open(file_www, 'w+') as f:
    json.dump(data, f, separators=(',', ":"))
