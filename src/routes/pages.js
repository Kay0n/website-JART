const database = require("../configs/database");
const router = require("express").Router();

const homeRoute = (req, res) => {
    console.log("aaa");
    if(req.isAuthenticated()){
        res.sendFile("explore.html", { root: "src/pages" });
    } else {
        res.sendFile("NVexplore.html", { root: "src/pages" });
    }
};
router.get("/",homeRoute);
router.get("/pages/explore",homeRoute);



router.get('/pages/Club', async (req, res) => {
    if (req.isAuthenticated()) {
        const isManager = await database.userIsManagerOrAdmin(req.query.club_id, req.user.user_id);
        if(isManager){
            res.sendFile("Club.html", { root: "src/pages" });
            return;
        }
        res.sendFile("userClubView.html", { root: "src/pages" });

    } else {

    res.sendFile("NVclub.html", { root: "src/pages" });
    }
});


router.get('/pages/userSettings', (req, res) => {
    console.log("aaa");
    if (req.isAuthenticated()) {
        res.sendFile("userSettings.html", { root: "src/pages" });
        return;
    }
    res.redirect("/");
});


router.get('/pages/clubSettings', (req, res) => {
    if (req.isAuthenticated()) {
        res.sendFile("clubSettings.html", { root: "src/pages" });
        return;
    }
    res.redirect("/");
});


router.get('/pages/myClubs', (req, res) => {
    if (req.isAuthenticated()) {
        res.sendFile("myClubs.html", { root: "src/pages" });
        return;
    }
    res.redirect("/");
});


module.exports = router;
