const Asset = require("./asset_schema");

module.exports.add_asset = (asset_name) => {
    let new_asset = new Asset({
        name: asset_name
    });

    return new_asset.save();
};

module.exports.get_all_assets = () => {
    return Asset.find({});
}

module.exports.get_asset_by_id = (id) => {
    return Asset.findOne({_id: id});
}

module.exports.get_asset_by_name = (name) => {
    return Asset.findOne({name: name});
}

