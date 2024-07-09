const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new mongoose.Schema({
    sessionID: { type: String, default: '', trim: true, unique: true },

    numComments: { type: Number, default: -1 }, // Indicates the number of comments the user has created. Count starts at -1

    // interactions with posts
    feedAction: [new Schema({
        post: { type: Schema.ObjectId, ref: 'Script' }, // Indicates which post the user interacted with. ObjectId references object in Scripts or object in user.posts.
        post_id: String, // '1', '2', '3' etc.
        liked: { type: Boolean, default: false }, // Indicates if the user liked the post.
        flagged: { type: Boolean, default: false }, // Indicates if the user flagged the post. 
        shared: { type: Boolean, default: false }, // Indicates if the user shared the post. 

        comments: [new Schema({
            comment: { type: Schema.ObjectId },
            comment_id: String, // '1', '2', '3' etc.

            new_comment: { type: Boolean, default: false }, // Indicates if the comment is a user comment.
            new_comment_id: String, // ID of user comment. Starts with 0.
            // actor: String, // "Guest"
            body: { type: String, default: '', trim: true }, // Body of the comment
            absTime: Date, // The absolute date (time) of when the user made the comment.

            liked: { type: Boolean, default: false }, // Indicates if the user liked the comment.
            flagged: { type: Boolean, default: false }, // Indicates if the user liked the comment. 
        }, { _id: true, versionKey: false })],
    }, { _id: false, versionKey: false })],
    // interactions with chats
    chatAction: [new Schema({
        chat_id: String, // chat id's are defined by who it is in correspondance with: aka actors' usernames
        messages: [new Schema({
            body: { type: String, default: '', trim: true }, // Body of the chat message
            absTime: String, // The absolute date (time) of when the chat message was made
            name: String, // Indicates who made the chat message
            isAgent: { type: Boolean, default: false }, // Indicates if the user made the chat message
        }, { _id: true, versionKey: false })],
    }, { _id: false, versionKey: false })],

}, { timestamps: true });

const Session = mongoose.model('Session', sessionSchema);
module.exports = Session;