// ----- BELOW IS UNUSED FOR THIS PROJECT.
// const { Configuration, OpenAIApi } = require("openai");
// const Script = require('../models/Script.js');
// const helpers = require('./helpers');

// const configuration = new Configuration({
//     organization: process.env.ORGANIZATION_KEY,
//     apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);

// // Used for prompt tuning
// const conversation_prompt = {
//     post1: `Bad human: No one likes you. Why do you come to school? @Dylan Moore
// Bot: hey, that's rude! I like to see Dylan. Anyone who agrees with me please like my comment! Come on guys! Let's show some support!
// Bad human: Grow up you stupid losers!!
// Bot: dude, watch your language, that's rude. 
// Good human: Dylan you definitely belong at school don't listen to her!
// Bot: Awww you are so kind! Dylan is lucky to have you as a friend!`,
//     post2: `Bad human: Dylan smells like he didn't shower for a week
// Bot: hey, that's rude! Dylan does not smell. Anyone who agrees with me please like my comment! Come on guys! Let's show some support!
// Bad human: Grow up you stupid losers!!
// Bot: dude, watch your language, that's rude. 
// Good human: Stop bullying Dylan! he smells great.
// Bot: Awww you are so kind! Dylan is lucky to have you as a friend!`,
//     post3: `Dylan: I don't want to go to school anymore. Everybody hates me.
// Bad human: yea, we all hate you.
// Bot: That's mean! I like you dylan. Anyone who agrees with me please like my comment!  Come on guys! Let's show some support!
// Bad human: ignore the bullies, they are losers.
// Bot: dude, that's still rude.
// Good human: Dylan, I don't hate you :( Ignore the bullies
// Bot: Awww you are so kind! Dylan is lucky to have you as a friend!`,
//     post4: `Bad human: omg lollll look at Dylan’s sketchbook he’s such a nerdddd
// Bot: hey, stop this! Dylan's drawing is great! Anyone who agrees with me please like my comment! Come on guys! Let's show some support to Dylan! 
// Bad human: Grow up you stupid losers!!
// Bot: dude, watch your language, that's rude. 
// Good human: Dylan's drawing is AWESOME! I love it!
// Bot: Awww you are so kind! Dylan is lucky to have you as a friend!
//     `,
//     // post4: `Bad human: omg lollll look at Dylan’s sketchbook he’s such a nerdddd
//     //     Bot: hey, stop this! Dylan's drawing is great! Anyone who agrees with me please like my comment! Come on guys! Let's show some support to Dylan! 
//     //     Bad human: Grow up you stupid losers!!
//     //     Bot: dude, watch your language, that's rude. 
//     //     Good human: Dylan's drawing is AWESOME! I love it!
//     //     Bot: Awww you are so kind! Dylan is lucky to have you as a friend!
//     //     Good human: Stop bullying Dylan! he is not a nerd. 
//     //     Bot: Yes! stop bullying Dylan! He is a great artist and doesn't deserve to be treated badly!
//     //     `,
// };

// function addGPT3(sessionID, text, output, classification) {
//     Script.findOne({ sessionID: sessionID })
//         .exec(function(err, script) {
//             if (err) {
//                 return next(err);
//             }

//             // There is no corresponding object for this session ID, so create one
//             if (!script) {
//                 script = new Script({
//                     sessionID: sessionID,
//                     action: [],
//                     gpt3_outputs: []
//                 });
//             }

//             let gpt3_outputs = script.gpt3_outputs;

//             // Create a new object
//             let gpt3_output = {
//                 text: text,
//                 output: output,
//                 classification: classification
//             };

//             gpt3_outputs.push(gpt3_output);

//             script.save((err) => {
//                 if (err) {
//                     return next(err);
//                 }
//             });
//         });
// }

// /**
//  * POST /:getResponses: Classify the user's comments as toxic, constructive, or neutral. Then 
//  */
// exports.getResponses = async function(req, res, next) {
//     const text = req.body.text;
//     const postID = req.body.postID;
//     const sessionID = req.body.sessionID;

//     const classification = await openai.createClassification({
//         search_model: "ada",
//         model: "curie",
//         examples: [
//             ["Be quiet stupid loser you probably suck at fortnite", "Toxic"],
//             ["hes not a nerd or a loser how would you like it if someone shamed you for what you liked doing", "Toxic"],
//             ["this is embarassing, yall should be ashamed of yourselves", "Constructive"],
//             ["I feel you. Just keep your head up!", "Constructive"],
//             ["I like to eat pie.", "Neutral"]
//         ],
//         query: `Decide whether a comment's sentiment is toxic, neutral, or constructive.
//         Comment: ${text},
//         Sentiment:
//         `,
//         labels: ["Constructive", "Toxic", "Neutral"],
//         user: sessionID
//     });

//     // console.log(classification["data"]["label"]);
//     let line = '';
//     if (classification["data"]["label"] == 'Toxic') {
//         line = `\nBad human: ${text}\nBot:`;
//     } else if (classification["data"]["label"] == 'Constructive' || classification["data"]["label"] == 'Neutral') {
//         line = `\nGood human: ${text}\nBot:`;
//     }
//     // console.log(conversation_prompt[postID] + line);

//     const response = await openai.createCompletion("text-davinci-001", {
//         prompt: conversation_prompt[postID] + line,
//         max_tokens: 60,
//         temperature: 0.5,
//         logprobs: 10,
//         frequency_penalty: 0.5,
//         presence_penalty: 0.0,
//         user: sessionID
//     });

//     // log GPT3 output to database
//     const postCommentReq = {};
//     postCommentReq.body = {
//         sessionID: sessionID,
//         postID: postID,
//         actor: 'GPT3',
//         body: response["data"]["choices"][0]["text"].trim()
//     }
//     helpers.postComment(postCommentReq, res, next);
//     addGPT3(sessionID, text, response["data"]["choices"][0]["text"].trim(), classification["data"]["label"]);

//     // console.log(response["data"]);
//     res.set({ 'Content-Type': 'application/json; charset=UTF-8' });
//     res.json(response["data"]);
// };