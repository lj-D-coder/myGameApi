import mongoose from 'mongoose';

const usersSchema = mongoose.Schema(
    {
        loginId:{
            type: String,
            unique: true,
        },
        userName: {
            type: String
        },
        phoneNo: {
            type: String
        },
        email:{
            type: String
        },
        userRole:{
            type: String
        },
        profilePicture:{
            type: String
        }
    },
        {
            timestamps: true,
        },
);

export const User = mongoose.model('users_collection', usersSchema);

