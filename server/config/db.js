// tramar/server/config/db.js (Assuming this is the path)

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // 🟢 FIX 1: Removed deprecated options (useNewUrlParser, useUnifiedTopology)
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // 🟢 OPTIONAL FIX 2: Set strictQuery to false for cleaner development (Mongoose 7+)
    mongoose.set('strictQuery', false);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    // Exit process with failure code
    process.exit(1);
  }
};

module.exports = connectDB;