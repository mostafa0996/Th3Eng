const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uniqueValidator = require('mongoose-unique-validator');

const config = require('../../../common/config/configuration');
const { roles } = require('../../../common/enum/roles');

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      index: true,
      unique: true,
      sparse: true,
      maxlength: [20, 'Phone number should be less than 20 characters'],
      required: true,
    },
    googleId: {
      type: String,
      index: true,
      unique: true,
      sparse: true,
      select: false,
    },
    facebookId: {
      type: String,
      index: true,
      unique: true,
      sparse: true,
      select: false,
    },
    email: {
      type: String,
      index: true,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      match: [
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please add a valid Mail',
      ],
      required: true,
    },
    roles: {
      type: [String],
      enum: Object.values(roles),
      default: [roles.CUSTOMER],
    },
    password: {
      type: String,
      required: false,
    },
    verified: {
      type: Boolean,
      required: false,
      default: false,
    },
    deleted: {
      type: Boolean,
      required: false,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpiration: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpiration: {
      type: Date,
    },
    photo: { type: String, default: 'no-photo.jpg' },
    country: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'users',
    timestamps: true,
    versionKey: false,
  }
);

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (this.password) {
    if (this.isNew) {
      this.email = this.email.toLowerCase();
    }
    if (!this.isModified('password')) {
      next();
    }
    const salt = await bcrypt.genSalt(+config.salt);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } else next();
});

// Sign jwt
UserSchema.methods.generateJWT = function () {
  return jwt.sign(
    { _id: this._id, roles: this.roles, isPhoneVerified: this.isPhoneVerified },
    config.jwt.key,
    {
      algorithm: 'HS256',
      expiresIn: config.jwt.expire,
    }
  );
};

UserSchema.methods.toAuthJSON = function () {
  const token = this.generateJWT();
  return {
    _id: this._id,
    roles: this.roles,
    isPhoneVerified: this.isPhoneVerified,
    token: `Bearer ${token}`,
  };
};

// Match user hashed password with entered password
UserSchema.methods.validatePassword = async function (enteredPassword) {
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  return isMatch;
};

UserSchema.plugin(uniqueValidator, {
  message: 'Error, expected {PATH} to be unique.',
});

const User = mongoose.model('users', UserSchema);

module.exports = User;