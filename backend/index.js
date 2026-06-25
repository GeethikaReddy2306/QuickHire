const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dns = require("dns");
const multer = require("multer");
require("dotenv").config();

const companyRoutes = require("./routes/company.routes");
const jobRoute = require("./routes/job.route");
const applicationRoute = require("./routes/application.routes");
const userRoutes = require("./routes/user.routes");
const db = require("./config/db");
const { errorResponse } = require("./utils/response");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

db()
  .then(() => console.log("db connected"))
  .catch((err) => console.log(err));

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/job", jobRoute);
app.use("/api/application", applicationRoute);

app.get("/", (req, res) => {
  res.send("Server Working");
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return errorResponse(res, 400, err.message);
  }

  if (err) {
    return errorResponse(res, 400, err.message || "Request failed");
  }

  next();
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`server is running successfully on port ${port}`);
});
