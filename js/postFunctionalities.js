let sessionID = window.location.pathname.split("/")[2];

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
    const post_caption = target.closest(".ui.fluid.card").find(".description").text();
    const currDate = Date.now();

    const name = window.sessionStorage.getItem('isAgent') == 'false' ? "User" : window.sessionStorage.getItem('agentType');

    // Determine if the comment is being LIKED or UNLIKED based on the initial button color. Red = UNLIKE, Not Red = LIKE.
    if (target.hasClass("red")) { // Unlike Post
        target.removeClass("red");
        label.html(function(i, val) { return val * 1 - 1 });
        $.post("/feed", {
            sessionID: sessionID,
            post: post,
            post_id: post_id,
            unlike: currDate,
        });
        socket.emit("post activity", {
            sessionID: sessionID,
            description: "unliked post",
            caption: post_caption,
            name: name
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
        socket.emit("post activity", {
            sessionID: sessionID,
            description: "liked post",
            caption: post_caption,
            name: name
        });
    }
};

// Flagging post
function flagPost(e) {
    const target = $(e.target);
    const postElement = target.closest(".ui.fluid.card");
    const post = postElement.attr("post");
    const post_id = postElement.attr("post_id");
    const post_caption = postElement.find(".description").text();

    const name = window.sessionStorage.getItem('isAgent') == 'false' ? "User" : window.sessionStorage.getItem('agentType');

    const currDate = Date.now();
    $.post("/feed", {
        sessionID: sessionID,
        post: post,
        post_id: post_id,
        flag: currDate,
    });
    target.closest(".ui.fluid.card").find(".ui.dimmer.flag").dimmer({ closable: false }).dimmer('show');
    socket.emit("post activity", {
        sessionID: sessionID,
        description: "flagged post",
        caption: post_caption,
        name: name
    });
}

// Sharing post
function sharePost(e) {
    $('.ui.small.basic.share.modal').modal('show');
    const target = $(e.target);
    const postElement = target.closest(".ui.fluid.card");
    const post = postElement.attr("post");
    const post_id = postElement.attr("post_id");
    const post_caption = postElement.find(".description").text();

    const name = window.sessionStorage.getItem('isAgent') == 'false' ? "User" : window.sessionStorage.getItem('agentType');

    const currDate = Date.now();
    $.post("/feed", {
        sessionID: sessionID,
        post: post,
        post_id: post_id,
        share: currDate,
    });
    socket.emit("post activity", {
        sessionID: sessionID,
        description: "shared post",
        caption: post_caption,
        name: name
    });
}

// Unflagging post
function unflagPost(e) {
    const target = $(e.target);
    const postElement = target.closest(".ui.fluid.card");
    const post = postElement.attr("post");
    const post_id = postElement.attr("post_id");
    const post_caption = postElement.find(".description").text();

    const name = window.sessionStorage.getItem('isAgent') == 'false' ? "User" : window.sessionStorage.getItem('agentType');

    const currDate = Date.now();
    $.post("/feed", {
        sessionID: sessionID,
        post: post,
        post_id: post_id,
        unflag: currDate,
    });
    target.closest(".ui.fluid.card").find(".ui.dimmer.flag").removeClass("active").dimmer({ closable: true }).dimmer('hide');
    socket.emit("post activity", {
        sessionID: sessionID,
        description: "unflagged post",
        caption: post_caption,
        name: name
    });
}

// Adding a new comment to post
function addNewComment(event) {
    let target = $(event.target);
    const card = target.parents(".ui.fluid.card");
    const post = card.attr("post");
    const post_id = card.attr("post_id");
    const post_caption = card.find(".description").text();

    const agentName = window.sessionStorage.getItem('isAgent') == 'false' ? "User" : window.sessionStorage.getItem('agentType');

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

            socket.emit("post activity", {
                sessionID: sessionID,
                description: "commented on post",
                caption: post_caption,
                text: text,
                name: agentName
            });
        });
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
    const comment_caption = commentElement.find(".text.real").text();
    const currDate = Date.now();

    const name = window.sessionStorage.getItem('isAgent') == 'false' ? "User" : window.sessionStorage.getItem('agentType');

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
        socket.emit("post activity", {
            sessionID: sessionID,
            description: "unliked comment",
            caption: comment_caption,
            name: name
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
        socket.emit("post activity", {
            sessionID: sessionID,
            description: "liked comment",
            caption: comment_caption,
            name: name
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
    const comment_caption = commentElement.find(".text.real").text();

    const comment_imageElement = commentElement.children('.image');
    const comment_contentElement = commentElement.children('.content');
    const flaggedComment_contentElement = commentElement.children('.content.hidden');

    comment_imageElement.transition('hide');
    comment_contentElement.transition('hide');
    $(flaggedComment_contentElement).transition();
    const currDate = Date.now();

    const name = window.sessionStorage.getItem('isAgent') == 'false' ? "User" : window.sessionStorage.getItem('agentType');

    $.post("/feed", {
        sessionID: sessionID,
        post: post,
        post_id: post_id,
        comment: comment,
        comment_id: comment_id,
        flag: currDate
    });
    socket.emit("post activity", {
        sessionID: sessionID,
        description: "flagged comment",
        caption: comment_caption,
        name: name
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
    const comment_caption = commentElement.find(".text.real").text();

    const comment_imageElement = commentElement.children('.image.hidden');
    const comment_contentElement = commentElement.children('.content.hidden');
    const flaggedComment_contentElement = commentElement.children('.content:not(.hidden)');

    $(flaggedComment_contentElement).transition('hide');
    comment_imageElement.transition();
    comment_contentElement.transition();
    const currDate = Date.now();

    const name = window.sessionStorage.getItem('isAgent') == 'false' ? "User" : window.sessionStorage.getItem('agentType');

    $.post("/feed", {
        sessionID: sessionID,
        post: post,
        post_id: post_id,
        comment: comment,
        comment_id: comment_id,
        unflag: currDate
    });
    socket.emit("post activity", {
        sessionID: sessionID,
        description: "unflagged comment",
        caption: comment_caption,
        name: name
    });
}

$(window).on("load", () => {
    // add humanized time to all posts
    $('.right.floated.time.meta, .date').each(addHumanizedTimeToPost);
    $('#content').fadeIn('slow');
    if (window.sessionStorage.getItem('isAgent') == 'true') {
        $('#activityMenu').fadeIn('slow');
    }

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

    // share a post
    $(".share.button").click(sharePost);

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
    // $(".message .close").on("click", function() {
    //     $(this).closest(".message").transition("fade");
    // });

    // scroll to appropriate post when notification popup is clicked
    // $('.notificationPopup').on('click', function(event) {
    //     if ($(event.target).hasClass('close')) {
    //         return false;
    //     }

    //     var relevantPostNumber = $(this).attr('correspondingPost');
    //     $(".ui.card[postID =" + relevantPostNumber + "]").find('textarea.newcomment')[0].scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
    // });

    // Socket listening to broadcasts
    // Incoming activity
    socket.on("post activity", async function(activity) {
        if (sessionID == activity.sessionID) {
            let template = Handlebars.compile($("#activity-template").html());
            $("#activityMenu .activity-list").append(template(activity));

            setTimeout(() => {
                $("#activityMenu .activity-list").find(".yellow").first().removeClass("yellow");
            }, 1500);

            if (window.sessionStorage.getItem('isAgent') == 'true') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    });
})