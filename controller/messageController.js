const messageModel = require("../model/messageModel");

module.exports.getAllMessage = async (req, res, next) => {
    try {
        const { from, to } = req.body;
        const messages = await messageModel.find({
            users: {
                $all: [from, to],
            }
        }).sort({ createdAt: 1 });

        const projectMessages = messages.map((msg) => {
            return {
                
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text || null,
                media: msg.message.media || null,
                mediaType: msg.message.mediaType || null,
                read: msg.read,
                _id: msg._id
            }
        });

        await messageModel.updateMany(
            {
                users: { $all: [from, to] },
                sender: { $ne: from },
                read: false
            },
            { read: true }
        );

        return res.status(200).json(projectMessages);
    } catch (error) {
        return res.status(500).json({ msg: "Internal Server Error", status: false });
    }
};

module.exports.addMessage = async (req, res, next) => {
    try {
        const { from, to, message, media, mediaType } = req.body;
        const data = await messageModel.create({
            message: { text: message, media: media, mediaType: mediaType },
            users: [from, to],
            sender: from,
            read: false 
        });

        if (data) {
            return res.json({ msg: "Message added successfully" });
        }
        return res.status(400).json({ msg: "Failed to add message to the database" });

    } catch (error) {
        return res.status(500).json({ msg: "Internal Server Error", status: false });
    }
};

module.exports.deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await messageModel.findByIdAndDelete(id);

        if (!message) {
            return res.status(404).json({ msg: 'Message not found' });
        }

        return res.status(200).json({ msg: 'Message deleted successfully' });
    } catch (error) {
        return res.status(500).json({ msg: 'Internal server error' });
    }
};

module.exports.markMessagesAsRead = async (req, res) => {
    try {
      const { from, to } = req.body;
      await messageModel.updateMany(
        {
          users: { $all: [from, to] },
          sender: to, 
          read: false, 
        },
        { $set: { read: true } }
      );
  
      return res.status(200).json({ msg: "Messages marked as read" });
    } catch (error) {
      return res.status(500).json({ msg: "Internal Server Error", status: false });
    }
  };
  
  module.exports.getUnreadMessages = async (req, res, next) => {
    try {
        const { userId } = req.body;

        const messages = await messageModel.aggregate([
            { $match: { users: userId, sender: { $ne: userId }, read: false } },
            { $group: { _id: "$sender", unreadCount: { $sum: 1 } } }
        ]);

        const unreadMessages = {};
        messages.forEach(message => {
            unreadMessages[message._id] = message.unreadCount > 0;
        });

        return res.status(200).json({ unreadMessages });
    } catch (error) {
        return res.status(500).json({ msg: "Internal Server Error", status: false });
    }
};
