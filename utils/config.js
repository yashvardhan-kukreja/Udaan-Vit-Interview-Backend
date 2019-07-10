module.exports = {
    JWT_SECRET: process.env.JWT_SECRET || "always_be_closing_2387753091283",
    DB: process.env.DB || "mongodb+srv://yash98:yash98@cluster0-hz2jf.mongodb.net/test?retryWrites=true&w=majority",
    PORT: process.env.PORT || 8000
}