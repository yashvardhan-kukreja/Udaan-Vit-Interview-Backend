const AdminTransactions = require("../models/admin/admin_db_transactions");
const WorkerTransactions = require("../models/workers/worker_db_transactions");
const AssetTransactions = require("../models/asset/asset_db_transactions");
const TaskTransactions = require("../models/task/task_db_transactions");

const Promise = require("bluebird");

module.exports.verify_token = (token) => {
    return new Promise((resolve, reject) => {
        AdminTransactions.decode_token(token)
            .then(decoded => {
                if (!decoded) {
                    reject({
                        meta: {
                            success: false,
                            message: "Corrupted token provided",
                            code: 400
                        }
                    });
                } else {
                    return AdminTransactions.find_admin_by_id(decoded);
                }
            })
            .then(admin => {
                resolve({
                    meta: {
                        success: true,
                        message: "Token decoded successfully",
                        code: 200
                    },
                    payload: {
                        decoded: admin
                    }
                });
            })
            .catch(err => {
                console.error(err);
                reject({
                    meta: {
                        success: false,
                        message: "An error occurred",
                        code: 500
                    }
                });
            });
    });
};

module.exports.add_asset = (asset_name) => {
    return new Promise((resolve, reject) => {
        AssetTransactions.add_asset(asset_name)
            .then(asset => {
                resolve({
                    meta: {
                        success: true,
                        message: "Added asset successfully",
                        code: 200
                    },
                    payload: {
                        asset: asset
                    }
                });
            })
            .catch(err => {
                console.error(err);
                if (err.code == 11000) {
                    reject({
                        meta: {
                            success: false,
                            message: "Asset found with the same name",
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

module.exports.add_task = (task_name, frequency) => {
    return new Promise((resolve, reject) => {
        TaskTransactions.add_task(task_name, frequency).then(task => {
                resolve({
                    meta: {
                        success: true,
                        message: "Added task successfully",
                        code: 200
                    },
                    payload: {
                        task: task
                    }
                });
            })
            .catch(err => {
                console.error(err);
                if (err.code == 11000) {
                    reject({
                        meta: {
                            success: false,
                            message: "Task found with the same name",
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

module.exports.allocate_task = (asset_name, task_id, worker_id, allocated_time, finishing_time) => {
    return new Promise((resolve, reject) => {

        let current_task_id, current_worker_id;

        TaskTransactions.get_task_by_name(task_id)
            .then(task => {
                if (!task) {
                    reject({
                        meta: {
                            success: false,
                            message: "Task not found with the provided id",
                            code: 404
                        }
                    });
                } else {
                    current_task_id = task._id;
                    return WorkerTransactions.find_worker_by_email(worker_id);
                }
            })
            .then(worker => {
                if (!worker) {
                    reject({
                        meta: {
                            success: false,
                            message: "Worker not found with the provided id",
                            code: 404
                        }
                    });
                } else {
                    current_worker_id = worker._id;
                    return AssetTransactions.get_asset_by_name(asset_name);
                }
            })
            .then(asset => {
                if (!asset) {
                    reject({
                        meta: {
                            success: false,
                            message: "No asset found with the provided asset name",
                            code: 404
                        }
                    });
                } else {
                    return TaskTransactions.allocate_task(asset._id, current_task_id, current_worker_id, allocated_time, finishing_time); 
                }
            })
            .then(task => {
                if (!task) {
                    reject({
                        meta: {
                            success: false,
                            message: "No task found with the provided task id",
                            code: 404
                        }
                    });
                } else {
                    resolve({
                        meta: {
                            success: true,
                            message: "Allocated the task successfully",
                            code: 200
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
}

module.exports.get_tasks_for_worker = (worker_id) => {
    return new Promise((resolve, reject) => {
        WorkerTransactions.find_worker_by_email(worker_id)
            .then(worker => {
                if (!worker) {
                    reject({
                        meta: {
                            success: false,
                            message: "No worker found with the provided id",
                            code: 404
                        }
                    });
                } else {
                    return TaskTransactions.get_tasks_for_worker(worker._id);
                }
            })
            .then(tasks => {
                if (!tasks || tasks.length == 0) {
                    reject({
                        meta: {
                            success: false,
                            message: "No tasks found for the provided worker",
                            code: 404
                        }
                    });
                } else {
                    resolve({
                        meta: {
                            success: true,
                            message: "Fetched the tasks for the provided worker",
                            code: 200
                        },
                        payload: {
                            tasks: tasks
                        }
                    });
                }
            })
    });
};

module.exports.add_worker = (name, email, password) => {
    return new Promise((resolve, reject) => {
        WorkerTransactions.hash_gen(password)
            .then(hash => WorkerTransactions.add_worker(name, email, hash))
            .then(worker => {
                resolve({
                    meta: {
                        success: true,
                        message: "Added worker successfully",
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

module.exports.get_all_assets = () => {
    return new Promise((resolve, reject) => {
        AssetTransactions.get_all_assets()
            .then(assets => {
                if (!assets || assets.length == 0) {
                    reject({
                        meta: {
                            success: false,
                            message: "No assets found",
                            code: 404
                        }
                    });
                } else {
                    resolve({
                        meta: {
                            success: true,
                            message: "Fetched all the assets",
                            code: 200
                        },
                        payload: {
                            assets: assets
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

module.exports.get_all_tasks = () => {
    return new Promise((resolve, reject) => {
        TaskTransactions.get_all_tasks()
            .then(tasks => {
                if (!tasks || tasks.length == 0) {
                    reject({
                        meta: {
                            success: false,
                            message: "No tasks found",
                            code: 404
                        }
                    });
                } else {
                    resolve({
                        meta: {
                            success: true,
                            message: "Fetched all the tasks",
                            code: 200
                        },
                        payload: {
                            tasks: tasks
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