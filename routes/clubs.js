var express = require("express");
var router = express.Router();
const clubsCtrl = require("../controllers/clubs");

router.get("/", clubsCtrl.indexList);
router.get("/map", clubsCtrl.indexMap);

router.get("/new", clubsCtrl.newClub);
router.post("/", clubsCtrl.createClub);

router.get("/:id", isLoggedIn, clubsCtrl.showClub);
router.post("/:id/reviews", clubsCtrl.saveReview);

router.delete("/:id", clubsCtrl.deleteReview);

function isLoggedIn(req, res, next) {
 if (req.isAuthenticated()) return next();
 res.redirect("/auth/google");
}

module.exports = router;
