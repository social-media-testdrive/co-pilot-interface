const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scriptSchema = new mongoose.Schema({
    body: { type: String, default: '', trim: true }, // Body (caption text) of the post.
    post_id: Number, // Post ID used in the CSV input file.
    picture: String, // File name of the image for this post.
    likes: Number, // Number of likes this post has.
    actor: { type: Schema.ObjectId, ref: 'Actor' }, // Actor who created post.

    time: Number, // Relative time of the post, in milliseconds.

    // comments for this post (is an array)
    comments: [new Schema({
        actor: { type: Schema.ObjectId, ref: 'Actor' }, // Actor who created comment.
        body: { type: String, default: '', trim: true }, // Body (text) of the comment
        comment_id: Number, // Comment ID used in the CSV input file.
        time: Number, // Relative time of the comment, in milliseconds.
        likes: Number, // Number of likes this comment has.

        new_comment: { type: Boolean, default: false },
        liked: Boolean,
    }, { versionKey: false })], //versioning messes up our updates to the DB sometimes, so we kill it here
}, { versionKey: false });

const Script = mongoose.model('Script', scriptSchema);
module.exports = Script;