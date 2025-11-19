const mongoose = require('mongoose');

/**
 * Connect to MongoDB using Mongoose.
 * Reads `process.env.MONGODB_URI` by default.
 */
const connectDB = async (uri = process.env.MONGODB_URI) => {
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment');
  }

  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  try {
    await mongoose.connect(uri, opts);
    console.log('Connected to MongoDB');

    // Graceful shutdown
    const gracefulExit = () => {
      mongoose.connection.close(false, () => {
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
      });
    };

    process.on('SIGINT', gracefulExit);
    process.on('SIGTERM', gracefulExit);

    return mongoose.connection;
  } catch (err) {
    console.error('MongoDB connection error:', err.message || err);
    throw err;
  }
};

module.exports = connectDB;
