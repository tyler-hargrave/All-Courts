var express = require("express");
var router = express.Router();
const passport = require("passport");
const clubsCtrl = require("../controllers/clubs");

/* GET home page. */
router.get("/", function (req, res, next) {
 res.render("index", { title: "Express", user: clubsCtrl.updateUser(req.user) });
});

/* CONNACTIVE CLUB ADVERT */
router.get("/connactiveclub", function (req, res, next) {
 res.render("connactiveclub", { user: clubsCtrl.updateUser(req.user) });
});

router.get(
 "/auth/google",
 passport.authenticate("google", {
  scope: ["profile", "email"],
  prompt: "select_account", // This will force the user to select an account
 }),
);
router.get(
 "/oauth2callback",
 passport.authenticate("google", {
  successRedirect: "/clubs",
  failureRedirect: "/clubs",
 }),
);

router.get("/logout", function (req, res) {
 req.logout(function (err) {
  if (err) {
   return next(err);
  }
  res.redirect("/");
 });
});

module.exports = router;
