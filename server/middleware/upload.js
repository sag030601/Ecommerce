const multer = require('multer');
const { PassThrough } = require('stream');
const { getGfs } = require('../db/main');

// Create multer storage in memory
const storage = multer.memoryStorage();

const upload = multer({ storage });

const handleFileUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const file = req.file;
  const gfs = getGfs();

  // Create a writable stream for GridFS
  const writeStream = gfs.createWriteStream({
    filename: file.originalname,
    bucketName: 'products',
    metadata: { fieldName: file.fieldname },
  });

  // Create a readable stream from the file buffer
  const readStream = new PassThrough();
  readStream.end(file.buffer);

  // Pipe the readable stream to GridFS writable stream
  readStream.pipe(writeStream);

  writeStream.on('finish', () => {
    res.status(201).json({ message: 'File uploaded successfully' });
  });

  writeStream.on('error', (error) => {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Error uploading file' });
  });
};

module.exports = {
  upload,
  handleFileUpload,
};
