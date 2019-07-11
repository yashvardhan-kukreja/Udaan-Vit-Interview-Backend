const AdminController = require("../controllers/admin_controller");
const router = require("express").Router();

router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");

    if (req.method === 'OPTIONS') {
        var headers = {};
        headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
        headers["Access-Control-Allow-Credentials"] = false;
        res.writeHead(200, headers);
        res.end();
    } else {
        let token = req.headers["x-access-token"];
        AdminController.verify_token(token)
            .then(data => {
                req.decoded = data.payload.decoded;
                next();
            })
            .catch(err => res.status(err.meta.code).json(err));
    }
});

router.post("/add-asset", (req, res) => {
    let asset_name = req.body.asset_name;

    AdminController.add_asset(asset_name)
        .then(data => res.status(data.meta.code).json(data))
        .catch(err => res.status(err.meta.code).json(err));
});

router.post("/add-task", (req, res) => {
    let task_name = req.body.task_name;
    let frequency = req.body.frequency;

    AdminController.add_task(task_name, frequency)
        .then(data => res.status(data.meta.code).json(data))
        .catch(err => res.status(err.meta.code).json(err));
});

router.post("/add-worker", (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;

    AdminController.add_worker(name, email, password)
        .then(data => res.status(data.meta.code).json(data))
        .catch(err => res.status(err.meta.code).json(err));

});

router.get("/assets/all", (req, res) => {
    AdminController.get_all_assets()
        .then(data => res.status(data.meta.code).json(data))
        .catch(err => res.status(err.meta.code).json(err));
});

router.post("/allocate-task", (req, res) => {
    let asset_id = req.body.asset_id;
    let task_id = req.body.task_id;
    let worker_id = req.body.worker_id;
    let allocated_time = req.body.allocated_time;
    let finishing_time = req.body.finishing_time;

    AdminController.allocate_task(asset_id, task_id, worker_id, allocated_time, finishing_time)
        .then(data => res.status(data.meta.code).json(data))
        .catch(err => res.status(err.meta.code).json(err));

});

router.get("/get-tasks-for-worker/:worker_id", (req, res) => {
    let worker_id = req.params.worker_id;

    AdminController.get_tasks_for_worker(worker_id)
        .then(data => res.status(data.meta.code).json(data))
        .catch(err => res.status(err.meta.code).json(err));
});

router.get("/tasks/all", (req, res) => {
    AdminController.get_all_tasks()
        .then(data => res.status(data.meta.code).json(data))
        .catch(err => res.status(err.meta.code).json(err));
});

module.exports = router;