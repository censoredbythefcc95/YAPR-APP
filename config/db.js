const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
    try {
        await mongoose.connect(db); // Please note that you no longer have to pass newUrlParser or Topology. It is omitted here for that reason. 

        console.log('You have successfully connected to MongoDB.');
    } catch(err) {
        console.error(err.message);
        process.exit(1);
        // This exits the process with failure to let us know there is a problem with connecting to MongoDB.
    }
};

module.exports = connectDB;