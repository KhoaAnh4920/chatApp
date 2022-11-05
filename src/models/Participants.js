const mongoose = require("mongoose");

const ParticipantsSchema = new mongoose.Schema({
    conversationId: {
        type: String,
    },
    memberId: {
        type: [String],
        required: true
    },
}, { timestamps: true, collection: "participants" });

module.exports = mongoose.model("Participants", ParticipantsSchema);