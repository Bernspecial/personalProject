const router = require("express").Router();


router.use("/", require("./swagger"));

router.get("/", (req, res) => {
    res.send("Welcome to my CSE341 Personal Project.....! I am Bernard Olayemi Michael")
});

router.use("/quote", require("./user"));
router.use("/country", require("./user2"));


module.exports = router;