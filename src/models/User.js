import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
    },
    role: {
      type: String,
      enum: ['user', 'vendor', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true, // Yeh automatically `createdAt` aur `updatedAt` fields bana dega
  }
);

// Next.js ke hot-reload feature ki wajah se model dobara compile hone se bachane ke liye yeh check lagate hain
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;