import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import Channel from '../../models/Channel';
import { getIO } from '../io';

const router = Router();


router.post('/create', async (req, res) => {
    const { name } = req.body;
    const userId = req.userId;

        const existingChannel = await Channel.findOne({ name });
        if (existingChannel) {
            return res.status(400).json({ error: 'Channel already exists' });
        }
        const ownerId = new mongoose.Types.ObjectId(userId);
        // ایجاد کانال جدید
        const newChannel = new Channel({
            name,
            owner: ownerId,
            members: [ownerId]
        });
        await newChannel.save();

        res.status(201).json(newChannel);

});

router.post('/send-message', async (req, res) => {
    const { channelName, message } = req.body;
    const userId = req.userId;

    try {
        const channel = await Channel.findOne({ name: channelName });
        if (!channel) {
            return res.status(404).json({ error: 'Channel not found' });
        }
        // if (channel.owner.toString() !== userId && !channel.members.includes(userId)) {
        //     return res.status(403).json({ error: 'You do not have permission to send messages to this channel' });
        // }

        const io = getIO();
        io.to(channelName).emit('chat message', { message, channelName });

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});



export default router;