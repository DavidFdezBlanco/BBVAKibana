from googlemaps_agencies import GoogleMapsScraperAgencies
from datetime import datetime, timedelta
from geopy.geocoders import Nominatim
import argparse
import csv

HEADER = ["link", "city", "rating"]
HEADER_W_SOURCE = ["link", "city", "rating"]

def csv_writer(source_field, path='data/', outfile='agencies.csv'):
    targetfile = open(path + outfile, mode='w', encoding='utf-8', newline='\n')
    writer = csv.writer(targetfile, quoting=csv.QUOTE_MINIMAL)

    if source_field:
        h = HEADER_W_SOURCE
    else:
        h = HEADER
    writer.writerow(h)

    return writer

def city_to_coordinates(city):
    geolocator = Nominatim(user_agent="lions")
    location = geolocator.geocode(city)
    if location is None:
        print("City not found: " + city)
        return("")
    else:
        return "@" + str(location.latitude) + "," + str(location.longitude) + ",11z"

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Google Maps reviews scraper.')
    parser.add_argument('--N', type=int, default=100, help='Number of reviews to scrape')
    parser.add_argument('--i', type=str, default='cities.txt', help='target URLs file')
    parser.add_argument('--query', type=str, default='BBVA', help='Search query desired')
    parser.add_argument('--place', dest='place', action='store_true', help='Scrape place metadata')
    parser.add_argument('--debug', dest='debug', action='store_true', help='Run scraper using browser graphical interface')
    parser.add_argument('--source', dest='source', action='store_true', help='Add source url to CSV file (for multiple urls in a single file)')
    parser.set_defaults(place=False, debug=False, source=False)

    args = parser.parse_args()
    writer = csv_writer(args.source)

    with GoogleMapsScraperAgencies(debug=args.debug) as scraper:
        query = args.query  
        num_lines = sum(1 for line in open(args.i))
        with open(args.i, 'r') as cities_file:
            for city in cities_file:
                
                print("There are " + str(num_lines) + " cities in file")
                coordinates = city_to_coordinates(city)
                if coordinates:
                    scraper.process_query(query,coordinates)
                    print("\n" + city)
                    n = 0
                    while n < args.N:
                        print(" -- Agency " + str(n + 1) + "/" + str(args.N))
                        agency_url = scraper.get_link(n%20 +1)
                        
                        writer.writerow([agency_url, city, 5])
                        
                        #If end of result page, go to next
                        if(n == 20):
                            scraper.next_page()
                        n += 1
                        
        
        