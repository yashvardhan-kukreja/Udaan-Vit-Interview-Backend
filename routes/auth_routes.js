const AuthController = require("../controllers/auth_controller");
const router = require("express").Router();

router.post("/register/:type", (req, res) => {
    let type = req.params.type;
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    if (type == "worker") {
        AuthController.register_worker(name, email, password)
            .then(data => res.status(data.meta.code).json(data))
            .catch(err => res.status(err.meta.code).json(err));
    } else if (type == "admin") {
        AuthController.register_admin(name, email, password)
            .then(data => res.status(data.meta.code).json(data))
            .catch(err => res.status(err.meta.code).json(err));
    } else {
        res.status(404).json({
            meta: {
                success: false,
                message: "Wrong registration endpoint entered",
                code: 404
            }
        });
    }
});

router.post("/login/:type", (req, res) => {
    let type = req.params.type;
    let email = req.body.email;
    let password = req.body.password;
    if (type == "worker") {
        AuthController.login_worker(email, password)
            .then(data => res.status(data.meta.code).json(data))
            .catch(err => res.status(err.meta.code).json(err));
    } else if (type == "admin") {
        AuthController.login_admin(email, password)
            .then(data => res.status(data.meta.code).json(data))
            .catch(err => res.status(err.meta.code).json(err));
    } else {
        res.status(404).json({
            meta: {
                success: false,
                message: "Wrong login endpoint entered",
                code: 404
            }
        });
    }
});

module.exports = router;