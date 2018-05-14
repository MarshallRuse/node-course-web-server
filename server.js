const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;

const app = express();

// Partials are like fragments of a web page that can be re-used.
// You register the folder tha partial is found in, and then
// reference the .hbs files in the folder with {{> fileName}}
hbs.registerPartials(__dirname + "/views/partials");
// built in middle-ware
//
app.set("view engine", "hbs");
app.use(express.static(__dirname + "/public"));

// More middle-ware.  The next argument tells the middle-ware
// when to move on, and the rest of the asynchronous loading of
// the page does not move on until next is called. This allows implementation
// of security features such as user authentication
app.use((request, response, next) => {
  let now = new Date().toString();
  let log = `${now}: ${request.method} ${request.url}`;
  console.log(log);
  fs.appendFile("server.log", log + "\n", (err) => {
    if (err){
      console.log("Unable to append to file.");
    }
  })
  next();
});

/*
app.use((request, response, next) => {
  response.render("maintenance.hbs");
});
*/

// Helpers are functions that can be referenced in your Handlebars code
// so that you dont need to call and pass them in multiple times.
// getCurrentYear replaces a call to new Date().getFullYear() in
// each response.render list of arguments.
hbs.registerHelper("getCurrentYear", () => {
  return new Date().getFullYear();
});

hbs.registerHelper("screamIt", (text) => {
  return text.toUpperCase();
});

app.get('/', (request, response) => {
  response.render("home.hbs", {
    pageTitle: "Home",
    welcomeMessage: "Join us on our celebration of the divine coming of our savior,\
    the exalted and mighty Avalanche.  For she sweeps us away in her all encompassing mass and glory."
  });
});

app.get('/about', (request, response) => {
  response.render("about.hbs", {
    pageTitle: "About Page",
  });
});

app.get('/portfolio', (request, response) => {
  response.render("portfolio.hbs", {
    pageTitle: "Portfolio"
  });
});

app.get('/bad', (request, response) => {
  response.send({
    errorMessage: "Uh oh spaghettio"
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
