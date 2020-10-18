from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from nltk.corpus import stopwords
import numpy as np
import pandas as pd
import nltk
from nltk.corpus import stopwords
import string
from sklearn.feature_extraction.text import CountVectorizer
import nltk
from nltk.corpus import stopwords
from nltk.stem.snowball import SnowballStemmer
import re
import sys
import warnings
from scipy.sparse import csr_matrix, lil_matrix
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score
from sklearn.multiclass import OneVsRestClassifier
from sklearn.model_selection import train_test_split
import seaborn as sns
import pickle
import pandas as pd
import psycopg2

if not sys.warnoptions:
    warnings.simplefilter("ignore")

def cleanHtml(sentence):
    cleanr = re.compile('<.*?>')
    cleantext = re.sub(cleanr, ' ', str(sentence))
    return cleantext

def cleanPunc(sentence): #function to clean the word of any punctuation or special characters
    cleaned = re.sub(r'[?|!|\'|"|#]',r'',sentence)
    cleaned = re.sub(r'[.|,|)|(|\|/]',r' ',cleaned)
    cleaned = cleaned.strip()
    cleaned = cleaned.replace("\n"," ")
    return cleaned

def removeStopWords(sentence):
    global stopwordsSpanish
    # Check characters to see if they are in punctuation
    nopunc = [char for char in sentence if char not in string.punctuation]
    # Join the characters again to form the string.
    nopunc = ''.join(nopunc)
    splited = [word for word in nopunc.split() if word.lower() not in stopwordsSpanish]
    return ' '.join(splited)

def stemming(sentence):
    stemSentence = ""
    for word in sentence.split():
        stem = stemmer.stem(word)
        stemSentence += stem
        stemSentence += " "
    stemSentence = stemSentence.strip()
    return stemSentence


vectorizer = pickle.load(open("model/vectorizer.pickle", "rb"))
model = pickle.load(open("model/model.pickle", "rb"))

# For testing
# treated = pd.read_csv('treated.csv')
# print(treated.info())
# treated.drop(['nada'], axis=1, inplace=True)

yelp = pd.read_csv('data_world_bbva.csv')
yelp.head()
treated = yelp.drop(['id_review','relative_date','retrieval_date','username','n_review_user','n_photo_user','url_user','city'], axis=1, inplace=False)
treated['rating']=treated['rating'].astype(float)
treated['caption'] = treated['caption'].astype(str)
treated['caption_cleaned'] = ''

for it in range(0,len(treated['caption'])):
    if '(Traducido por Google)' in treated['caption'][it]:
        treated['caption_cleaned'][it] = treated['caption'][it].split('(Original)')[0].split('(Traducido por Google)')[1]
    elif 'nan' == treated['caption'][it]:
        treated['caption_cleaned'][it] = ''
    else:
        treated['caption_cleaned'][it] = treated['caption'][it]
#Removing punctuation, html crap, empty comments, stopwords

for it in range(0,len(treated['caption'])):
    if(len(treated['caption_cleaned'][it])<20):
        treated['caption_cleaned'][it] = ''
    elif(len(treated['caption_cleaned'][it])>450):
        treated['caption_cleaned'][it] = ''

treated = treated[treated.caption_cleaned != '']
treated['caption_cleaned'] = treated['caption_cleaned'].str.lower()
treated['caption_cleaned'] = treated['caption_cleaned'].apply(cleanHtml)
treated['caption_cleaned'] = treated['caption_cleaned'].apply(cleanPunc)

#Stemming (transform words into semantics)
stemmer = SnowballStemmer("spanish")
treated['caption_cleaned'] = treated['caption_cleaned'].apply(stemming)
stopwordsSpanish = set(stopwords.words('spanish'))
stopwordsSpanish.add('bien')
stopwordsSpanish.add('buen')
stopwordsSpanish.add('bueno')
stopwordsSpanish.add('pesim')
stopwordsSpanish.add('mal')
stopwordsSpanish.add('excel')
stopwordsSpanish.add('excelent')
stopwordsSpanish.add('peor')
stopwordsSpanish.add('mejor')
treated['caption_cleaned'] = treated['caption_cleaned'].apply(removeStopWords)
treated['caption_cleaned'] = treated['caption_cleaned'].astype(str)

#####################################################
#labels a introducir a mano, crea clusters on db
true_k = 12
print("Top terms per cluster:")
order_centroids = model.cluster_centers_.argsort()[:, ::-1]
terms = vectorizer.get_feature_names()
separator = ','
clusters = {}
for i in range(true_k):
    print("Cluster %d:" % i)
    vara = ''
    for ind in order_centroids[i, :10]:
        print(' %s' % terms[ind])
        vara += terms[ind] + ','
    print(vara)
    clusters[i] = {}
    clusters[i]['key'] = i
    clusters[i]['words'] = vara[0:len(vara)-1]
print(len(clusters))

# for it in range(0,len(clusters)):
#     print(clusters[it])

# try:
#     connection = psycopg2.connect(user="user",
#                                     password="password",
#                                     host="3.17.238.237",
#                                     port="5432",
#                                     database="dev_db")
#     cursor = connection.cursor()
#     for it in range(0,len(clusters)):
#         print(clusters[it])
#         cursor.execute("INSERT INTO public.cluster (\"id\",\"words\") VALUES(%s,%s)", (clusters[it]['key'], str(clusters[it]['words'])))
#         connection.commit()

# except (Exception, psycopg2.Error) as error :
#     print (error)

# finally:
#     #closing database connection.
#     if(connection):
#         cursor.close()
#         connection.close()
#         print("PostgreSQL connection is closed")

#####################################################

#####################################################
# Ratings table fullfill with predicted

print("\n")
print("Prediction")

Y = vectorizer.transform(treated['caption_cleaned'])
prediction = model.predict(Y)

for it in range(0,true_k):
    print("*****************")
    print("Cluster" + str(it))
    i = 0
    for index,row in treated.iterrows():
        if(prediction[i]==it):
            print(str(prediction[i]) +" "+ row['caption'])
        i = i+1

try:
    connection = psycopg2.connect(user="user",
                                    password="password",
                                    host="3.17.238.237",
                                    port="5432",
                                    database="dev_db")
    cursor = connection.cursor()

    i = 0
    for index,row in treated.iterrows():
        print("Insering data " + str(i))
        cursor.execute("INSERT INTO public.ratings (\"punctuation\",\"comment\",\"country\",\"company\",\"cluster_id\") VALUES(%s,%s,%s,%s,%s)", (str(row['rating']), str(row['caption']), str(row['country']),"BBVA", str(prediction[i])))
        connection.commit()
        i = i+1

except (Exception, psycopg2.Error) as error :
    print (error)

finally:
    #closing database connection.
    if(connection):
        cursor.close()
        connection.close()
        print("PostgreSQL connection is closed")