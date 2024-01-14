import express from 'express';
import { authAddUser, saveGoogleinfo } from '../controllers/authController.js';
import multer from 'multer';

const router = express.Router();


const upload = multer({ dest: 'uploads/' });
router.post('/', authAddUser);

// router.post('/', upload.single('profilePicture'), addUser);


// router.post('/sign-up', signup);
// router.post('/varify-otp', varify);
router.post('/save-google-info', saveGoogleinfo);


export default router;
