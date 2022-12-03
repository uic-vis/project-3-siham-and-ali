# CS-424 Visualization and Visual Analytics - 3
## Course Instructor: Dr. Fabio Miranda
## Term: Fall 2022
## Project 3: Webpage with Observable and D3 Tool
## Authors: Aliasgar Zakir Merchant, Siham Shweikani


## Link for The Webpage:
https://aliasgar-m.github.io/project-3-siham-and-ali/

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


## Webpage Desciption:

# Crime Types Cmparisons:
In the following map for Chicago. The user can zoom in and out to better see the communities. The user can also select which crime type they want to see on the map by choosing from the top left corner list. The crime types in the map list are total crimes, theft, narcotics, weapons, kidnapping and sexual assult

![image](https://user-images.githubusercontent.com/89785579/205424728-7a5f8a8c-be38-46e6-be5e-22d5c45e2351.png)

First choose the crime type from the list. The map will show different colors densities depending on the total of the crime chosen in each community. Then, press on a certain community to see the following linked visualiztion:
![image](https://user-images.githubusercontent.com/89785579/205425114-d02d0589-bb9f-48b7-a450-ee0eb2ce6f30.png)

The bar chart shows the different values of the different crime types in that community. If the crime chosen from the map list was total crimes, the bar chart will compare the main types. If the crime type chosen was different, the bar chart will compare the values of more specific types of crimes that fall under the type chosen.

The linear chart compares the the communities chosen through out the user experience for the chosen crime type. When a new community is pressed, its data will show on the linear chart. 

The bar chart and the linear chart have the same x and y units.

# Crimes and Schools Locations:

In the maps below. The user can see the crimes spots and the school locations in the communties. The user need tp press on the community to show its details. Also, the user can choose a specific month and year first, and then choose the comunity to see the data wanted. The crimes dots are colored depening on the crime type. The user can see the school's name by hovering over the school pin on the map.

![image](https://user-images.githubusercontent.com/89785579/205425166-0778dd40-295e-4b01-af97-c92251be64f2.png)

