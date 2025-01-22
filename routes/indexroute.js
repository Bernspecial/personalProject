const router = require("express").Router();


// router.use("/", require("./swagger"));

router.get("/", (req, res) =>{
    // swagger.tags = ["Welcome to my CSE341 assignments.....! I'm Bernard Olayemi Michael"]
    res.send("Welcome to my CSE341 Personal Project.....! I am Bernard Olayemi Michael")
});

router.use("/response", require("./user"));


module.exports = router;