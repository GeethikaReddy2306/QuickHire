const express = require('express');
const router = express.Router();

const {
    applyJob,
    getAppliedJob,
    getApplicants,
    updateStatus
} = require('../controllers/application.controller');

const isAuthenticated = require('../middleware/auth');

router.get('/apply/:id', isAuthenticated, applyJob);

router.get('/get', isAuthenticated, getAppliedJob);

router.get('/:id/applicants', isAuthenticated, getApplicants);

router.post('/status/:id/update', isAuthenticated, updateStatus);

module.exports = router;