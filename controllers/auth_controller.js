const AdminTransactions = require("../models/admin/admin_db_transactions");
const WorkerTransactions = require("../models/workers/worker_db_transactions");

const Promise = require("bluebird");

module.exports.register_worker = (name, email, password) => {
    return new Promise((resolve, reject) => {
        WorkerTransactions.hash_gen(password)
            .then(hash => WorkerTransactions.add_worker(name, email, hash))
            .then(worker => {
                resolve({
                    meta: {
                        success: true,
                        message: "Registered worker successfully",
                        code: 200
                    },
                    payload: {
                        worker: worker
                    }
                });
            })
            .catch(err => {
                console.error(err);
                if (err.code == 11000) {
                    reject({
                        meta: {
                            success: false,
                            message: "Worker found with the same E-mail",
                            code: 400
                        }
                    });
                } else {
                    reject({
                        meta: {
                            success: false,
                            message: "Network Problem!",
                            code: 500
                        }
                    });
                }
            });
    });
};


module.exports.register_admin = (name, email, password) => {
    return new Promise((resolve, reject) => {
        AdminTransactions.hash_gen(password)
            .then(hash => AdminTransactions.add_admin(name, email, hash))
            .then(admin => {
                resolve({
                    meta: {
                        success: true,
                        message: "Registered admin successfully",
                        code: 200
                    },
                    payload: {
                        admin: admin
                    }
                });
            })
            .catch(err => {
                console.error(err);
                if (err.code == 11000) {
                    reject({
                        meta: {
                            success: false,
                            message: "Admin found with the same E-mail",
                            code: 400
                        }
                    });
                } else {
                    reject({
                        meta: {
                            success: false,
                            message: "Network Problem!",
                            code: 500
                        }
                    });
                }
            });
    });
};

module.exports.login_worker = (worker_email, worker_password) => {
    return new Promise((resolve, reject) => {

        let current_worker;

        WorkerTransactions.find_worker_by_email(worker_email)
            .then(worker => {
                if (!worker) {
                    reject({
                        meta: {
                            success: false,
                            message: "No worker account found with the provided E-mail ID",
                            code: 404
                        }
                    });
                } else {
                    current_worker = worker;
                    return WorkerTransactions.compare_password(worker, worker_password);
                }
            })
            .then(valid_password => {
                if (!valid_password) {
                    reject({
                        meta: {
                            success: false,
                            message: "Wrong password entered!",
                            code: 403
                        }
                    });
                } else {
                    return WorkerTransactions.generate_token(current_worker);
                }
            })
            .then(token => {
                if (!token) {
                    reject({
                        meta: {
                            success: false,
                            message: "Error logging in!",
                            code: 500
                        }
                    });
                } else {
                    resolve({
                        meta: {
                            success: true,
                            message: "Logged in the worker successfully",
                            code: 200
                        },
                        payload: {
                            worker: current_worker,
                            token: token
                        }
                    });
                }
            })
            .catch(err => {
                console.error(err);
                reject({
                    meta: {
                        success: false,
                        message: "Network Problem!",
                        code: 500
                    }
                });
            });
    });
};

module.exports.login_admin = (admin_email, admin_password) => {
    return new Promise((resolve, reject) => {

        let current_admin;

        AdminTransactions.find_admin_by_email(admin_email)
            .then(admin => {
                if (!admin) {
                    reject({
                        meta: {
                            success: false,
                            message: "No admin account found with the provided E-mail ID",
                            code: 404
                        }
                    });
                } else {
                    current_admin = admin;
                    return AdminTransactions.compare_password(admin, admin_password);
                }
            })
            .then(valid_password => {
                if (!valid_password) {
                    reject({
                        meta: {
                            success: false,
                            message: "Wrong password entered!",
                            code: 403
                        }
                    });
                } else {
                    return AdminTransactions.generate_token(current_admin);
                }
            })
            .then(token => {
                if (!token) {
                    reject({
                        meta: {
                            success: false,
                            message: "Error logging in!",
                            code: 500
                        }
                    });
                } else {
                    resolve({
                        meta: {
                            success: true,
                            message: "Logged in the admin successfully",
                            code: 200
                        },
                        payload: {
                            admin: current_admin,
                            token: token
                        }
                    });
                }
            })
            .catch(err => {
                console.error(err);
                reject({
                    meta: {
                        success: false,
                        message: "Network Problem!",
                        code: 500
                    }
                });
            });
    });
};