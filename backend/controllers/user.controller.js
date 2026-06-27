const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const User = require("../models/user.model");
const s3 = require("../utils/s3");
const { successResponse, errorResponse } = require("../utils/response");

const allowedRoles = ["student", "recruiter"];
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
function buildUserPayload(user) {
  const doc = user?.toObject ? user.toObject() : user;

  return {
    _id: doc._id,
    name: doc.name,
    email: doc.email,
    phoneNumber: doc.phoneNumber,
    role: doc.role,
    profile: {
      bio: doc.profile?.bio || "",
      skills: doc.profile?.skills || [],
      resume: doc.profile?.resume || "",
      resumeOriginalName: doc.profile?.resumeOriginalName || "",
      photo: doc.profile?.photo || ""
    }
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

function getBucketName() {
  return process.env.AWS_S3_BUCKET_NAME || process.env.AWS_BUCKET_NAME;
}

async function uploadToS3(file, userId, folder) {
  const bucketName = getBucketName();
  const region = process.env.AWS_REGION;

  if (!bucketName || !region) {
    throw new Error("AWS S3 bucket or region is not configured");
  }

  const safeFileName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "-");
  const key = `${folder}/${userId}/${Date.now()}-${safeFileName}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype
    })
  );

  return {
    url: `https://${bucketName}.s3.${region}.amazonaws.com/${key}`,
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

    console.log("[updateProfile] request body:", req.body);
    console.log("[updateProfile] uploaded files:", {
      resume: req.files?.resume?.[0]?.originalname,
      photo: req.files?.photo?.[0]?.originalname
    });

    const user = await User.findById(userId);

    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    console.log("[updateProfile] MongoDB photo before save:", user.profile?.photo);

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

    const resumeFile = req.files?.resume?.[0];
    const photoFile = req.files?.photo?.[0];

    if (resumeFile) {
      const uploadedResume = await uploadToS3(resumeFile, userId, "resumes");
      user.profile.resume = uploadedResume.url;
      user.profile.resumeOriginalName = uploadedResume.originalName;
      user.markModified("profile");
    }

    if (photoFile) {
      const uploadedPhoto = await uploadToS3(photoFile, userId, "profile-photos");
      console.log("[updateProfile] S3 photo URL:", uploadedPhoto.url);
      user.profile.photo = uploadedPhoto.url;
      user.markModified("profile");
    }

    if (bio !== undefined || skills !== undefined) {
      user.markModified("profile");
    }

    await user.save();

    console.log("[updateProfile] MongoDB photo after save:", user.profile?.photo);

    const responseUser = buildUserPayload(user);
    console.log("[updateProfile] API response user photo:", responseUser.profile?.photo);

    return successResponse(res, 200, "Profile updated successfully", {
      user: responseUser
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
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    if (!user.profile.resume) {
      return errorResponse(res, 404, "Resume not found");
    }

    const bucket = getBucketName();

    if (!bucket) {
      return errorResponse(res, 500, "AWS S3 bucket is not configured");
    }

    const url = new URL(user.profile.resume);
    const key = decodeURIComponent(
      url.pathname.startsWith("/") ? url.pathname.slice(1) : url.pathname
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
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return errorResponse(res, 400, "Email is required");
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return errorResponse(res, 404, "No account found with this email");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // expiry: 1 hour
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const html = `
      <div style="font-family:Arial,sans-serif;padding:20px">
        <h2>Reset your QuickHire password</h2>

        <p>Hello ${user.name},</p>

        <p>Click the button below to reset your password.</p>

        <a
          href="${resetUrl}"
          style="display:inline-block;padding:12px 22px;background:#2563eb;color:white;text-decoration:none;border-radius:6px;font-weight:bold;"
        >
          Reset Password
        </a>

        <p style="margin-top:20px">This link expires in <b>1 hour</b>.</p>

        <p>If you didn't request this, simply ignore this email.</p>

        <hr/>

        <small>QuickHire Team</small>
      </div>
    `;

    await sendEmail(user.email, "Reset your QuickHire password", html);

    return successResponse(
      res,
      200,
      "Password reset link sent successfully"
    );

  } catch (err) {
    console.log(err);

    return errorResponse(
      res,
      500,
      "Unable to send reset email"
    );
  }
}

async function resetPassword(req, res) {
  try {

    const { token } = req.params;

    const { password } = req.body;

    if (!password) {
      return errorResponse(res, 400, "Password is required");
    }

    if (password.length < 6) {
      return errorResponse(
        res,
        400,
        "Password must be at least 6 characters"
      );
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return errorResponse(
        res,
        400,
        "Reset link is invalid or expired"
      );
    }

    user.password = await bcrypt.hash(password, 10);

    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return successResponse(
      res,
      200,
      "Password reset successfully"
    );

  } catch (err) {

    console.log(err);

    return errorResponse(
      res,
      500,
      "Unable to reset password"
    );
  }
}

module.exports = {
  registerUser,
  login,
  updateProfile,
  downloadResume,
  forgotPassword,
  resetPassword,
};