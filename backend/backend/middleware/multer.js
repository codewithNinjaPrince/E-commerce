import multer from 'multer'

const storage=multer.diskStorage({
   filename:function(req,file,callback){
      callback(null,file.originalname)
   }
})

const upload =multer({storage})

export default upload

//This starts from 6:29:50 and working fine please do not touch it 