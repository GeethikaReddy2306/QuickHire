const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const User = require("../models/user.model");
const s3 = require("../utils/s3");
const { successResponse, errorResponse } = require("../utils/response");

const allowedRoles = ["student", "recruiter"];

function buildUserPayload(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    profile: user.profile
  };
}

function parseSkills(skills) {
  if (Array.isArray(skills)) {
    return skills.map((skill) => String(skill).trim()).filter(Boolean);
  }

  if (typeof skills === "string") {
    return skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }

  return [];
}

async function uploadResume(file, userId) {
  const bucketName = process.env.AWS_S3_BUCKET_NAME || process.env.AWS_BUCKET_NAME;
  const region = process.env.AWS_REGION;

  if (!bucketName || !region) {
    throw new Error("AWS S3 bucket or region is not configured");
  }

  const safeFileName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "-");
  const key = `resumes/${userId}/${Date.now()}-${safeFileName}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype
    })
  );

  return {
    resumeUrl: `https://${bucketName}.s3.${region}.amazonaws.com/${key}`,
    originalName: file.originalname
  };
}

async function registerUser(req, res) {
  try {
    const { name, email, phoneNumber, password, role } = req.body;

    if (!name || !email || !phoneNumber || !password || !role) {
      return errorResponse(res, 400, "Missing required fields");
    }

    if (!allowedRoles.includes(role)) {
      return errorResponse(res, 400, "Invalid user role");
    }

    if (password.length < 6) {
      return errorResponse(res, 400, "Password must be at least 6 characters");
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase().trim() }, { phoneNumber }]
    });

    if (existingUser) {
      return errorResponse(res, 409, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phoneNumber,
      password: hashedPassword,
      role
    });

    return successResponse(res, 201, "Registration successful");
  } catch (err) {
    console.log(err);
    return errorResponse(res, 500, "Something went wrong");
  }
}

async function login(req, res) {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return errorResponse(res, 400, "Missing required fields");
    }

    if (!allowedRoles.includes(role)) {
      return errorResponse(res, 400, "Invalid user role");
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return errorResponse(res, 400, "Incorrect email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return errorResponse(res, 401, "Incorrect email or password");
    }

    if (role !== user.role) {
      return errorResponse(res, 400, "Account doesn't match with current role");
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000
      })
      .json({
        message: "Login successful",
        success: true,
        user: buildUserPayload(user)
      });
  } catch (err) {
    console.log(err);
    return errorResponse(res, 500, "Something went wrong");
  }
}

async function updateProfile(req, res) {
  try {
    const { name, email, phoneNumber, bio, skills } = req.body;
    const userId = req.id;

    const user = await User.findById(userId);

    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    if (email && email.toLowerCase().trim() !== user.email) {
      const existingEmail = await User.findOne({
        email: email.toLowerCase().trim(),
        _id: { $ne: userId }
      });

      if (existingEmail) {
        return errorResponse(res, 409, "Email is already in use");
      }
    }

    if (phoneNumber && String(phoneNumber) !== String(user.phoneNumber)) {
      const existingPhone = await User.findOne({
        phoneNumber,
        _id: { $ne: userId }
      });

      if (existingPhone) {
        return errorResponse(res, 409, "Phone number is already in use");
      }
    }

    if (name !== undefined) user.name = name.trim();
    if (email !== undefined) user.email = email.toLowerCase().trim();
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (bio !== undefined) user.profile.bio = bio;
    if (skills !== undefined) user.profile.skills = parseSkills(skills);

    if (req.file) {
      const uploadedResume = await uploadResume(req.file, userId);
      user.profile.resume = uploadedResume.resumeUrl;
      user.profile.resumeOriginalName = uploadedResume.originalName;
    }

    await user.save();

    return successResponse(res, 200, "Profile updated successfully", {
      user: buildUserPayload(user)
    });
  } catch (err) {
    console.log(err);

    if (err.message.includes("AWS S3")) {
      return errorResponse(res, 500, err.message);
    }

    return errorResponse(res, 500, "Something went wrong");
  }
}

async function downloadResume(req, res) {
  console.log("downloadResume called");
  console.log(req.params);

  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    if (!user.profile.resume) {
      return errorResponse(res, 404, "Resume not found");
    }

    const bucket = process.env.AWS_BUCKET_NAME;
    const region = process.env.AWS_REGION;

    // Extract object key from stored URL
    const url = new URL(user.profile.resume);

    const key = decodeURIComponent(
      url.pathname.startsWith("/")
        ? url.pathname.slice(1)
        : url.pathname
    );

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key
    });

    const signedUrl = await getSignedUrl(s3, command, {
      expiresIn: 300
    });

    return res.status(200).json({
      success: true,
      url: signedUrl,
      fileName: user.profile.resumeOriginalName
    });

  } catch (err) {
    console.log(err);
    return errorResponse(res, 500, "Unable to generate download link");
  }
}

module.exports = {
  registerUser,
  login,
  updateProfile,downloadResume
};
