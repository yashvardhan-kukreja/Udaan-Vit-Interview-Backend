const Worker = require("./worker_schema");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");
const Promise = require("bluebird");
const config = require("../../utils/config");

const SECRET = config.JWT_SECRET;

module.exports.add_worker = (name, email, hashed_password) => {
    let new_worker = new Worker({
        name: name,
        email: email,
        password: hashed_password
    });

    return new_worker.save();
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

module.exports.compare_password = (worker, input_password) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(input_password, worker.password, (err, valid_password) => {
            if (err)
                reject(err);
            else
                resolve(valid_password);
        });
    });
}

module.exports.generate_token = (worker) => {
    return jwt.sign(JSON.parse(JSON.stringify(worker._id)), SECRET);
};

module.exports.decode_token = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, SECRET, (err, output) => err ? reject(err) : resolve(output));
    });
};

module.exports.find_worker_by_email = (email) => {
    return Worker.findOne({email: email});
}