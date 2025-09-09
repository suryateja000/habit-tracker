// models/Friendship.js
import mongoose from 'mongoose';

const friendshipSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'blocked'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Compound unique index to prevent duplicate requests
friendshipSchema.index({ requester: 1, recipient: 1 }, { unique: true });

// Prevent users from following themselves
friendshipSchema.pre('save', function(next) {
  if (this.requester.equals(this.recipient)) {
    const error = new Error('Users cannot follow themselves');
    return next(error);
  }
  next();
});

export default mongoose.model('Friendship', friendshipSchema);
