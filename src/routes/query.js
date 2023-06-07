
const router = require("express").Router();

// page serves
router.get("/", (req, res) => {
    res.redirect("/");
});

router.get("/user", (req, res) => {
    res.sendFile("user.html", { root: "src/pages" });
});

router.get("/manager", (req, res) => {
    res.sendFile("manager.html", { root: "src/pages" });
});

module.exports = router;
