import multer from "multer"
import crypto from "crypto"
import path from "path"

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads')
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(12,(err,bytes)=>{
        const fs = bytes.toString("hex")+path.extname((file.originalname))
        cb(null, fs)
    })
  }
})

const upload = multer({ storage: storage })

export default upload