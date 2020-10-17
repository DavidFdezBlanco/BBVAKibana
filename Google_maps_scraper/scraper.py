# -*- coding: utf-8 -*-
from googlemaps import GoogleMapsScraper
from datetime import datetime, timedelta
import argparse
import csv
import ctypes

HEADER = ['id_review', 'caption', 'relative_date', 'retrieval_date', 'rating', 'username', 'n_review_user', 'n_photo_user', 'url_user', 'city', 'country']
HEADER_W_SOURCE = ['id_review', 'caption', 'relative_date','retrieval_date', 'rating', 'username', 'n_review_user', 'n_photo_user', 'url_user', 'url_source','city', 'country']

def csv_writer(source_field, outfile, path='data/'):
    print("outfile is " + outfile)
    targetfile = open(path + outfile, mode='w', encoding='utf-8', newline='\n')
    writer = csv.writer(targetfile, quoting=csv.QUOTE_MINIMAL)

    if source_field:
        h = HEADER_W_SOURCE
    else:
        h = HEADER
    writer.writerow(h)

    return writer


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Google Maps reviews scraper.')
    parser.add_argument('--N', type=int, default=100, help='Number of reviews to scrape')
    parser.add_argument('--i', type=str, default='data/agencies.csv', help='target URLs file')
    parser.add_argument('--o', type=str, default='reviews.csv', help='target URLs file')
    parser.add_argument('--place', dest='place', action='store_true', help='Scrape place metadata')
    parser.add_argument('--debug', dest='debug', action='store_true', help='Run scraper using browser graphical interface')
    parser.add_argument('--source', dest='source', action='store_true', help='Add source url to CSV file (for multiple urls in a single file)')
    parser.set_defaults(place=False, debug=False, source=False)

    args = parser.parse_args()

    # store reviews in CSV file
    writer = csv_writer(args.source, args.o)

    with GoogleMapsScraper(debug=args.debug) as scraper:
        num_lines = sum(1 for line in open(args.i)) - 1
        print("\nThere are " + str(num_lines) + " agencies")
        with open(args.i) as csvfile:
            
            reader = csv.reader(csvfile) # change contents to floats
            next(reader)

            agency_index = 0
            for agency in reader:
                print("\nAgency " + str(agency_index + 1) + "/" + str(num_lines))
                url = agency[0]
                if args.place:
                    print(scraper.get_account(url))
                else:
                    error = scraper.sort_by_date(url)
                    if error == 0:

                        ns = 0
                        while ns < args.N:
                            reviews = scraper.get_reviews(ns)
                            
                            for r in reviews:
                                row_data = list(r.values())
                                row_data.append(agency[1])
                                row_data.append(agency[2])
                                if args.source:
                                    row_data.append(url)

                                writer.writerow(row_data)
                                new_data = True

                            ns += len(reviews)
                            print(" -- " + str(ns) + " reviews taken so far")
                            if(len(reviews) == 0):
                                ns = args.N
                            
                agency_index += 1
    ctypes.windll.user32.MessageBoxW(0, "Success", "Scraper_agencies.py just finished", 1)
