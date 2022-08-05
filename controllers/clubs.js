const Club = require("../models/club");
require("dotenv").config();
const axios = require("axios");
const { json } = require("express");
//const { Client } = require("@googlemaps/google-maps-services-js");
//const Ticket = require("../models/ticket");
//const airlines = ["American", "Southwest", "Air Canada"];
//const airports = ["Toronto", "Lindsay", "Beijing", "Sanya", "Spain"];

function createClub(req, res) {
 //if (req.body.departs === null) req.body.departs = undefined;
 const club = new Club(req.body);
 club.save((e) => {
  if (e) return res.redirect("clubs/new");
  res.redirect("clubs");
 });
}
async function deleteReview(req, res) {
 Club.findById(req.params.id, function (err, club) {
  //Delete previous comment by the user
  club.reviews = club.reviews.filter((x) => {
   return x.googleID !== req.user.id;
  });
  club.save();
 });
 res.redirect(req.params.id);
}
function getAnnualCost(reviews) {
 let count = 0;
 let total = 0;
 if (reviews !== undefined) {
  reviews.forEach((x) => {
   if (x.annual_cost === "Unknown") {
    //Do Nothing
   } else if (x.annual_cost === "$0 - $100") {
    count++;
    total += 50;
   } else if (x.annual_cost === "$100 - $300") {
    count++;
    total += 200;
   } else if (x.annual_cost === "$300 - $1000") {
    count++;
    total += 650;
   } else if (x.annual_cost === "$1000+") {
    count++;
    total += 1500;
   }
  });
 }
 if (count === 0) return "Unknown";
 else if (total / count < 100) return "$0 - $100";
 else if (total / count < 300) return "$100 - $300";
 else if (total / count < 1000) return "$300 - $1000";
 else return "$1000+";
}
function getMembership(reviews) {
 let count = 0;
 let total = 0;
 if (reviews !== undefined) {
  reviews.forEach((x) => {
   if (x.membership === "Open") {
    count++;
    total += 0.5;
   } else if (x.membership === "Waitlist") {
    count++;
    total += 1.5;
   } else if (x.membership === "Waitlist") {
    count++;
    total += 2.5;
   }
  });
 }
 if (count === 0) return "Open";
 else if (total / count <= 1) return "Open";
 else if (total / count <= 2) return "Waitlist";
 else return "Closed";
}
function getRating(reviews) {
 let count = 0;
 let total = 0;
 if (reviews !== undefined) {
  reviews.forEach((x) => {
   count++;
   total += 1 * x.rating - 0.5;
  });
 }

 if (count === 0) return 3;
 else return Math.ceil(total / count);
 return "TYLER";
}

async function index(req, res, ref) {
 let clubs = await Club.find({});

 for (i = 0; i < clubs.length; i++) {
  clubs[i] = googleClub(clubs[i]);
  clubs[i].annual_cost = getAnnualCost(clubs[i].reviews);
  clubs[i].rating = getRating(clubs[i].reviews);
  clubs[i].membership = getMembership(clubs[i].reviews);
 }

 //QUERY
 if (req.query === undefined) req.query = {};
 filter = updateFilters(req.query);

 //QUERY - CLUBNAME
 if (filter.clubName.toLowerCase() !== "all")
  clubs = clubs.filter((x) => {
   if (x.clubName === undefined) return false;
   return x.clubName.toLowerCase().includes(filter.clubName.toLowerCase());
  });

 //QUERY - RATING
 clubs = clubs.filter((x) => 1 * x.rating >= 1 * filter.rating);

 //QUERY - LIGHTS
 if (filter.lights !== "All")
  clubs = clubs.filter((x) => {
   if (x.lights === undefined) return false;
   console.log("vs", x.lights === "Yes", filter.lights);
   return (filter.lights === "Yes") === x.lights;
  });

 //QUERY - ANNUAL COST
 if (filter.annual_cost !== "All")
  clubs = clubs.filter((x) => {
   if (x.annual_cost === undefined) return false;
   return x.annual_cost === filter.annual_cost;
  });

 //QUERY - MEMBERSHIP
 if (filter.membership !== "All")
  clubs = clubs.filter((x) => {
   if (x.membership === undefined) return false;
   return x.membership === filter.membership;
  });

 //QUERY - SURFACE
 if (filter.surface !== "All")
  clubs = clubs.filter((x) => {
   if (x.surface === undefined) return false;
   return x.surface === filter.surface;
  });

 map = [];
 centre = { latitude: 0, longitude: 0, count: 0 };
 clubs.forEach((x) => {
  map.push({ clubName: x.clubName, longitude: x.longitude, latitude: x.latitude, id: x.id });
  if (1 * x.latitude !== 0 && 1 * x.longitude !== 0) {
   centre.latitude += 1 * x.latitude;
   centre.longitude += 1 * x.longitude;
   centre.count++;
  }
 });
 if (centre.count > 1) {
  centre.latitude = centre.latitude / centre.count;
  centre.longitude = centre.longitude / centre.count;
 } else {
  centre.latitude = 43.6418;
  centre.longitude = -79.3891;
 }

 //Choose your site
 if (ref === "map")
  res.render("clubs/map", { clubs, map, user: updateUser(req.user), filter, centre });
 else res.render("clubs/index", { clubs, user: updateUser(req.user), filter });
}
function indexList(req, res) {
 return index(req, res, "list");
}
function indexMap(req, res) {
 return index(req, res, "map");
}
function newClub(req, res) {
 //Dropdowns

 //Date
 const newClub = new Club();
 const dt = newClub.departs;
 const departsDate = dt.toISOString().slice(0, 16);

 res.render("clubs/new", {
  title: "New Club",
  options: { airlines, airports, departsDate },
  user: updateUser(req.user),
 });
}
async function googleClub(club) {
 //Already Found it
 if (club.googleID != undefined) return club;

 //Create google link
 let location = "43.65107, -79.347015";
 let radius = 50000; //meters

 if (club.latitute != "" && club.longitude != "") {
  location = club.latitude + ", " + club.longitdue;
  radius = 3000;
 }
 const key = process.env.GOOGLE_MAPS;
 let googleData = { found: false };
 const { data } = await axios
  .get(
   `https://maps.googleapis.com/maps/api/place/textsearch/json?location=${location}&query=${club.clubName} ${club.address}&radius=${radius}&key=${key}`,
  )
  .catch(function (error) {});

 if (data.results.length > 0) {
  googleData = data.results[0];
  googleData.found = true;
 }
 club.googleID = googleData.place_id;
 club.photos = JSON.stringify(googleData.photos);
 club.save();
 return club;
}
async function saveReview(req, res) {
 Club.findById(req.params.id, function (err, club) {
  //Delete previous comment by the user
  club.reviews = club.reviews.filter((x) => {
   return x.googleID !== req.user.id;
  });
  club.save();

  //Save the review
  req.body.googleID = req.user.id;
  club.reviews.push(req.body);
  club.save(function (err) {
   res.redirect(`/clubs/${club._id}`);
  });
 });
}
async function showClub(req, res) {
 Club.findById(req.params.id).exec(async function (e, x) {
  try {
   const clubName = x.clubName;
   const address = x.address;
   const location = x.lat + " , " + x.lng;
   const radius = 50000; //meters
   const key = process.env.GOOGLE_MAPS;
   let googleData = { found: false };
   const { data } = await axios.get(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?location=${location}&query=${clubName} ${address}&radius=${radius}&key=${key}`,
   );
   if (data.results.length > 0) {
    googleData = data.results[0];
    googleData.found = true;
   }

   x.annual_cost = getAnnualCost(x.reviews);
   x.rating = getRating(x.reviews);
   x.membership = getMembership(x.reviews);

   let myReview = { status: false };
   for (i = 0; i < x.reviews.length; i++) {
    y = x.reviews[i];
    if (y.googleID === req.user.id) {
     myReview = y;
     myReview.status = true;
    }
   }

   res.render("clubs/show", { club: x, googleData, user: updateUser(req.user), myReview });
  } catch (err) {
   res.render("clubs/error", { user: updateUser(req.user) });
  }
 });
}
function updateUser(user) {
 if (user === undefined) return undefined;

 if (user.id === process.env.GOOGLE_ADMIN) user.admin = true;
 else user.admin = false;
 return user;
}
function updateFilters(filter) {
 if (filter.clubName === undefined) filter.clubName = "All";
 if (filter.clubName === "") filter.clubName = "All";
 if (filter.rating === undefined) filter.rating = "1";
 if (filter.lights === undefined) filter.lights = "All";
 if (filter.annual_cost === undefined) filter.annual_cost = "All";
 if (filter.membership === undefined) filter.membership = "All";
 if (filter.surface === undefined) filter.surface = "All";
 return filter;
}
module.exports = {
 createClub,
 deleteReview,
 indexList,
 indexMap,
 newClub,
 saveReview,
 showClub,
 updateUser,
};
