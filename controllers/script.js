const Script = require('../models/Script.js');
const helpers = require('./helpers');

/**
 * POST /feed: Post a comment to Script collection.
 */
exports.postComment = (req, res, next) => {
    helpers.postComment(req, res, next);
};

/**
 * GET /:sessionID: Get the comments logged for the sessionID
 */
exports.getScript = (req, res, next) => {
    Script.findOne({ sessionID: req.params.sessionID })
        .exec(function(err, script) {
            if (err) {
                return next(err);
            }

            let final_script = {};
            if (script) {
                for (const post of script["action"]) {
                    filtered_comments = post["comments"].filter(comment => comment.actor !== "GPT3");
                    final_script[post["post_id"]] = filtered_comments;
                }
            }

            // console.log(final_script);
            res.render('index', {
                script: final_script
            });
        });
};