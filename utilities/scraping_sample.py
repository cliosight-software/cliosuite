## Author: Jigisha Aryya, email: cliosight@gmail.com, website: https://cliosight.com
## Please install python and mysql and create the database manually before using this script. You can modify this for a different use case
import re
from bs4 import BeautifulSoup as BeautifulSoup
import urllib2
import xlrd 
import pandas as pd
import requests
import psycopg2
import datetime
import time
import sys

from tabulate import tabulate

if len(sys.argv)!=2:
   print "Please enter the correct number of command line arguments"
   quit()
  
loc = ("~/snapdeal.xlsx") 
  
wb = xlrd.open_workbook(loc) 
sheet = wb.sheet_by_index(0) 
sheet.cell_value(0, 0) 
price_history=[]
  
for i in range(sheet.nrows): 
    quote_page = sheet.cell_value(i, 0)
    page = urllib2.urlopen(quote_page)
    soup = BeautifulSoup(page, 'lxml')

    images=[]

    value_productNamePDP = soup.find('input', {'id':'productNamePDP'})['value']
    print 'Product Name:' ,value_productNamePDP
    productName = value_productNamePDP

    links = soup.findAll(itemprop="image")
    for link in links:
        print(link["src"])
        images.append(link)

    value_price = soup.find('input', {'id':'productPrice'})['value']
    print 'Product Price: Rs.',value_price
    productPrice = value_price
    price_history.append(productPrice)

    value_shippingCharges = soup.find('input', {'id':'shippingCharges'})['value']
    print 'Shipping Charges: Rs.', value_shippingCharges
    shippingCharges = value_shippingCharges

    sum = float(value_price)+float(value_shippingCharges)
    print 'Total payable amount per unit : Rs.', sum
    totalPayableAmt = sum

    try:
        value_ratingValue = soup.find('span', {'itemprop':'ratingValue'}).text
        starRating = float(value_ratingValue)
        print 'Rating /5 :', starRating
    except:
           print 'Ratings not available'
    try:
        value_ratingCount = soup.find('span', {'itemprop':'ratingCount'}).text
        ratingCount = int(value_ratingCount)
        print 'Number of ratings :', ratingCount
    except:
           print 'Rating count not available'
    try:
        value_reviewCount = soup.find('span', {'itemprop':'reviewCount'}).text
        reviewCount = int(value_reviewCount)
        print 'Review count :', reviewCount
    except:
           print 'Reviews not available'


    res = requests.get(quote_page)
    soup = BeautifulSoup(res.content,'lxml')
    table = soup.find_all('table', class_='product-spec') 
    for tbl in table:
        try: 
            rows = tbl.find_all('tr')
            for tr in rows:
                cols = tr.find_all('td')
                print cols.text.strip()
        except:
               continue

        df = pd.read_html(str(tbl))
        print( tabulate(df[0], headers='keys', tablefmt='psql') )



    highlights = soup.findAll('span',class_='h-content')
    print 'Highlights:'

    for highlight in highlights:
        try:
            feature = highlight.text.strip()
            print feature
        except:
               continue

    descr = soup.findAll('div', {'itemprop':'description'})
    print 'Description:'
    for des in descr:
        try:
            print des.getText().strip()
        except:
               continue

#testing price tracking...

conn = psycopg2.connect(database = "snapdeal", user = "snapdeal", password = "snapdeal", host = "127.0.0.1", port = "5432")
print "Opened database successfully"

cur = conn.cursor()

ts = time.time()

st = str(sys.argv[1])

if str(sys.argv[1]) == "--n":
   st = datetime.datetime.fromtimestamp(ts).strftime('%Y%m%d_%H%M%S')
   productColList=""
   cur.execute("DROP TABLE PRODUCT_INFO")
   conn.commit()
   print "Drop table product_info successful"

   cur.execute('''create table product_info (ID INT PRIMARY KEY NOT NULL, URL TEXT NOT NULL);''')
   conn.commit()
   print "Table PRODUCT_INFO created successfully"

   productColList = "Timestamp BIGINT"
   ts = time.time()
   st = datetime.datetime.fromtimestamp(ts).strftime('%Y%m%d_%H%M%S')

   for i in range(sheet.nrows):
       productUrl = sheet.cell_value(i, 0)
       productID = i
       cur.execute("INSERT INTO product_info VALUES (%s, %s)", (productID, productUrl))
       conn.commit()
       productColList += ", PRICE_PROD_NO"+str(i)+" FLOAT NOT NULL"
       
   query_priceh_tablecreate = "create table price_history_"+st+" ("+productColList+")"       
   cur.execute(query_priceh_tablecreate)
   conn.commit()       
   print "Table price_history created successfully"

st_rec = datetime.datetime.fromtimestamp(ts).strftime('%Y%m%d%H%M%S')
insert_query = "INSERT INTO PRICE_HISTORY_"+st+" VALUES ("+str(st_rec)
for price in price_history:
    insert_query +=", "+str(price)
    
insert_query+=")"
print insert_query   
cur.execute(insert_query)
conn.commit() 
print "Insert into table price_history done successfully"
conn.close()
