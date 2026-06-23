const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dns = require('dns');
require('dotenv').config();

const companyRoutes = require('./routes/company.routes');
const jobRoute = require('./routes/job.route');
const applicationRoute = require('./routes/application.routes');
const router = require('./routes/user.routes');

// to avoid dns error
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// connecting db
const db = require('./config/db');
db()
  .then(() => console.log("db connected"))
  .catch((err) => console.log(err));

// CORS options
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true
};

// middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.use('/api/user', router);
app.use('/api/company', companyRoutes);
app.use('/api/job', jobRoute);
app.use('/api/application', applicationRoute);

app.get('/', (req, res) => {
  res.send('Server Working');
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`server is running successfully on port ${port}`);
});