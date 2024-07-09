const Script = require('../models/Script.js');
const Session = require('../models/Session.js');
const Actor = require('../models/Actor.js');
const helpers = require('./helpers');
const _ = require('lodash');

/**
 * GET /:sessionID
 * Returns feed of posts, with the user's actions on the posts accounted for.
 */
exports.getScript = async(req, res, next) => {
    try {
        let session = await Session.findOne({ sessionID: req.params.sessionID }).exec();

        if (!session) {
            session = new Session({
                sessionID: req.params.sessionID,
            });
            await session.save();
        }

        //Get the newsfeed
        let script_feed = await Script.find()
            .sort('-time')
            .populate('actor')
            .populate('comments.actor')
            .exec();

        // Final array of all posts to go in the feed
        let finalfeed = [];

        // While there are regular posts to add to the final feed
        while (script_feed.length) {
            //Looking at the post in script_feed[0] now.
            //For this post, check if there is a user feedAction matching this post's ID and get its index.
            const feedIndex = _.findIndex(session.feedAction, function(o) { return o.post.equals(script_feed[0]._id) });
            if (feedIndex != -1) {
                //User performed an action with this post
                //Check to see if there are comment-type actions.
                if (Array.isArray(session.feedAction[feedIndex].comments) && session.feedAction[feedIndex].comments) {
                    //There are comment-type actions on this post.
                    //For each comment on this post, add likes, flags, etc.
                    for (const commentObject of session.feedAction[feedIndex].comments) {
                        if (commentObject.new_comment) {
                            // This is a new, user-made comment. Add it to the comments
                            // list for this post.
                            const cat = {
                                _id: commentObject.id,
                                comment_id: commentObject.new_comment_id,
                                body: commentObject.body,
                                time: commentObject.absTime,
                                liked: commentObject.liked,
                                likes: commentObject.liked ? 1 : 0,

                                new_comment: commentObject.new_comment
                            };
                            script_feed[0].comments.push(cat);
                        } else {
                            // This is not a new, user-created comment.
                            // Get the comment index that corresponds to the correct comment
                            const commentIndex = _.findIndex(script_feed[0].comments, function(o) { return o.id == commentObject.comment; });
                            // If this comment's ID is found in script_feed, add likes, flags, etc.
                            if (commentIndex != -1) {
                                // Check if there is a like recorded for this comment.
                                if (commentObject.liked) {
                                    // Update the comment in script_feed.
                                    script_feed[0].comments[commentIndex].liked = true;
                                    script_feed[0].comments[commentIndex].likes++;
                                }
                                // Check if there is a flag recorded for this comment.
                                if (commentObject.flagged) {
                                    script_feed[0].comments[commentIndex].flagged = true;
                                }
                            }
                        }
                    }
                }
                script_feed[0].comments.sort(function(a, b) {
                    return a.time - b.time;
                });
                // No longer looking at comments on this post.
                // Now we are looking at the main post.
                // Check if there is a like recorded for this post.
                if (session.feedAction[feedIndex].liked) {
                    script_feed[0].liked = true;
                    script_feed[0].likes++;
                }
                // Check if post has been flagged: remove it from feed array (script_feed)
                if (session.feedAction[feedIndex].flagged) {
                    script_feed[0].flagged = true;
                }
                // Push post to finalfeed and remove it from script_feed.
                finalfeed.push(script_feed[0]);
                script_feed.splice(0, 1);
            } // User did not interact with this post
            else {
                finalfeed.push(script_feed[0]);
                script_feed.splice(0, 1);
            }
        }

        res.render('index', {
            script: finalfeed,
            numComments: session.numComments,
            title: 'Feed'
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

/**
 * GET /chat
 * Returns list of messages of chat with chat_id value
 */
exports.getChat = async(req, res, next) => {
    try {
        let session = await Session.findOne({ sessionID: req.query.sessionID }).exec();

        const feedIndex = _.findIndex(session.chatAction, function(o) { return o.chat_id == req.query.chat_id });
        const messages = session.chatAction[feedIndex].messages;

        res.send(messages);
    } catch (err) {
        console.log(err);
        next(err);
    }
};

/**
 * POST /feed
 * Add user's actions on posts.
 * All likes, flags, new comments (with actions on those comments as well) are recorded in the database.
 */
exports.postfeedAction = async(req, res, next) => {
    try {
        let session = await Session.findOne({ sessionID: req.body.sessionID }).exec();
        let userAction = session.feedAction;

        // Then find the object from the right post in feed.
        let feedIndex = _.findIndex(userAction, function(o) { return o.post == req.body.post; });
        if (feedIndex == -1) {
            const cat = {
                post: req.body.post,
                post_id: req.body.post_id
            };
            // add new post into correct location
            feedIndex = userAction.push(cat) - 1;
        }

        let commentIndex;
        // Create a new comment
        if (req.body.new_comment) {
            session.numComments = session.numComments + 1;
            const cat = {
                new_comment: true,
                new_comment_id: session.numComments,
                body: req.body.comment_text,
                absTime: req.body.new_comment,
            }
            commentIndex = userAction[feedIndex].comments.push(cat) - 1;
            userAction[feedIndex].comments[commentIndex].comment = userAction[feedIndex].comments[commentIndex].id;
        }
        // Are we doing anything with an existing comment?
        else if (req.body.comment) {
            console.log(req.body.comment)
            commentIndex = _.findIndex(userAction[feedIndex].comments, function(o) {
                return o.comment == req.body.comment;
            });

            // no comment in this post-actions yet
            if (commentIndex == -1) {
                const cat = {
                    comment: req.body.comment,
                    comment_id: req.body.comment_id
                };
                commentIndex = userAction[feedIndex].comments.push(cat) - 1;
            }

            // Like comment
            if (req.body.like) {
                userAction[feedIndex].comments[commentIndex].liked = true;
            }

            // Unlike comment
            if (req.body.unlike) {
                userAction[feedIndex].comments[commentIndex].liked = false;
            }

            // Flag comment
            else if (req.body.flag) {
                userAction[feedIndex].comments[commentIndex].flagged = true;
            }

            // Unflag comment
            else if (req.body.unflag) {
                userAction[feedIndex].comments[commentIndex].flagged = false;
            }
        }
        // Not a comment-- Are we doing anything with the post?
        else {
            // Flag post
            if (req.body.flag) {
                userAction[feedIndex].flagged = true;
            }

            // Unflag post
            else if (req.body.unflag) {
                userAction[feedIndex].flagged = false;
            }

            // Share post
            else if (req.body.share) {
                userAction[feedIndex].shared = true;
            }

            // Like post
            else if (req.body.like) {
                userAction[feedIndex].liked = true;
            }

            // Unlike event
            else if (req.body.unlike) {
                userAction[feedIndex].liked = false;
            } else {
                console.log('Something in feedAction went crazy. You should never see this.');
            }
        }
        await session.save();
        let returningJson = { result: "success" };
        if (req.body.new_comment) {
            returningJson["comment_id"] = session.numComments;
            returningJson["comment"] = userAction[feedIndex].comments[commentIndex].id;
        }
        res.send(returningJson);
    } catch (err) {
        console.log(err);
        next(err);
    }
};

/**
 * POST /chat
 * Add actions with chats.
 */
exports.postchatAction = async(req, res, next) => {
    try {
        let session = await Session.findOne({ sessionID: req.body.sessionID }).exec();
        let userAction = session.chatAction;

        // Then find the object from the right chat in feed.
        let feedIndex = _.findIndex(userAction, function(o) { return o.chat_id == req.body.chat_id; });
        if (feedIndex == -1) {
            const cat = {
                chat_id: req.body.chat_id
            };
            // add new chat into correct location
            feedIndex = userAction.push(cat) - 1;
        }

        const cat = {
            body: req.body.body,
            absTime: req.body.absTime,
            name: req.body.name,
            isAgent: req.body.isAgent
        };
        userAction[feedIndex].messages.push(cat);

        await session.save();
        let returningJson = { result: "success" };
        res.send(returningJson);
    } catch (err) {
        console.log(err);
        next(err);
    }
};