
const mongoose = require('mongoose');

const callSchema = new mongoose.Schema({
  callerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number
  },
  status: {
    type: String,
    enum: ['missed', 'completed', 'rejected'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add method to calculate duration
callSchema.pre('save', function(next) {
  if (this.startTime && this.endTime) {
    this.duration = Math.floor((this.endTime - this.startTime) / 1000); // Duration in seconds
  }
  next();
});

const Call = mongoose.model('Call', callSchema);

module.exports = Call;
