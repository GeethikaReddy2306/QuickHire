const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({

    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    },

    resume: {
        type: String
    },

    status: {
        type: String,
        enum: ['pending', 'reviewed', 'accepted', 'rejected'],
        default: 'pending'
    },

    coverLetter: {
        type: String
    }

}, {
    timestamps: true
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;