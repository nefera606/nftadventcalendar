#!/bin/bash

npm run build;
docker build -t nftadventcalendar:latest .;
docker tag nftadventcalendar:latest nefera606/adventcalendarfront:latest;
docker push nefera606/adventcalendarfront:latest;