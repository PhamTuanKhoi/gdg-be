import { extname } from "path";
import multer, { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|gif|mp4|amv)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('').toLowerCase();
  callback(null, `${name}-${randomName}${fileExtName}`);
};

export const diskStorageFileName = (folderName: string): multer.StorageEngine  => { 
  return  diskStorage({
      destination: (req, file, cb) => {
        const uploadId = req.params.id;
        const uploadPath = uploadId ? path.resolve(process.cwd(), 'uploads', folderName, uploadId) 
        : path.resolve(process.cwd(), 'uploads', folderName) ;
        
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
      }
    }) as multer.StorageEngine
};