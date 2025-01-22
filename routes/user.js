const express = require("express");
const router = express.Router();

const usercontroller = require("../controller/response");


router.get("/", usercontroller.getAllData);

router.get("/:id", usercontroller.getSingleData);

// router.post("/", usercontroller.createUser);

// router.put("/:id", usercontroller.updateUser);

// router.delete("/:id", usercontroller.deleteUser);




module.exports = router;