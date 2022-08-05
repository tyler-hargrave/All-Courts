# All Courts (Tennis Club Search)

### Key Attributes

Date: 2022-Aug-4

Author Tyler Hargrave

### Introduction

All Courts is a NodeJS, Express, and MongoDB based app. The purpose of this app is to help people in Toronto find the best tennis club to join! The purpose of building this app was to demonstrate an Express app with Create-Read-Update-Delete functionality.

### Screenshots

![Home Page](/img/screenshot1.jpg "Home Page")
![Index Page (with filters)](/img/screenshot2.jpg "Index Page")
![Alternative  Index Page (map)](/img/screenshot3.jpg "Map Page")
![Show Page with link to Google Maps](/img/screenshot4.jpg "Show Page")
![User Review on Show Page](/img/screenshot5.jpg "User Review")
![Partner Link](/img/screenshot6.jpg "Partner Link")

### Technologies

MEN
MongoDB (with mongoose)
Express
NodeJS

Frontend
<br/>
Design Template: Materialize
CSS: Including Flexbox, Grid
JS: Including Jquery for DOM manipulation
HTML

Deployment
MongoDB with Atlas
Heroku

APIs
Google Maps

### Getting Started

https://allcourts.herokuapp.com/

### Data Mining

In order to make the app useful, the initial data mining was performed to populate the clubs. By doing this, the website can be used today by people in Toronto to find a club. I even found some potential clubs to join next year!

### CRUD

The purpose of the website is to demonstrate CRUD, and that has been done. However, users do not have the ability to add and delete clubs. That would be chaotic. There could be duplicates or clubs with misinformation. That makes the site not useful.

So, the CRUD is done on the user reviews. A review includes three elements (membership status, annual cost, rating) and these are aggregated into the main club details for filtering. The review can be added, read, updated, and deleted on the show page for each club.

### Continued Development

To continue the development; the first focus would be to make the users stories a bit more purposeful. There are some detours that the user may make in the process of using the site.

The second foucs would be on integrating more information from Google Maps. Specfically by having the PlaceID for each club, we have the details on the photos and rating uploaded to Google. So we could use this on our site as well.
