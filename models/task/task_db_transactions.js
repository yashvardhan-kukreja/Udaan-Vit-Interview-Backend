const Task = require("./task_schema");

module.exports.add_task = (task_name, frequency) => {
    let new_task = new Task({
        name: task_name,
        frequency: frequency
    });

    return new_task.save();
}

module.exports.allocate_task = (asset_id, task_id, worker_id, allocated_time, finishing_time) => {
    return Task.findOneAndUpdate({_id: task_id}, {asset_on_which_performed: asset_id, allocated_time: allocated_time, finishing_time: finishing_time, worker: worker_id});
}

module.exports.get_all_tasks = () => {
    return Task.find({});
}

module.exports.get_task_by_id = (id) => {
    return Task.findOne({_id: id});
}

module.exports.get_tasks_for_worker = (worker_id) => {
    return Task.find({worker: worker_id});
}

module.exports.get_task_by_name = (name) => {
    return Task.findOne({name: name});
}

