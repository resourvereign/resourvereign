import { User, UserRole } from '@resourvereign/common/models/user.js';
import email from '@slangy/mongo/middleware/mongoose/email.js';
import normalizeJson from '@slangy/mongo/middleware/mongoose/normalizeJson.js';
import password, { WithPassword } from '@slangy/mongo/middleware/mongoose/password.js';
import timestamps from '@slangy/mongo/middleware/mongoose/timestamps.js';
import { Document, Schema, model } from 'mongoose';

export type UserDocument = Document & User & WithPassword;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    role: {
      type: String,
      required: true,
      enum: Object.values(UserRole),
      default: UserRole.user,
    },
  },
  { collection: 'users', minimize: false },
)
  .plugin(email)
  .plugin(password, { required: false })
  .plugin(timestamps)
  .plugin(normalizeJson, { remove: ['password', '__v'] });

export default model<UserDocument>('User', userSchema);
