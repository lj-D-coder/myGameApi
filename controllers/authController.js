import { User } from "../models/usersModel.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import sharp from 'sharp';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = dirname(currentFilePath);
const uploadDir = path.join(currentDir, '../uploads');

const isImageExtensionValid = (extension) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  return allowedExtensions.includes(extension.toLowerCase());
};

export const addUser = async (req, res, next) => {
  console.log(req.body);
  try {
    const { userRole, userName } = req.body;
    let { loginId, email, phoneNo} = req.body;

    // Check if email is provided and not an empty string
    if (email === null || email.trim() === '') {email = undefined; } 
    if (phoneNo === null || phoneNo.trim() === '') { phoneNo = undefined; }

    if (!phoneNo && !email) return next(errorHandler(403, "Invalid input"));

    const checkloginId = await User.findOne({ loginId });  
   
    if (checkloginId) {
      const JWT_token = jwt.sign(
        { userId: checkloginId._id, data: checkloginId},
        process.env.JWT_SECRET
      );
      console.log("fetching user data");
      return res.status(200).json({ success: true, JWT_token });

    }

    const user = new User({ loginId, userName, phoneNo, userRole, email });

    if (req.file) {
      const timestamp = Date.now();
      const ext = path.extname(req.file.originalname);

      // Check if the file extension is valid
      if (!isImageExtensionValid(ext)) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ success: false, message: 'Invalid image file format' });
      }

      const newFilename = `${timestamp}.webp`;
      const newPath = path.join(uploadDir, newFilename);

      // Resize and convert image to webp
      await sharp(req.file.path)
        .resize({ width: 500, height: 500, fit: 'cover' })
        .webp({ quality: 80 })
        .toFile(newPath);

      fs.unlinkSync(req.file.path);

      user.profilePicture = `${process.env.DOMAIN_NAME}/uploads/${newFilename}`;
    }
   
    await user.save({ omitUndefined: true });

    const JWT_token = jwt.sign(
      { userId: user._id, data: user},process.env.JWT_SECRET);
    console.log("fetching user data");
    return res.status(200).json({ success: true, message: 'User added successfully', JWT_token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


// export const signup = async (req, res, next) => {
//   try {
//     if (!req.body.phone) {
//   return res.status(400).json({
//     message: "Phone no is required",
//     });
//     }

//     const { phone, UserName } = req.body;
//     const validUser = await Users.findOne({ phone });  
//     if (validUser) return next(errorHandler(403, "phone number already exist"));

//     const newUser = new Users({
//       phone,
//       userRole: "user",
//       UserName
//       });
//     const user = await newUser.save();
//     const JWT_token = jwt.sign(
//     { userId: user._id, phone, varificationStatus: 'Pending' },
//     process.env.JWT_SECRET
//     );

//   console.log("User Id cerated sucessfully");
//   return res.status(201).json({ success: true, JWT_token });
  
//   } catch (error) {
//     console.log(error.message);
//     next(errorHandler(400,"something went wrong"));
//   }
// };




// export const varify = async (req, res, next) => {
//   const { phone, otp } = req.body;
//   try {
//     const validUser = await Users.findOne({ phone });
//     if (!validUser) return next(errorHandler(404, "Phone number not found!"));

//     const otpCheck = compareSync(otp, validUser.otp);
//     if (!otpCheck) return next(errorHandler(401, "Wrong credentials!"));


//     const updateData = {
//       varification: 'Varified',
//       otpExpiry: 'Expired',
//     };
//     const updatedStatus= await Users.updateOne({ phone }, updateData, { upsert: true });

//     const JWT_token = jwt.sign(
//       { userId: updatedStatus._id, phone: updatedStatus.phone, varificationStatus: updatedStatus.varification },
//       process.env.JWT_SECRET
//     );
  
//     console.log("User OTP varification sucessfull");
//     res.status(200).json({ success: true, JWT_token });
//     //.cookie("access_token", token, { httponly: true , maxAge: 24 * 60 * 60 * 1000 })
//   } catch (error) {
//     next(error);
//   }
// };



export const saveGoogleinfo = async (req, res, next) => {
  if (!req.body.email || !req.body.gToken || !req.body.expiry) {
    return response.status(400).json({
      message: "send all required feilds: email, gToken, expiry",
    });
  }

  const { email, gToken, expiry } = req.body;
  try {
    const checkEmail = await User.findOne({ email });
    const username = email.split("@")[0];
    if (!checkEmail) {
      
      const saveUserInfo = new User({
        username,
        email,
        gAuthToken: gToken,
        expiry,
      });
      const userInfo = await saveUserInfo.save();

      const JWT_token = jwt.sign(
        { userId: userInfo._id, email: userInfo.email },
        process.env.JWT_SECRET
      );
      console.log("New Google Sign in sucessfully");
    res.status(200).json({ success: true, JWT_token });

    } else {
      const updatedData = {
        gAuthToken: req.body.gToken,
        expiry: req.body.expiry,
      };
      await Users.updateOne({ email }, updatedData, { upsert: true });
      const JWT_token = jwt.sign(
        { userId: checkEmail._id, email: checkEmail.email },
        process.env.JWT_SECRET
      );
      console.log("Google sign In Token Updated");
      res.status(200).json({ success: true, JWT_token });
    }
    
  } catch (error) {
    //next(errorHandler(500, 'something went wrong!'));
    console.log(error.message);
  }
};
