import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
)

export type User = {
  _id: string
  name: string
  email: string
  isAdmin: boolean
}

const UserModel = mongoose.models?.User || mongoose.model('User', UserSchema)
export default UserModel
