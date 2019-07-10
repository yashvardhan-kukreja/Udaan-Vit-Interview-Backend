const Admin = require("./admin_schema");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");
const Promise = require("bluebird");
const config = require("../../utils/config");

const SECRET = config.JWT_SECRET;

module.exports.add_admin = (name, email, hashed_password) => {
    let new_admin = new Admin({
        name: name,
        email: email,
        password: hashed_password
    });

    return new_admin.save();
}

module.exports.hash_gen = (input) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            if(err) {
                reject(err);
            } else {
                bcrypt.hash(input, salt, null, (err, hash) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(hash);
                    }
                });
            }
        });
    });
};

module.exports.compare_password = (admin, input_password) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(input_password, admin.password, (err, valid_password) => {
            if (err)
                reject(err);
            else
                resolve(valid_password);
        });
    });
}

module.exports.generate_token = (admin) => {
    return jwt.sign(JSON.parse(JSON.stringify(admin._id)), SECRET);
};

module.exports.decode_token = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, SECRET, (err, output) => err ? reject(err) : resolve(output));
    });
};

module.exports.find_admin_by_email = (email) => {
    return Admin.findOne({email: email});
};

module.exports.find_admin_by_id = (id) => {
    return Admin.findOne({_id: id});
};