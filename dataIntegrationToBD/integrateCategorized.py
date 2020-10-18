import pandas as pd
import psycopg2

data = pd.read_csv('categorized/reviewscategorized.csv')
#clusterLabel,subCluster,caption
print(data.head())
try:
    connection = psycopg2.connect(user="user",
                                    password="password",
                                    host="52.15.170.43",
                                    port="5432",
                                    database="dev_db")
    cursor = connection.cursor()
    for it in range(0,len(data['caption'])):
        print(data['caption'][it])
        cursor.execute("INSERT INTO public.categorizeddata (\"clusterLabel\",\"subClusterLabel\",\"comment\") VALUES(%s, %s, %s)", (data['clusterLabel'][it], data['subCluster'][it], data['caption'][it]))
        connection.commit()

except (Exception, psycopg2.Error) as error :
    print (error)

finally:
    #closing database connection.
    if(connection):
        cursor.close()
        connection.close()
        print("PostgreSQL connection is closed")