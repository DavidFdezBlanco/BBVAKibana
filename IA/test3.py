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

nltk.download('stopwords')


# if not sys.warnoptions:
#     warnings.simplefilter("ignore")

# def cleanHtml(sentence):
#     cleanr = re.compile('<.*?>')
#     cleantext = re.sub(cleanr, ' ', str(sentence))
#     return cleantext

# def cleanPunc(sentence): #function to clean the word of any punctuation or special characters
#     cleaned = re.sub(r'[?|!|\'|"|#]',r'',sentence)
#     cleaned = re.sub(r'[.|,|)|(|\|/]',r' ',cleaned)
#     cleaned = cleaned.strip()
#     cleaned = cleaned.replace("\n"," ")
#     return cleaned

# def removeStopWords(sentence):
#     global stopwordsSpanish
#     # Check characters to see if they are in punctuation
#     nopunc = [char for char in sentence if char not in string.punctuation]
#     # Join the characters again to form the string.
#     nopunc = ''.join(nopunc)
#     splited = [word for word in nopunc.split() if word.lower() not in stopwordsSpanish]
#     return ' '.join(splited)

# def stemming(sentence):
#     stemSentence = ""
#     for word in sentence.split():
#         stem = stemmer.stem(word)
#         stemSentence += stem
#         stemSentence += " "
#     stemSentence = stemSentence.strip()
#     return stemSentence

# #yelp = pd.read_csv('reviews_spain_total.csv')
# #TEST CLEAN
# #clusterLabel,subCluster,caption
# testSet = pd.read_csv('reviewscategorized.csv')
# testSetTreated = testSet.drop(['clusterLabel','subCluster'], axis=1, inplace=False)
# testSetTreated['caption'] = testSetTreated['caption'].astype(str)
# testSetTreated['caption_cleaned'] = ''

# for it in range(0,len(testSetTreated['caption'])):
#     if '(Traducido por Google)' in testSetTreated['caption'][it]:
#         testSetTreated['caption_cleaned'][it] = testSetTreated['caption'][it].split('(Original)')[0].split('(Traducido por Google)')[1]
#     elif 'nan' == testSetTreated['caption'][it]:
#         testSetTreated['caption_cleaned'][it] = ''
#     else:
#         testSetTreated['caption_cleaned'][it] = testSetTreated['caption'][it]

# #Removing punctuation, html crap, empty comments, stopwords
# testSetTreated = testSetTreated[testSetTreated.caption_cleaned != '']
# testSetTreated['caption_cleaned'] = testSetTreated['caption_cleaned'].str.lower()
# testSetTreated['caption_cleaned'] = testSetTreated['caption_cleaned'].apply(cleanHtml)
# testSetTreated['caption_cleaned'] = testSetTreated['caption_cleaned'].apply(cleanPunc)
# #Stemming (transform words into semantics)
# stemmer = SnowballStemmer("spanish")
# testSetTreated['caption_cleaned'] = testSetTreated['caption_cleaned'].apply(stemming)
# stopwordsSpanish = set(stopwords.words('spanish'))
# stopwordsSpanish.add('bien')
# stopwordsSpanish.add('buen')
# stopwordsSpanish.add('bueno')
# stopwordsSpanish.add('pesim')
# stopwordsSpanish.add('mal')
# stopwordsSpanish.add('excel')
# stopwordsSpanish.add('excelent')
# testSetTreated['caption_cleaned'] = testSetTreated['caption_cleaned'].apply(removeStopWords)
# vectorizer = TfidfVectorizer(strip_accents='unicode', analyzer='word', ngram_range=(1,3), norm='l2')

# yelp = pd.read_csv('data_world_bbva.csv')
# yelp.head()
# treated = yelp.drop(['id_review','relative_date','retrieval_date','username','n_review_user','n_photo_user','url_user','city','country'], axis=1, inplace=False)

# treated['caption'] = treated['caption'].astype(str)
# treated['caption_cleaned'] = ''

# for it in range(0,len(treated['caption'])):
#     if '(Traducido por Google)' in treated['caption'][it]:
#         treated['caption_cleaned'][it] = treated['caption'][it].split('(Original)')[0].split('(Traducido por Google)')[1]
#     elif 'nan' == treated['caption'][it]:
#         treated['caption_cleaned'][it] = ''
#     else:
#         treated['caption_cleaned'][it] = treated['caption'][it]
# #Removing punctuation, html crap, empty comments, stopwords
# treated = treated[treated.caption_cleaned != '']
# treated['caption_cleaned'] = treated['caption_cleaned'].str.lower()
# treated['caption_cleaned'] = treated['caption_cleaned'].apply(cleanHtml)
# treated['caption_cleaned'] = treated['caption_cleaned'].apply(cleanPunc)
# #Stemming (transform words into semantics)
# #stemmer = SnowballStemmer("spanish")
# treated['caption_cleaned'] = treated['caption_cleaned'].apply(stemming)

# stopwordsSpanish = set(stopwords.words('spanish'))
# stopwordsSpanish.add('bien')
# stopwordsSpanish.add('buen')
# stopwordsSpanish.add('bueno')
# stopwordsSpanish.add('pesim')
# stopwordsSpanish.add('mal')
# stopwordsSpanish.add('excel')
# stopwordsSpanish.add('excelent')
# treated['caption_cleaned'] = treated['caption_cleaned'].apply(removeStopWords)

treated = pd.read_csv('treated.csv')
print(treated.info())
treated.drop(['nada'], axis=1, inplace=True)

treated['caption_cleaned'] = treated['caption_cleaned'].astype(str)

train, test = train_test_split(treated, random_state=1, test_size=0.001, shuffle=True)

vectorizer = TfidfVectorizer(strip_accents='unicode', analyzer='word', ngram_range=(1,3), norm='l2')
#fit = vectorizer.fit(treated['caption_cleaned'])
X = vectorizer.fit_transform(treated['caption_cleaned'])

true_k = 5
model = KMeans(n_clusters=true_k, init='k-means++', max_iter=100, n_init=1)
model.fit(X)

print("Top terms per cluster:")
order_centroids = model.cluster_centers_.argsort()[:, ::-1]
terms = vectorizer.get_feature_names()
for i in range(true_k):
    print("Cluster %d:" % i),
    for ind in order_centroids[i, :10]:
        print(' %s' % terms[ind]),
    print

print("\n")
print("Prediction")

for it in range(0,len(['caption_cleaned'])):
    prediction = model.predict(vectorizer.transform([testSetTreated['caption_cleaned'][it]]))
    print(testSetTreated['caption'][it])
    print(prediction)
