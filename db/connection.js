const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const response = await mongoose.connect(process.env.MONGO_URI);
        console.log("MonogoDB running on port", response.connection.port);
        
    } catch (error) {
        console.error("Error Connecting Database: ", error);
        process.exit(1);
    }
}
module.exports = connectDB;