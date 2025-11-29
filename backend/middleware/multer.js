import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export default upload;

//This starts from 6:29:50 and working fine please do not touch it 