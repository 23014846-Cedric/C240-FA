const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Optional: serve static files (css, images, client js) from /public
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  res.redirect("/investing");
});

app.get("/investing", (req, res) => {
  res.render("investing");
});

// If you have a meeting page later:
app.get("/meeting", (req, res) => {
  // create views/meeting.ejs if you want
  res.send("Meeting Assistant page not added yet.");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
