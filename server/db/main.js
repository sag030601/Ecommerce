const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

let gfs;

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    // Initialize GridFS stream
    gfs = Grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection('products'); // Specify the collection name for GridFS
    console.log('GridFS initialized');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit process with failure
  }
};

// Export the GridFS stream
module.exports = {
  connectDB,
  getGfs: () => {
    if (!gfs) {
      throw new Error('GridFS is not initialized');
    }
    return gfs;
  },
};
