#!/bin/bash

# Set your project as active
gcloud config set project image-generator-web-page

# Enable required APIs
gcloud services enable aiplatform.googleapis.com
gcloud services enable compute.googleapis.com