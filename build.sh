#!/bin/bash
cp -R logs2BigQuery/* build
cd build
zip -r logs2BigQuery-lambda.zip ./*
