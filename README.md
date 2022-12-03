# CS-424 Visualization and Visual Analytics - 3
## Course Instructor: Dr. Fabio Miranda
## Term: Fall 2022
## Project 3: Webpage with Observable and D3 Tool
## Authors: Aliasgar Zakir Merchant, Siham Shweikani

## Objectives:
It is important to choose a safe school area to send students to. Our visualization helps study the areas in Chicago and choose the safe neibhorhood to send kids to.


## Datasets Used:
1. Crimes in the city of Chicago (2001-2022)
2. GeoJSON file describing the shapes of the localities across the city of Chicago


## Description of Datasets:
1. Crimes in the city of Chicago (2001-2022):
- This dataset contains the crimes that took place in the city of Chicago from the years 2001 to present (minus 7 most recent days). The dataset contains exactly 7,628,970 rows and 22 columns. Important Attributes:
   - Date: Date and time of occurrence of the crime
   - Block: Redacted address of occurrence of crime
   - Primary type: High Level category of a crime
   - Description: Subcategory for the primary type, more specific
   - District: Police district where the incident occurred.
   - Ward: City Council district
   - Community Area: Community area where the incident occurred

## The Questions:


## Data Transformation:
Data cleaning steps are taken from project 1 as follows:
  . Load Datasets on Crime, Socioeconomic conditions and Community Shape into the memory.
  . Display the first 5 rows of the Crime Dataset. This helps us get an overview of the dataset.
  . Display the Shape of the dataset.
  . Plot the number of missing values in the Crimes dataset.
  . Select specific crimes, generalize and summarize their crimes to make it easier for visualization and analytics
  . Remove null values for "X Coordinate", "Y coordinate", "Latitude", "Longitude", "Location" and remove columns not required
  . Fill the missing values in Community Area, District and Ward based on corrected block Addresses
  . Split Date and Time
  . Remove any remaining null values

The next step was reading the data set into an array of object. Each object holds the information of a row.
Two functions where created to store each community with its crime rate in an array. The first function was for pairing each community number with the sum of each crime. Th secodn fucntion was for labeling the data in a more organized array.
Finally, the communities data set was also stored in an array of objects. The combination of the data sets and the data stored in the arrays was later used for the visual encoding.



