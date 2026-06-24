const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    requirement: [
      {
        type: String
      }
    ],
    salary: {
      type: Number,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    jobType: {
      type: String,
      enum: ["Full-Time", "Remote", "Contract", "Hybrid", "Internship"],
      default: "Full-Time"
    },
    position: {
      type: String,
      required: true
    },
    experienceLevel: {
      type: String,
      required: true
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true
    },
    createdUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application"
      }
    ],
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open"
    }
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;