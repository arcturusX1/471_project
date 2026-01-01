const express = require('express');
const router = express.Router();
// Import models from Yasir's file
const { Message, Conversation, User } = require('../models/model.js');

// 1. GET MESSAGES
router.get('/', async (req, res) => {
    const { senderId, receiverId } = req.query;
    try {
        const messages = await Message.find({
            $or: [
                { sender: senderId, readBy: { $in: [receiverId] } }, 
                { sender: receiverId, readBy: { $in: [senderId] } },
                { sender: { $in: [senderId, receiverId] } } 
            ]
        })
        .populate('sender', 'name')
        .sort({ createdAt: 1 });

        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. SEND MESSAGE
router.post('/', async (req, res) => {
    const { senderId, receiverId, content } = req.body;
    try {
        let conversation = await Conversation.findOne({
            members: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                members: [senderId, receiverId],
                type: 'one-to-one'
            });
        }

        const newMessage = await Message.create({
            conversation: conversation._id,
            sender: senderId,
            body: content,
            visibility: 'members',
            readBy: [senderId] // Sender has read their own message
        });

        res.status(201).json(newMessage);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. NEW: MARK MESSAGES AS READ (The WhatsApp Feature)
router.put('/mark-read', async (req, res) => {
    const { readerId, senderId } = req.body;
    try {
        // Find all messages sent by the OTHER person (senderId)
        // that have NOT yet been read by ME (readerId)
        await Message.updateMany(
            { 
                sender: senderId, 
                readBy: { $ne: readerId } // $ne means "not equal" / not in array
            },
            { 
                $addToSet: { readBy: readerId } // Add my ID to the "Read By" list
            }
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. GET USER STATUS (For Active Status)
router.get('/status/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ error: "User not found" });
        
        // Return availability status from Schema
        res.json({ 
            status: user.availability?.status || 'offline',
            lastLogin: user.lastLogin 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;