const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Optional: serve static files (css, images, client js) from /public
app.use(express.static(path.join(__dirname, "public")));

app.get("/investing", (req, res) => {
  res.render("investing", { page: "investing" });
});

app.get("/budgeting", (req, res) => {
  res.render("budgeting", { page: "budgeting" });
});

app.get("/careers", (req, res) => {
  res.render("careers", { page: "careers" });
});

app.get("/interviews", (req, res) => {
  res.render("interviews", { page: "interviews" });
});

app.get("/prioritization", (req, res) => {
  res.render("prioritization", { page: "prioritization" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
