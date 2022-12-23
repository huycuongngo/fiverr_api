const multer = require('multer');
const fs = require('fs')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/gif')
      cb(null, './public/img')
    else
      cb(null, './public/other')
  },
  filename: async (req, file, cb) => {
    const fileName = Date.now() + "_" + file.originalname;
    await cb(null, fileName)
    const path = `public/other/${fileName}`;
    if (fs.existsSync(path)) {
      fs.unlink(path, (err) => {
        if (err) console.error(err)
      })
    }
  }
})
const upload = multer({ storage })

module.exports = {
  upload
}
