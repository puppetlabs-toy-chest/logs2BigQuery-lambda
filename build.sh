#!/bin/bash
cp -R lib/python3.6/site-packages/* ./build
cp main.py ./build
cp config.json ./build
cd build
zip -r logs2BigQuery-lambda.zip ./*
