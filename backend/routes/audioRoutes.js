const express = require('express');
const router = express.Router();
const multer = require('multer');
const AudioController = require('../controllers/AudioController.js');

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const [, extension] = file.originalname.split('.');
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + extension);
  },
});

const multerMiddleware = multer({ storage: multerStorage });

router.post(
  '/download',
  multerMiddleware.single('audioFile'),
  AudioController.downloadSingle
);
router.post(
  '/mix',
  multerMiddleware.array('audioFiles', 10),
  AudioController.downloadMix
);
router.post(
  '/meta-tags/edit',
  multerMiddleware.single('audioFile'),
  AudioController.editMetaTags
);

module.exports = router;
