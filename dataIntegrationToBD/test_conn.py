import psycopg2

try:
   connection = psycopg2.connect(user="user",
                                  password="password",
                                  host="52.15.170.43",
                                  port="5432",
                                  database="dev_db")
   cursor = connection.cursor()
   postgreSQL_select_Query = "select * from cluster"

   cursor.execute(postgreSQL_select_Query)
   print("Selecting rows from mobile table using cursor.fetchall")
   test = cursor.fetchall() 
   
   print("Print each row and it's columns values")
   for row in test:
       print("Id = ", row[0], )
       print("Model = ", row[1],"\n")

except (Exception, psycopg2.Error) as error :
    print ("Error while fetching data from PostgreSQL", error)

finally:
    #closing database connection.
    if(connection):
        cursor.close()
        connection.close()
        print("PostgreSQL connection is closed")