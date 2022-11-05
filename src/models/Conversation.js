const mongoose = require("mongoose");
import { v4 as uuidv4 } from "uuid";
import ParticipantsModel from '../models/Participants';


const conversationSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => uuidv4().replace(/\-/g, ""),
    },
    title: {
        type: String,
        required: false,
        maxLength: 100,
        default: '',
    },
    creatorId: {
        type: String,
    },
    type: {
        type: String,
        required: false,
        maxLength: 15,
        default: 'PRIVATE',
    },
    isDelete: {
        type: Boolean,
        required: false,
        default: false,
    },


}, { timestamps: true, collection: "conversations" });



conversationSchema.statics.createNewConversation = async function(data) {
    try {
        console.log('data: ', data);
        await this.create({ title: data.title, creatorId: data.creatorId, type: data.type }).then(function(x) {

            const newParticipants = new ParticipantsModel({
                conversationId: x._id,
                memberId: data.memberId,
            });

            newParticipants.save();
        })


        return data
    } catch (error) {
        throw error;
    }
}


conversationSchema.statics.getConversationById = async function(convId) {
    try {
        const conversation = await this.aggregate([
            { $match: { _id: convId } },
            {
                $lookup: {
                    from: "participants", // collection name in db
                    localField: "_id",
                    foreignField: "conversationId",
                    as: "conversationPaticipants"
                }
            },
            // { $unwind: "$conversationPaticipants" },

        ]);
        return conversation
    } catch (error) {
        throw error;
    }
}

conversationSchema.statics.getConversationByUser = async function(userId) {
    try {
        const conversation = await this.aggregate([

            {
                $lookup: {
                    from: "participants", // collection name in db
                    localField: "_id",
                    foreignField: "conversationId",
                    as: "conversationPaticipants",
                    pipeline: [
                        { $match: { memberId: { $in: [userId] } } },
                    ]
                }
            },
            { $unwind: "$conversationPaticipants" },

        ]);

        // const conversation = await ParticipantsModel.find({
        //     memberId: { $in: [userId] },
        // });
        return conversation
    } catch (error) {
        throw error;
    }
}


conversationSchema.statics.getPrivateConversation = async function(firstUserId, secondUserId) {
    try {
        const conversation = await ParticipantsModel.findOne({
            memberId: { $all: [firstUserId, secondUserId] },
        });

        console.log("conversation: ", conversation)
        return conversation
    } catch (error) {
        throw error;
    }
}


conversationSchema.statics.addMemberConversation = async function(memberId_arr, conversationId) {
    try {
        console.log("conversationId: ", conversationId)
        const conversation = await ParticipantsModel.findOne({
            conversationId: conversationId,
        });


        let newTest = conversation.memberId
        const arrayMembers = newTest.concat(memberId_arr);

        conversation.memberId = arrayMembers
        conversation.save();

        console.log("arrayMembers: ", arrayMembers)
        return conversation
    } catch (error) {
        throw error;
    }
}

export default mongoose.model("Conversation", conversationSchema);