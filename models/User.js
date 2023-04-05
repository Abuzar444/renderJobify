import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Παρακαλώ, γράψε το όνομά σου.'],
    minLength: 2,
    maxLength: 20,
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Παρακαλώ, γράψε το επώνυμό σου.'],
    minLength: 2,
    maxLength: 30,
    trim: true,
    default: 'Επώνυμο',
  },
  email: {
    type: String,
    required: [true, 'Παρακαλώ, γράψε το ηΤαχυδρομείο σου.'],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Παρακαλώ, γράψε μία έγκυρη διεύθυνση.',
    },
  },
  password: {
    type: String,
    required: [true, 'Παρακαλώ, γράψε έναν κωδικό.'],
    minLength: 3,
    select: false,
  },
  location: {
    type: String,
    minLength: 4,
    maxLength: 20,
    trim: true,
    default: 'Η πόλη μου',
  },
  hasRegistered: {
    type: Boolean,
    default: true,
  },
  isMember: {
    type: Boolean,
    default: false,
  },
});

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return // Μόνο όταν αλλάζουμε τον κωδικό θα συνεχίζουμε σε hash.
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  
});

// Δημιουργούμε νέο αποδεικτικό και μαζί με αυτό κάθε φορά ανανεώνεται η διάρκειά του.
UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

export default mongoose.model('User', UserSchema);
