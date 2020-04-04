// Create a map object
var myMap = L.map("map", {
  center: [25, 10],
  zoom: 3
});

// Add a tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: "pk.eyJ1IjoiZW1lcmFsZDd0ZWVuIiwiYSI6ImNrN3dmM2s1bTAxbm8zbnBtcHZnNHh3ZGEifQ.n2ngfwyN762d4xE5JjIiXQ"
}).addTo(myMap);

// An array containing each city's name, location, and population
var regions = [{
  location: [30, 105],
  name: "Chinese",
  pop_dish: "Quinoa Veggie “Fried Rice”"
},
{
  location: [19, -72],
  name: "Caribbean",
  pop_dish: "Caribbean Jerk Salmon Tostadas with Grilled Pineapple Peach Coconut Salsa"
},
{
  location: [46, 2],
  name: "French",
  pop_dish: "Roasted Ratatouille Pasta"
},
{
  location: [39, 22],
  name: "Greek",
  pop_dish: "Greek Salmon Souvlaki Gyros with Tzatziki"
},
{
  location: [20.5, 80],
  name: "Indian",
  pop_dish: "Coconut Chicken Curry"
},
{
  location: [42, 11.5],
  name: "Italian",
  pop_dish: "Roasted Cauliflower Lasagna"
},
{
  location: [36, 127.8],
  name: "Korean",
  pop_dish: "Instant Pot Korean Beef Bowls"
},
{
  location: [23.5, -102.5],
  name: "Mexican",
  pop_dish: "Spicy Butternut Squash Black Bean Enchiladas with Chipotle Greek Yogurt Sauce"
},
{
  location: [29.5, 42.5],
  name: "Middle Eastern",
  pop_dish: "High Protein Hummus Chicken Salad"
},
{
  location: [60, 15.5],
  name: "Nordic",
  pop_dish: "Swedish Meatballs"
},
{
  location: [32, -83],
  name: "Southern",
  pop_dish: "The Best Chicken Fried Steak"
}
];

console.log(regions)
// Loop through the cities array and create one marker for each city, bind a popup containing its name and population add it to the map
for (var i = 0; i < regions.length; i++) {
  var city = regions[i];
  L.marker(city.location)
    .bindPopup("<h1>" + city.name + "</h1> <hr> <h3>Population " + city.pop_dish + "</h3>")
    .addTo(myMap);
}
