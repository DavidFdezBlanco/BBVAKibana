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

vectorizer = pickle.load(open("vectorizer.pickle", "rb"))
model = pickle.load(open("model.pickle", "rb"))

treated = pd.read_csv('treated.csv')
print(treated.info())
treated.drop(['nada'], axis=1, inplace=True)

treated['caption_cleaned'] = treated['caption_cleaned'].astype(str)

train, test = train_test_split(treated, random_state=72, test_size=0.001, shuffle=True)

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
    clusters[i]['label'] = vara[0:len(vara)-1]
print(len(clusters))


for it in range(0,len(clusters)):
    print(clusters[it])
#####################################################
import pandas as pd
import psycopg2

try:
    connection = psycopg2.connect(user="user",
                                    password="password",
                                    host="52.15.170.43",
                                    port="5432",
                                    database="dev_db")
    cursor = connection.cursor()
    for it in range(0,len(clusters)):
        print(clusters[it])
        cursor.execute("INSERT INTO public.cluster (\"id\",\"label\") VALUES(%s,%s)", (clusters[it]['key'], str(clusters[it]['label'])))
        connection.commit()

except (Exception, psycopg2.Error) as error :
    print (error)


finally:
    #closing database connection.
    if(connection):
        cursor.close()
        connection.close()
        print("PostgreSQL connection is closed")

#####################################################
print("\n")
print("Prediction")

Y = vectorizer.transform(test['caption_cleaned'])
prediction = model.predict(Y)

for it in range(0,true_k):
    print("*****************")
    print("Cluster" + str(it))
    i = 0
    for index,row in test.iterrows():
        if(prediction[i]==it):
            print(str(prediction[i]) +" "+ row['caption'])
        i = i+1

print('saving model')
