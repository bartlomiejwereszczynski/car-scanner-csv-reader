# Car Scanner "CSV #2" data reader

First try at vibe coding, less than 2h produced this (with a bit of github configuration and excluding writing this readme and some of the translation). Code produced looks horrible, but somehow it actually works and does what's needed.

## What does it do?

Well, i needed some way to read data log file exported from Android [Car Scanner app](https://play.google.com/store/apps/details?id=com.ovz.carscanner). It loads your exported CSV file into your browser, parses it, and the allows you to display recorded data (charts adjust dynamically).

what you can control:
- which data/column to show
- size of viewable time window
- scrolling through recorded time
- synced hover cursor (on desktop) to view time aligned data

## Do i need to run it locally?

Nope, just head to the github page [Car Scanner "CSV #2" data reader](https://bartlomiejwereszczynski.github.io/car-scanner-csv-reader/) (you'll need a recent browser since it uses some of the newer controls), and bam you're set.

## How to use it?

First you'll need to export log file from your app and export your recorded session, This may be only available to Pro version of the app (well, i have it)

at the time i'm writing this README it goes like this:
- open app, click on the "Data Recording" button
- scroll down to the bottom of the screen (yeah i know it looks stupid, not my app)
- long press on the entry you're interested in, then choose "export" from the top bar
- on the folowing modal window select "CSV #2" as the format
- then choose whater you like what to do with the generated file
  - "Save to file" will open the android share screen where you can choose whatever you have on your device to handle files
  - "Send using Email" should open your email app, but since it didn't work for me, your guess is as good as mine
- when you have the generated file at hand, simply open the [Car Scanner "CSV #2" data reader](https://bartlomiejwereszczynski.github.io/car-scanner-csv-reader/) and select that file. you're done

## Any updates?

If and when I need them, no commitments.
