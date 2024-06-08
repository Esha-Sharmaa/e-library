const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./db/connection.js");
const app = require("./app.js");
const port = process.env.PORT || 8080;
connectDB()
    .then(() => {
        app.listen(port, () => console.log(`Server Running on http://localhost:${port}`))
    })
    .catch((error) => {
        console.log("Error running the server", error)
    });