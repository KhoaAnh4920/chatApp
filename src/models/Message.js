const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    conversationId: {
        type: String,
    },
    senderId: {
        type: String,
    },
    text: {
        type: String,
    },
}, { timestamps: true, collection: "messages" });


MessageSchema.statics.createNewMessage = async function(data) {
    try {
        console.log('data: ', data);
        const message = await this.create({ conversationId: data.conversationId, senderId: data.senderId, text: data.text })
        return message
    } catch (error) {
        throw error;
    }
}



module.exports = mongoose.model("Message", MessageSchema);