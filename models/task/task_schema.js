const mongoose = require("mongoose");

const task_schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    frequency: {
        type: String,
        required: true,
        enum: ["hourly", "weekly", "daily", "monthly", "yearly"]
    },
    allocated_time: {
        type: String
    },
    finishing_time: {
        type: String
    },
    asset_on_which_performed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asset'
    },
    worker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker'
    }
});

module.exports = mongoose.model('Task', task_schema, "tasks");