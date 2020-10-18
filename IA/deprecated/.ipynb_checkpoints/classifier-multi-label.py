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

nltk.download('stopwords')
yelp = pd.read_csv('reviewscategorized.csv')
yelp['caption'] = yelp['caption'].astype(str)
treated = yelp.drop(['subCluster'], axis=1, inplace=False)
labelCategories = ["Atencion", "Operaciones", "Locales"]

treated['caption_cleaned'] = ''
for label in labelCategories:
    treated[label]=0

for it in range(0,len(treated['caption'])):
    for label in labelCategories:
        if treated["clusterLabel"][it] == label:
            treated[label][it] = 1
    if '(Traducido por Google)' in treated['caption'][it]:
        treated['caption_cleaned'][it] = treated['caption'][it].split('(Original)')[0].split('(Traducido por Google)')[1]
    elif 'nan' == treated['caption'][it]:
        treated['caption_cleaned'][it] = ''
    else:
        treated['caption_cleaned'][it] = treated['caption'][it]

#Removing punctuation, html crap, empty comments, stopwords
treated = treated[treated.caption_cleaned != '']
treated['caption_cleaned'] = treated['caption_cleaned'].str.lower()
treated['caption_cleaned'] = treated['caption_cleaned'].apply(cleanHtml)
treated['caption_cleaned'] = treated['caption_cleaned'].apply(cleanPunc)
stopwordsSpanish = set(stopwords.words('spanish'))
treated['caption_cleaned'] = treated['caption_cleaned'].apply(removeStopWords)

#Stemming (transform words into semantics)
stemmer = SnowballStemmer("spanish")
treated['caption_cleaned'] = treated['caption_cleaned'].apply(stemming)

print('HEAD:')
print(treated.info())
# (TF-IDF) of a word gives a product of how frequent this word is in 
# the document multiplied by how unique the word is w.r.t. the entire 
# corpus of documents.
vectorizer = TfidfVectorizer(strip_accents='unicode', analyzer='word', ngram_range=(1,3), norm='l2')
print(treated.head()['caption_cleaned'])
vectorizer.fit(treated['caption_cleaned'])

train, test = train_test_split(treated, random_state=1, test_size=0.1, shuffle=True)

#Cut set in test and train already vectorized
x_train = vectorizer.transform(train['caption_cleaned'])
x_test = vectorizer.transform(test['caption_cleaned'])

# Traditional two-class and multi-class problems can both be cast into 
# multi-label ones by restricting each instance to have only one label.
#  On the other hand, the generality of multi-label problems inevitably 
# makes it more difficult to learn. An intuitive approach to solving multi-label 
# problem is to decompose it into multiple independent binary classification 
# problems (one per label).
# OneVsRest approach

# Using pipeline for applying logistic regression and one vs rest classifier
LogReg_pipeline = Pipeline([
                ('clf', OneVsRestClassifier(LogisticRegression(solver='sag'), n_jobs=-1)),
            ])

for label in labelCategories:
    print('**Processing {} comments...**'.format(label))
    LogReg_pipeline.fit(x_train, train[label])

    prediction = LogReg_pipeline.predict(x_test)
    print('{}'.format(prediction))
    print('Test accuracy is {}'.format(accuracy_score(test[label], prediction)))
    print("\n")