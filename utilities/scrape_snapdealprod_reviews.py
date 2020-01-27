import re
import bs4 as bs4
from bs4 import BeautifulSoup as BeautifulSoup
import urllib.request
import pandas as pd
import sys
import requests
import json
import nltk

def list_properties(link):
    quote_page = str(link)
    page = urllib.request.urlopen(quote_page)
    soup = BeautifulSoup(page, 'lxml')

    html = urllib.request.urlopen(quote_page).read()
    soup_ = BeautifulSoup(html, 'lxml')
    raw = soup_.get_text(strip=True)

    value_productId = soup.find('input', {'id':'productId'})['value']

    start = "bucketLabelNames\": \"["
    end = "]\""
    param3 =  raw[raw.find(start)+len(start):raw.find(end)]
    link_ = link.replace("https://","")
    paramParts = link_.split('/',4)

    url = "https://www.snapdeal.com/acors/web/getReviewsAndRatings/v2"

    if '?' in paramParts[3]:
       parts = paramParts[3].split("?")
       paramParts[3] = parts[0]
    elif '#' in paramParts[3]:
         parts = paramParts[3].split("#")
         paramParts[3] = parts[0]

    payload = "{\"productId\":\""+value_productId+"\", \"pageUrl\":\"product/"+paramParts[2]+"/"+paramParts[3]+"\", \"bucketLabelNames\": [\""+param3+"\"]}"
    headers = {
    'Content-Type': "application/json",
    'cache-control': "no-cache",
    }

    response = requests.request("POST", url, data=payload, headers=headers)

    soup = BeautifulSoup(response.text, 'lxml')


    article = soup.findAll("div", {"class":"user-review"})

    if article is None or article is "":
       return

    comment = ""

    headingsArray = []
    revNameArray = []

    headings = []
    reviewer = []
    comments = []

    for review in article:
        headingsArray.append(review.find("div", {"class":"head"}))
        revNameArray.append(review.find("div", {"class":"_reviewUserName"}))
        comments.append(review.find('p').get_text())

    for heading in headingsArray:
        headings.append(heading.text.strip())

    for reviewerName in revNameArray:
        reviewer.append(reviewerName.text.strip())


    j = len(headings)
    k = len(reviewer)
    l = len(comments)

    i=0

    comment_heading = "<br/><h4 style=\"display: flex; justify-content: center;\"><u>Buyer Reviews</u></h4>"

    for heading in headings:
        comment += "\n"+"<h5 style=\"display: flex; justify-content: center;\">"+heading+" "+reviewer[i]+"</h5>"+"\n"+"<h5 style=\"display: flex; justify-content: center;\">"+comments[i]+"</h5><br/>"+"\n"
        i +=1
    if len(comment) > 4:
       comment = comment_heading+comment

    print(comment)

list_properties(str(sys.argv[1]))


