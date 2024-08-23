const { addMessage, getAllMessage, deleteMessage, markMessagesAsRead, getUnreadMessages } = require("../controller/messageController");

const router = require("express").Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getAllMessage);
router.delete('/delete/:id', deleteMessage);
router.post('/unread-messages', getUnreadMessages); 
router.post('/mark-as-read', markMessagesAsRead);

module.exports = router