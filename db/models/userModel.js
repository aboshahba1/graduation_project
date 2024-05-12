import mongoose, { Schema } from "mongoose";
import {
  systemRoles,
  providers,
  specialization,
} from "../../src/utils/systemRoles.js";

const userSchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
      unique: true,
      min: 3,
      max: 20,
      trim: true,
    },
    Mail: {
      type: String,
      required: true,
      unique: true,
    },
    Phone: {
      type: String,
      required: true,
      min: 11,
      max: 11,
      trim: true,
    },
    Age: {
      type: String,
      required: true,
      trim: true,
    },
    NationalID: {
      type: String,
      required: true,
      unique: true,
      min: 14,
      max: 14,
      trim: true,
    },
    Password: {
      type: String,
      required: true,
    },
    profilePic: {
      secure_url: String,
      public_id: String,
    },
    role: {
      type: String,
      enum: [systemRoles.CLIENT],
      default: systemRoles.CLIENT,
    },
    provider: {
      type: String,
      enum: [providers.SYSTEM, providers.GOOGLE, providers.FACEBOOK],
      required: true,
      default: providers.SYSTEM,
    },
    isDoctor: {
      type: Boolean,
      default: false,
    },

    doctorSpecialization: {
      type: String,
      enum: [
        specialization.CARDIOLOGY,
        specialization.INTERNAL_MEDICINE,
        specialization.NEUROLOGY,
        specialization.OPHTHALMOLOGY,
        specialization.PEDIATRICS,
        specialization.PEDIATRICS,
        specialization.SURGERY,
        specialization.NONE,
      ],
      required: true,
      default: specialization.NONE,
    },
    experienceNumber: {
      type: String,
    },
    doctorDetails: {
      type: String,
      default: "",
    },
    token: {
      type: String,
      default: "",
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    otp: String,
  },
  {
    timestamps: true,
  }
);

export const userModel = mongoose.model("user", userSchema);
