const router = require('express').Router();

// multer
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //      console.log(file);
    cb(
      null,
      process.env.NODE_ENV === 'development'
        ? `${__dirname}/../../cdn/images`
        : '/data/cdn/images'
    );
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

    let mimeType;

    switch (file.mimetype) {
      case 'image/jpeg':
        mimeType = 'jpg';
        break;
      case 'image/png':
        mimeType = 'png';
        break;
      case 'image/gif':
        mimeType = 'gif';
        break;
      case 'image/bmp':
        mimeType = 'bmp';
        break;
      default:
        mimeType = 'jpg';
        break;
    }

    cb(null, `${uniqueSuffix}.${mimeType}`);
  },
});
const multerImage = multer({ storage: storage });

router.get('/', (req, res) => {
  res.send('hello');
});

router.post('/images/upload', multerImage.single('edit_image'), (req, res) => {
  // console.log(req.file);

  res.json({
    imageUrl: `https://localhost:5100/images/${req.file.filename}`,
    uploadResult: true,
  });
});

module.exports = router;
