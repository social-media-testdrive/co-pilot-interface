var socket = io();
// ----- BELOW IS UNUSED FOR THIS PROJECT.
// const postDictionary = {
//     post1: "Ella Sroni's",
//     post2: "Breana Summers's",
//     post3: "Dylan Moore's",
//     post4: "Keegan Scott's"
// };
// let notification_timeout;
// let typing_timeout;

let sessionID = window.location.pathname.split("/")[1];

// Socket listening to broadcasts
// ----- BELOW IS UNUSED FOR THIS PROJECT.
// socket.on("post comment", function(msg) {
//     if (msg["sessionID"] !== window.location.pathname.split('/')[1]) {
//         return;
//     }
//     const card = $(".ui.card[postID =" + msg["postID"] + "]");
//     let comments = card.find(".ui.comments");
//     // no comments area - add it
//     if (!comments.length) {
//         const buttons = card.find(".three.ui.bottom.attached.icon.buttons");
//         buttons.after('<div class="content"><div class="ui comments"></div>');
//         comments = card.find(".ui.comments");
//     }
//     if (msg["text"].trim() !== "") {
//         // Clear any animations 
//         if (comments.find(".typing.comment").length !== 0) {
//             $(comments.find(".typing.comment")).slideUp(400, function() { $(this).remove(); });
//         }
//         clearTimeout(typing_timeout);

//         const src = msg["agent"] === "Guest" ? "/profile_pictures/avatar-icon.svg" : actors[msg["agent"]];
//         const name = msg["agent"];
//         const mess =
//             `<div class="comment">
//                 <a class="avatar"> <img src=${src}> </a>
//                 <div class="content">
//                 <a class="author">${name}</a>
//                 <div class="metadata">
//                     <span class="date"><1 minute ago</span>
//                     <i class="heart icon"></i> 0 Likes
//                     ${!msg["agent"] && $("input[name='agentCheckbox']").is(":checked") && msg["isProfane"] ? "<div class='ui red label'>PROFANE</div>" :""}
//                 </div>
//                 <div class="text">${msg["text"]}</div>
//                 </div>
//             </div>`;
//         comments.append(mess);

//         // Display a notification:
//         // hide the mobile view popups if not in mobile view anymore
//         if ($(window).width() < 1086) {
//             $("#removeHiddenMobile").hide();
//         } else {
//             $("#removeHidden").hide();
//         }
//         const imageHref = src;
//         const text = msg["agent"] + " commented on " + postDictionary[msg["postID"]] + ' post: "' + msg["text"] + '".';
//         $(".popupNotificationImage").attr("src", imageHref);
//         $(".notificationPopup").attr("correspondingpost", msg["postID"]);
//         $(".ui.fixed.bottom.sticky.notificationPopup .summary").text(text);

//         //if in a mobile view, put popup in the middle
//         if ($(window).width() < 1086) {
//             $("#removeHiddenMobile").removeClass("hidden").show();
//             $("#mobilePopup").transition("pulse");
//         } else {
//             //else put popup on the side
//             $("#removeHidden").removeClass("hidden").show();
//             $("#desktopPopup").transition("pulse");
//         }

//         clearTimeout(notification_timeout);
//         notification_timeout = setTimeout(function() {
//             if ($("#removeHidden").is(':visible')) {
//                 $("#removeHidden").transition("fade");
//             } else if ($("#removeHiddenMobile").is(':visible')) {
//                 $("#removeHiddenMobile").transition("fade");
//             }
//         }, 5000);

//         // If is ai bot, and the message was from a user-- scroll to the new comment 
//         if (msg["agent"] === "Guest" && $("input[name='isAgentCheckbox']").is(":checked")) {
//             $(".ui.card[postID =" + msg["postID"] + "]").find('textarea.newcomment')[0].scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });

//             const enableGPT3 = $('meta[name="enableGPT3"]').attr('content') === "true";
//             if (enableGPT3) {
//                 // Get GPT-3 Response
//                 $.post("/gpt3", {
//                     sessionID: window.location.pathname.split('/')[1],
//                     postID: card.attr("postID"),
//                     text: msg["text"]
//                 }).then(function(data) {
//                     const comment_area = card.find("textarea.newcomment")
//                     comment_area.val(data["choices"][0]["text"].trim());
//                     comment_area.focus();
//                 });
//             }
//         }
//     }
// });

function addHumanizedTimeToPost() {
    const target = $(this);
    const ms = parseInt(target.text(), 10);
    const time = new Date(ms);
    target.text(humanized_time_span(time));
}

// Liking and unliking post
function likePost(e) {
    const target = $(e.target).closest('.ui.like.button');
    const label = target.closest('.ui.like.button').next("a.ui.basic.red.left.pointing.label.count");
    const post = target.closest(".ui.fluid.card").attr("post");
    const post_id = target.closest(".ui.fluid.card").attr("post_id");
    const currDate = Date.now();

    // Determine if the comment is being LIKED or UNLIKED based on the initial button color. Red = UNLIKE, Not Red = LIKE.
    if (target.hasClass("red")) { // Unlike Post
        target.removeClass("red");
        console.log("test2")
        label.html(function(i, val) { return val * 1 - 1 });
        $.post("/feed", {
            sessionID: sessionID,
            post: post,
            post_id: post_id,
            unlike: currDate,
        });
    } else { // Like post 
        target.addClass("red");
        label.html(function(i, val) { return val * 1 + 1 });
        $.post("/feed", {
            sessionID: sessionID,
            post: post,
            post_id: post_id,
            like: currDate,
        });
    }
};

// Flagging post
function flagPost(e) {
    const target = $(e.target);
    const postElement = target.closest(".ui.fluid.card");
    const post = postElement.attr("post");
    const post_id = postElement.attr("post_id");

    const currDate = Date.now();
    $.post("/feed", {
        sessionID: sessionID,
        post: post,
        post_id: post_id,
        flag: currDate,
    });
    target.closest(".ui.fluid.card").find(".ui.dimmer.flag").dimmer({ closable: false }).dimmer('show');
}

// Unflagging post
function unflagPost(e) {
    const target = $(e.target);
    const postElement = target.closest(".ui.fluid.card");
    const post = postElement.attr("post");
    const post_id = postElement.attr("post_id");

    const currDate = Date.now();
    $.post("/feed", {
        sessionID: sessionID,
        post: post,
        post_id: post_id,
        unflag: currDate,
    });
    target.closest(".ui.fluid.card").find(".ui.dimmer.flag").removeClass("active").dimmer({ closable: true }).dimmer('hide');
}

// Adding a new comment to post
function addNewComment(event) {
    let target = $(event.target);
    const card = target.parents(".ui.fluid.card");
    const post = card.attr("post");
    const post_id = card.attr("post_id");
    const text = card.find("textarea.newcomment").val();
    let comments = card.find(".ui.comments");
    // Comments area doesn't exist yet, so add it
    if (!comments.length) {
        const buttons = card.find(".ui.bottom.attached.icon.buttons");
        buttons.after('<div class="content"><div class="ui comments"></div>');
        comments = card.find(".ui.comments");
    }
    if (text.trim() !== "") {
        const currDate = Date.now();

        $.post("/feed", {
            sessionID: sessionID,
            post: post,
            post_id: post_id,
            comment_text: text,
            new_comment: currDate
        }).then(function(json) {
            const name = "Guest";
            const src = "/profile_pictures/avatar-icon.svg";
            const mess =
                `<div class="comment user" comment_id=${json.comment_id} comment=${json.comment}>
                    <a class="avatar image"> 
                        <img class="ui avatar image small" src=${src}> 
                    </a>
                    <div class="content">
                        <a class="author">${name}</a>
                        <div class="metadata">
                            <span class="date"><1 minute ago</span>
                            <div class="rating">
                                <i class="heart icon"></i> 
                                <span class="num"> 0 </span> Likes
                            </div>
                        </div>
                        <div class="text">${text}</div>
                        <div class="actions">
                            <a class="like comment" onClick="likeComment(event)"> Like </a>
                        </div>
                    </div>
                </div>`;

            card.find("textarea.newcomment").val("");
            comments.append(mess);
        });

        // ----- BELOW IS UNUSED FOR THIS PROJECT.
        //     // const isAgent = $('#isAgentCheckbox input').is(":checked");
        //     // const agentType = $('#agentTypeDropdown').dropdown('get value');

        //     // const src = !isAgent ? "/profile_pictures/avatar-icon.svg" : actors[agentType];
        //     // const name = !isAgent ? "Guest" : agentType;

        //     const mess =
        //         `<div class="comment">
        //             <a class="avatar"> 
        //                 <img src=${src}> 
        //             </a>
        //             <div class="content">
        //                 <a class="author">${name}</a>
        //                 <div class="metadata">
        //                     <span class="date"><1 minute ago</span>
        //                     <i class="heart icon"></i> 0 Likes
        //                 </div>
        //                 <div class="text">${text}</div>
        //             </div>
        //         </div>`;

        //     card.find("textarea.newcomment").val("");
        //     if (comments.find(".typing.comment").length !== 0) {
        //         $(mess).insertBefore(".typing.comment");
        //     } else {
        //         comments.append(mess);
        //         // Add Typing Animation 3 seconds after the Guest leaves a comment.
        //         if (name === "Guest") {
        //             setTimeout(function() {
        //                 const typing_mess =
        //                     `<div class="typing comment" style="display: none;>     
        //                     <div class="content">
        //                         <img src="/typing.gif" style="width:40px;height:auto; margin-left: 45px;">
        //                         <p style="margin-left: 45px; color: #5d5d5d"> Someone is commenting... </p>
        //                     </div>
        //                 </div>`;
        //                 comments.append(typing_mess);
        //                 $(comments.find(".typing.comment")).show('400');
        //             }, 2000);
        //         }
        //     }

        //     // If after 60 seconds, and the animation is still there, remove it.
        //     clearTimeout(typing_timeout);
        //     typing_timeout = setTimeout(function() {
        //         if (comments.find(".typing.comment").length !== 0) {
        //             $(comments.find(".typing.comment")).slideUp(400, function() { $(this).remove(); });
        //         }
        //     }, 60000);

        //     socket.emit("post comment", {
        //         text: text,
        //         postID: card.attr("postID"),
        //         sessionID: window.location.pathname.split('/')[1],
        //         agent: name // indicates if comment was made as the convo AI agent (used to be a Boolean)
        //     });

        //     $.post("/feed", {
        //         sessionID: window.location.pathname.split('/')[1],
        //         postID: card.attr("postID"),
        //         actor: name,
        //         body: text
        //     });
    }
}

// Liking and unliking a comment
function likeComment(e) {
    const target = $(e.target);
    const commentElement = target.parents('.comment');
    const label = commentElement.find('span.num');

    const post = target.closest(".ui.fluid.card").attr("post");
    const post_id = target.closest(".ui.fluid.card").attr("post_id");
    const comment = commentElement.attr('comment');
    const comment_id = commentElement.attr('comment_id');
    const currDate = Date.now();

    // Determine if the comment is being LIKED or UNLIKED based on the initial
    // button color. Red = UNLIKE, Not Red = LIKE.
    if (target.hasClass('red')) {
        target.removeClass('red');
        commentElement.find('i.heart.icon').removeClass('red');
        target.html('Like');
        // Decrease the like count by 1
        label.html(function(i, val) { return val * 1 - 1 });
        $.post("/feed", {
            sessionID: sessionID,
            post: post,
            post_id: post_id,
            comment: comment,
            comment_id: comment_id,
            unlike: currDate,
        });
    } else {
        target.addClass('red');
        commentElement.find('i.heart.icon').addClass('red');
        target.html('Unlike');
        // Increase the like count by 1
        label.html(function(i, val) { return val * 1 + 1 });
        $.post("/feed", {
            sessionID: sessionID,
            post: post,
            post_id: post_id,
            comment: comment,
            comment_id: comment_id,
            like: currDate,
        });
    }
}

// Flagging a comment
function flagComment(e) {
    const target = $(e.target);
    const commentElement = target.parents(".comment");
    const post = commentElement.closest(".ui.fluid.card").attr("post");
    const post_id = commentElement.closest(".ui.fluid.card").attr("post_id");
    const comment = commentElement.attr("comment");
    const comment_id = commentElement.attr("comment_id");

    const comment_imageElement = commentElement.children('.image');
    const comment_contentElement = commentElement.children('.content');
    const flaggedComment_contentElement = commentElement.children('.content.hidden');

    comment_imageElement.transition('hide');
    comment_contentElement.transition('hide');
    $(flaggedComment_contentElement).transition();
    const currDate = Date.now();

    $.post("/feed", {
        sessionID: sessionID,
        post: post,
        post_id: post_id,
        comment: comment,
        comment_id: comment_id,
        flag: currDate
    });
}

// Unflagging a comment
function unflagComment(e) {
    const target = $(e.target);
    const commentElement = target.parents(".comment");
    const post = commentElement.closest(".ui.fluid.card").attr("post");
    const post_id = commentElement.closest(".ui.fluid.card").attr("post_id");
    const comment = commentElement.attr("comment");
    const comment_id = commentElement.attr("comment_id");

    const comment_imageElement = commentElement.children('.image.hidden');
    const comment_contentElement = commentElement.children('.content.hidden');
    const flaggedComment_contentElement = commentElement.children('.content:not(.hidden)');

    $(flaggedComment_contentElement).transition('hide');
    comment_imageElement.transition();
    comment_contentElement.transition();
    const currDate = Date.now();

    $.post("/feed", {
        sessionID: sessionID,
        post: post,
        post_id: post_id,
        comment: comment,
        comment_id: comment_id,
        unflag: currDate
    });
}

$(window).on("load", () => {
    // add humanized time to all posts
    $('.right.floated.time.meta, .date, .time.notificationTime').each(addHumanizedTimeToPost);

    // Focuses cursor to new comment input field, if the "Reply" button is clicked
    $(".reply.button").click(function() {
        const parent = $(this).closest(".ui.fluid.card");
        parent.find("textarea.newcomment").focus();
    });

    // Press enter to submit a comment
    window.addEventListener("keydown", function(event) {
        if (!event.ctrlKey && event.key === "Enter" && event.target.className == "newcomment") {
            event.preventDefault();
            event.stopImmediatePropagation();
            addNewComment(event);
        }
    }, true);

    // like a post
    $(".like.button").click(likePost);

    // flag a post
    $(".flag.button").click(flagPost);

    // unflag a post
    $(".unflag.button").click(unflagPost);

    // create a new Comment
    $("i.big.send.link.icon").click(addNewComment);

    // like a comment
    $("a.like.comment").click(likeComment);

    // flag a comment
    $("a.flag.comment").click(flagComment);

    // unflag a comment
    $("a.unflag").click(unflagComment);

    // closes notification by clicking "x"
    $(".message .close").on("click", function() {
        $(this).closest(".message").transition("fade");
    });

    // scroll to appropriate post when notification popup is clicked
    $('.notificationPopup').on('click', function(event) {
        if ($(event.target).hasClass('close')) {
            return false;
        }

        var relevantPostNumber = $(this).attr('correspondingPost');
        $(".ui.card[postID =" + relevantPostNumber + "]").find('textarea.newcomment')[0].scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
    });
})