const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const helmet = require("helmet");
const compression = require("compression");

const config = require("./utils/config");
const auth_router = require("./routes/auth_routes");
const admin_router = require("./routes/admin_routes");

const DB = config.DB;
const port = config.PORT;
const app = express();

// Establishing connection with the Database
mongoose.connect(DB, (err) => {
    if (err)
        console.error("Error occurred while establishing connection to the database!");
    else {
        console.log("Connection established to the database successfully...");

        // Attaching bodyParser dependency to parse the body of the request data
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        // Attaching the logger to the app to record every API call executed to it
        app.use(logger("dev"));

        // Attaching the helmet dependency to encypt the request and response headers
        app.use(helmet());

        // Attaching the compression dependency to lighten the request body and headers
        app.use(compression());

        app.get("/health-check", (req, res) => {
            res.json({
                meta: {
                    success: true,
                    message: "Healthcheck done. Server is running!",
                    code: 200
                }
            });
        });

        // Attaching the respective routers to the respective base endpoints
        app.use("/api/auth", auth_router);
        app.use("/api/admin", admin_router);

        // Setting up the not found error
        app.use((err, req, res, next) => {
            const message = err.message;
            const error = req.app.get('env') === 'development' ? err : {};
            const status = err.status || 500;
            res.status(status);
            res.json({error , message});
        });

        // Starting the server at the given port
        app.listen(port, () => console.log(`Server running successfully on port number ${port}...`));

    }
});



