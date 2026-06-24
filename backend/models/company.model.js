const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    website: {
      type: String,
      default: ""
    },
    location: {
      type: String,
      default: ""
    },
    logo: {
      type: String,
      default: ""
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

// one recruiter cannot create same company twice
companySchema.index({ companyName: 1, userId: 1 }, { unique: true });

const Company = mongoose.model("Company", companySchema);

module.exports = Company;