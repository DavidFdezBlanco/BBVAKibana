# -*- coding: utf-8 -*-
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
from datetime import datetime
import time
import re
import logging
import traceback

BASE_URL = 'https://www.google.com/maps/search/'
MAX_WAIT = 10
MAX_RETRY = 5
MAX_SCROLLS = 40

class GoogleMapsScraperAgencies:

    def __init__(self, debug=False):
        self.debug = debug
        self.driver = self.__get_driver()
        self.logger = self.__get_logger()

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, tb):
        if exc_type is not None:
            traceback.print_exception(exc_type, exc_value, tb)

        self.driver.close()
        self.driver.quit()

        return True



    def __scroll(self):
        scrollable_div = self.driver.find_element_by_css_selector('div.section-layout.section-scrollbox.scrollable-y.scrollable-show')
        self.driver.execute_script('arguments[0].scrollTop = arguments[0].scrollHeight', scrollable_div)

    def process_query(self, query, coordinates):
        url = BASE_URL + query + "/" + coordinates
        self.driver.get(url)
        wait = WebDriverWait(self.driver, MAX_WAIT)

        # Agree on cookies
        try:
            # Switch to cookies frame
            iframe = self.driver.find_element_by_xpath("//iframe[@class='widget-consent-frame']")
            self.driver.switch_to.frame(iframe)
            
            clicked = False
            tries = 0
            while not clicked and tries < MAX_RETRY:
                try:
                    #if not self.debug:
                    #    menu_bt = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, 'div.cYrDcjyGO77__container')))
                    #else:
                    menu_bt = wait.until(EC.presence_of_element_located((By.ID, 'introAgreeButton')))
                    menu_bt.click()

                    clicked = True
                    time.sleep(3)
                except Exception as e:
                    tries += 1
                    self.logger.warn('Failed to click recent button')

                # failed to open the dropdown
                if tries == MAX_RETRY:
                    return -1
            #go back to main iframe
            self.driver.switch_to.default_content()
        except:
            print("No cookies to accept")

    def get_link(self, n):

        wait = WebDriverWait(self.driver, MAX_WAIT)

        time.sleep(4)
        #click n link
        element = self.driver.find_element_by_xpath("//div[@data-result-index=" + str(n) + "]")
        element.click()
        time.sleep(4)

        #click on reviews
        clicked = False
        tries = 0
        while not clicked and tries < MAX_RETRY:
            try:
                menu_bt = wait.until(EC.presence_of_element_located((By.XPATH, "//button[@jsan='7.jqnFjrOWMVU__button,7.gm2-caption,0.ved,22.jsaction']")))
                menu_bt.click()

                clicked = True
                time.sleep(3)
            except Exception as e:
                tries += 1
                self.logger.warn('Failed to click recent button')

            # failed to open the dropdown
            if tries == MAX_RETRY:
                return -1
        
        #get link
        time.sleep(3)
        link = self.driver.current_url

        #return to agency view
        clicked = False
        tries = 0
        while not clicked and tries < MAX_RETRY:
            try:
                menu_bt = wait.until(EC.presence_of_element_located((By.XPATH, "//button[@aria-label='Atrás']")))
                menu_bt.click()

                clicked = True
                time.sleep(3)
            except Exception as e:
                tries += 1
                self.logger.warn('Failed to click recent button')

            # failed to open the dropdown
            if tries == MAX_RETRY:
                return -1
        
        #return to search view
        clicked = False
        tries = 0
        while not clicked and tries < MAX_RETRY:
            try:
                menu_bt = wait.until(EC.presence_of_element_located((By.XPATH, "//button[@jsan='t-MoXyWTerhiw,7.section-back-to-list-button,7.blue-link,7.noprint,0.ved,0.jsaction']")))
                menu_bt.click()

                clicked = True
                time.sleep(3)
            except Exception as e:
                tries += 1
                self.logger.warn('Failed to click recent button')

            # failed to open the dropdown
            if tries == MAX_RETRY:
                return -1
        return link
        
    def next_page(self):

        wait = WebDriverWait(self.driver, MAX_WAIT)
        clicked = False
        tries = 0
        while not clicked and tries < MAX_RETRY:
            try:
                menu_bt = wait.until(EC.presence_of_element_located((By.XPATH, "//button[@jsan='7.n7lv7yjyC35__button,7.noprint,0.ved,0.aria-label,0.id,22.jsaction']")))
                menu_bt.click()

                clicked = True
                time.sleep(3)
            except Exception as e:
                tries += 1
                self.logger.warn('Failed to click recent button')

            # failed to open the dropdown
            if tries == MAX_RETRY:
                return -1

    def __get_logger(self):
        # create logger
        logger = logging.getLogger('googlemaps-scraper')
        logger.setLevel(logging.DEBUG)

        # create console handler and set level to debug
        fh = logging.FileHandler('gm-scraper.log')
        fh.setLevel(logging.DEBUG)

        # create formatter
        formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')

        # add formatter to ch
        fh.setFormatter(formatter)

        # add ch to logger
        logger.addHandler(fh)

        return logger


    def __get_driver(self, debug=False):
        options = Options()

        if not self.debug:
            options.add_argument("--headless")
        else:
            options.add_argument("--window-size=1366,768")

        options.add_argument("--disable-notifications")
        options.add_argument("--lang=es-ES")
        options.add_argument("disable-infobars")
        #options.binary_location("C:\Program Files\Google\Chrome\Application")
        
        input_driver = webdriver.Chrome(chrome_options=options, executable_path="C:\Windows\chromedriver.exe")
        return input_driver


    # util function to clean special characters
    def __filter_string(self, str):
        strOut = str.replace('\r', ' ').replace('\n', ' ').replace('\t', ' ')
        return strOut
