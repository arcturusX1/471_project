import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  
  // For 1-on-1 chats
  receiverId: { type: String },
  
  // For Group chats (Project teams)
  groupId: { type: String },

  content: { type: String, required: true },
  
  isRead: { type: Boolean, default: false },
  
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Message', messageSchema);