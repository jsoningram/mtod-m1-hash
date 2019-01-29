#!/bin/bash
# Create $COUNT test users and write to CSV for m1

COUNT=$1
ENV=$2

domain="@mtodtest.com"
user=`date +%s`

if [ ! $ENV ]
then
	echo "please provide a value [staging, preprod, production]"
fi

echo "email,firstname,lastname" >> email-list.csv

if [ $COUNT ]
then
	for (( i=1; i<=$COUNT; i++ ))
	do
		f=`sed "${i}q;d" firstnames`
		l=`sed "${i}q;d" lastnames`
		first=$(echo "$f" | tr '[:lower:]' '[:upper:]')
		last=$(echo "$l" | tr '[:lower:]' '[:upper:]')
		result=$ENV-$user$i$domain,$first,$last

		echo $result >> email-list.csv
	done
else
	echo "Please provide the number of email addresses you would like"
fi
