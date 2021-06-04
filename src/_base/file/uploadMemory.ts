import multer, { memoryStorage } from "multer"

const uploadMemory = multer({
  storage: multer.memoryStorage(),
  fileFilter: function (req:any , file: any, cb: any) {
    const mt = file.mimetype;
    const isOK = mt === 'image/jpg' || mt === 'image/jpeg' || mt === 'image/png' || mt === 'image/gif';
    return cb(null, isOK);
  },
})

export default uploadMemory;