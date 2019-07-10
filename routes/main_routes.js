const MainController = require("../controllers/main_controller");
const router = require("express").Router();

router.post("/add-asset", (req, res) => {

});

router.post("/add-task", (req, res) => {

});

router.post("/add-worker", (req, res) => {

});

router.get("/assets/all", (req, res) => {

});

router.post("/allocate-task", (req, res) => {

});

router.post("/get-tasks-for-woker/:worker_id", (req, res) => {
    let worker_id = req.params.worker_id;
});


module.exports = router;