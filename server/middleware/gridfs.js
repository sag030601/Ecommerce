const Grid = require('gridfs-stream');
const { getGfs } = require('../db/main');

// Initialize GridFS stream and export it
const gfs = () => {
  if (!getGfs()) {
    throw new Error('GridFS is not initialized');
  }
  return getGfs();
};

module.exports = gfs;
