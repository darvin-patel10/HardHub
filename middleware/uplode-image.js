const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/image/Product')
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(12, (err, Bytes) => {
        const fn = Bytes.toString('hex') + path.extname(file.originalname);
        cb(null, fn);
    })
    
  }
})

const upload = multer({ storage: storage })

module.exports =  upload;