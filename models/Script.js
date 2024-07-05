const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scriptSchema = new mongoose.Schema({
    sessionID: { type: String, default: '', trim: true },
    //comments made in session, across all posts (is an array)
    action: [new Schema({
        post_id: String, // 'post1', 'post2', 'post3' etc. 
        comments: [new Schema({
            actor: String, // "Guest", "Conversational AI Agent", or "GPT3"; Who made the comment?
            body: { type: String, default: '', trim: true }, // Body of the comment
            time: Date, // The absolute date the comment was made
        }, { _id: false, versionKey: false })],
    }, { _id: false, versionKey: false })],
    gpt3_outputs: [new Schema({
        text: { type: String, default: '', trim: true },
        output: { type: String, default: '', trim: true },
        classification: { type: String, default: '', trim: true }
    }, { _id: false, versionKey: false })]
}, { versionKey: false });

const Script = mongoose.model('Script', scriptSchema);

module.exports = Script;