import pandas as pd
import psycopg2

data = pd.read_csv('raw/reviews_spain_total.csv')
#id_review,caption,relative_date,retrieval_date,rating,username,n_review_user,n_photo_user,url_user,city,country
data['rating'].astype(str)
data['n_review_user'].astype(str)
print(data.head())
try:
    connection = psycopg2.connect(user="user",
                                    password="password",
                                    host="52.15.170.43",
                                    port="5432",
                                    database="dev_db")
    cursor = connection.cursor()
    country = "España"
    company = "BBVA"
    for it in range(0,len(data['caption'])):
        print(data['caption'][it])
        cursor.execute("INSERT INTO public.rawdata (\"comment\",\"relative_date\",\"rating\",\"username\",\"n_review_user\",\"url_user\",\"company\",\"country\") VALUES(%s,%s,%s,%s,%s,%s,%s,%s)", (str(data['caption'][it]), str(data['relative_date'][it]), str(data['rating'][it]),str(data['username'][it]),str(data['n_review_user'][it]),str(data['url_user'][it]),company,country))
        connection.commit()

except (Exception, psycopg2.Error) as error :
    print (error)


finally:
    #closing database connection.
    if(connection):
        cursor.close()
        connection.close()
        print("PostgreSQL connection is closed")