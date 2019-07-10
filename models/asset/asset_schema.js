const mongoose = require("mongoose");

const asset_schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('Asset', asset_schema, "assets");