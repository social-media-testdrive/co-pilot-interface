// ----- BELOW IS UNUSED FOR THIS PROJECT.
// const Script = require('../models/Script.js');
// const _ = require('lodash');

// /**
//  * Post a comment to Script collection.
//  */
// exports.postComment = async(req, res, next) => {
//     try {
//         const script = await Script.findOne({ sessionID: req.body.sessionID }).exec();
//         // There is no corresponding object for this session ID, so create one
//         if (!script) {
//             script = new Script({
//                 sessionID: req.body.sessionID,
//                 action: [],
//                 gpt3_outputs: []
//             });
//         }

//         let userAction = script.action;

//         // Find the object for this post
//         let feedIndex = _.findIndex(userAction, function(o) {
//             return o.post_id === req.body.postID;
//         });

//         // There is no corresponding object for this post, so create one 
//         if (feedIndex == -1) {
//             let cat = {};
//             cat.post_id = req.body.postID;
//             cat.comments = [];
//             feedIndex = userAction.push(cat) - 1;
//         }

//         // Create a new Comment
//         let comment = {};
//         comment.actor = req.body.actor;
//         comment.body = req.body.body;
//         comment.time = Date.now();

//         userAction[feedIndex].comments.push(comment);

//         await script.save();
//     } catch (err) {
//         console.log(err);
//         next(err);
//     }
// };