#!/usr/bin/env python2

import serial
import pynmea2
import requests
import json
import time
import os
from configparser import RawConfigParser

config = '../../config.conf'
saveConf = '../../location.conf'
ak = ''
service_id = ''
entity_name = ''
cookie = ''

# report gps info
def reportLocation(lat, lon, alt):
    saveLocation(lat, lon, alt)
    url = "http://yingyan.baidu.com/api/v3/track/addpoint"
    body = {
        "ak": ak, 
        "service_id": service_id, 
        "entity_name": entity_name,
        "latitude": lat,
        "longitude": lon,
        "loc_time": int(time.time()),
        "coord_type_input": "bd09ll",
        "height": alt,
    }
    print '%s' % ak
    print '%s' % service_id
    print '%s' % entity_name

    response = requests.post(url, data = body)

# parse gps and report
def parseAndReportGPS(str):
    lat = -1.0
    lon = -1.0
    altitude = -1.0
    if str.find('GGA') > 0:
        msg = pynmea2.parse(str)
        if msg.lat != "":
            lat = float(msg.lat) / 100
        if msg.lon != "":
            lon = float(msg.lon) / 100
        if msg.altitude != "None":
            altitude = msg.altitude
        timestamp = msg.timestamp

        if((lat != -1.0) & (lon != -1.0) & (altitude != -1.0)):
            print "Timestamp: %s -- Lat: %s -- Lon: %s -- Altitude: %s" % (timestamp, lat, lon, altitude)
            reportLocation(lat, lon, altitude)
        else:
            getAndReportIpLocation()

def getAndReportIpLocation():
    url = "https://map.baidu.com/?qt=ipLocation&t=%s" % (int(time.time()))
    headers = {
        "Cookie": cookie
    }
    print cookie
    print url
    response = requests.get(url, headers=headers)
    print response.json()
    rgc = response.json()["rgc"]
    result = rgc["result"]
    location = result["location"]
    print "lat:%s, lng:%s" % (location["lat"], location["lng"])
    reportLocation(location["lat"], location["lng"], 0)
    
serialPort = serial.Serial("/dev/ttyAMA0", 9600, timeout = 0.5)

def saveLocation(lat, lon, alt):
    conf = RawConfigParser()
    conf.read(saveConf)
    if conf.has_section('Location') == False:
        conf.add_section('Location')
    conf.set('Location', 'latitude', "%s" % lat)
    conf.set('Location', 'longitude', "%s" % lon)
    conf.set('Location', 'height', "%s" % alt)
    with open(saveConf, 'w') as fw:
        conf.write(fw)
    print "save location"

if os.path.exists(config) == True:
    print "location starting..."
    conf = RawConfigParser()
    conf.read(config)
    if conf.has_section('Location') == False:
        print "no Location"
    else:
        ak = conf.get('Location', 'ak')
        service_id = conf.get('Location', 'service_id')
        entity_name = conf.get('Location', 'entity_name')
        cookie = conf.get('Location', 'cookie')
        
        while True:
            str = serialPort.readline()
            print str
            parseAndReportGPS(str)
            time.sleep(3 * 10)
else:
    print "file not exists"
