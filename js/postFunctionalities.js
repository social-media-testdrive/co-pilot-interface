var socket = io();
const postDictionary = {
    post1: "Ella Sroni's",
    post2: "Breana Summers's",
    post3: "Dylan Moore's",
    post4: "Keegan Scott's",
    // post1: "Lana Reed's",
    // post2: "Ariel Simon's",
    // post3: "Emma Hanson's",
    // post4: "David Cole's",
};
let notification_timeout;
let typing_timeout;

// Socket listening to broadcasts
socket.on("post comment", function(msg) {
    if (msg["sessionID"] !== window.location.pathname.split('/')[1]) {
        return;
    }
    const card = $(".ui.card[postID =" + msg["postID"] + "]");
    let comments = card.find(".ui.comments");
    // no comments area - add it
    if (!comments.length) {
        const buttons = card.find(".three.ui.bottom.attached.icon.buttons");
        buttons.after('<div class="content"><div class="ui comments"></div>');
        comments = card.find(".ui.comments");
    }
    if (msg["text"].trim() !== "") {
        // Clear any animations 
        if (comments.find(".typing.comment").length !== 0) {
            $(comments.find(".typing.comment")).slideUp(400, function() { $(this).remove(); });
        }
        clearTimeout(typing_timeout);

        const src = msg["agent"] === "Guest" ? "/profile_pictures/avatar-icon.svg" : actors[msg["agent"]];
        const name = msg["agent"];
        const mess =
            `<div class="comment">
                <a class="avatar"> <img src=${src}> </a>
                <div class="content">
                <a class="author">${name}</a>
                <div class="metadata">
                    <span class="date"><1 minute ago</span>
                    <i class="heart icon"></i> 0 Likes
                    ${!msg["agent"] && $("input[name='agentCheckbox']").is(":checked") && msg["isProfane"] ? "<div class='ui red label'>PROFANE</div>" :""}
                </div>
                <div class="text">${msg["text"]}</div>
                </div>
            </div>`;
        comments.append(mess);

        // Display a notification:
        // hide the mobile view popups if not in mobile view anymore
        if ($(window).width() < 1086) {
            $("#removeHiddenMobile").hide();
        } else {
            $("#removeHidden").hide();
        }
        const imageHref = src;
        const text = msg["agent"] + " commented on " + postDictionary[msg["postID"]] + ' post: "' + msg["text"] + '".';
        $(".popupNotificationImage").attr("src", imageHref);
        $(".notificationPopup").attr("correspondingpost", msg["postID"]);
        $(".ui.fixed.bottom.sticky.notificationPopup .summary").text(text);

        //if in a mobile view, put popup in the middle
        if ($(window).width() < 1086) {
            $("#removeHiddenMobile").removeClass("hidden").show();
            $("#mobilePopup").transition("pulse");
        } else {
            //else put popup on the side
            $("#removeHidden").removeClass("hidden").show();
            $("#desktopPopup").transition("pulse");
        }

        clearTimeout(notification_timeout);
        notification_timeout = setTimeout(function() {
            if ($("#removeHidden").is(':visible')) {
                $("#removeHidden").transition("fade");
            } else if ($("#removeHiddenMobile").is(':visible')) {
                $("#removeHiddenMobile").transition("fade");
            }
        }, 5000);

        // If is ai bot, and the message was from a user-- scroll to the new comment 
        if (msg["agent"] === "Guest" && $("input[name='isAgentCheckbox']").is(":checked")) {
            $(".ui.card[postID =" + msg["postID"] + "]").find('textarea.newcomment')[0].scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });

            const enableGPT3 = $('meta[name="enableGPT3"]').attr('content') === "true";
            if (enableGPT3) {
                // Get GPT-3 Response
                $.post("/gpt3", {
                    sessionID: window.location.pathname.split('/')[1],
                    postID: card.attr("postID"),
                    text: msg["text"]
                }).then(function(data) {
                    const comment_area = card.find("textarea.newcomment")
                    comment_area.val(data["choices"][0]["text"].trim());
                    comment_area.focus();
                });
            }
        }
    }
});

function likePost(e) {
    const target = $(event.target);
    // Determine if the comment is being LIKED or UNLIKED based on the initial
    // button color. Red = UNLIKE, Not Red = LIKE.
    if (target.closest(".ui.like.button").hasClass("red")) {
        // Since the button was already red, this button press is an UNLIKE action.
        // Remove red color from like button and decrease the displayed like count
        target.closest(".ui.like.button").removeClass("red");
        const label = $(this)
            .closest(".ui.like.button")
            .next("a.ui.basic.red.left.pointing.label.count");
        label.html(function(i, val) {
            return val * 1 - 1;
        });
    } else {
        // Since the button was not red, this button press is a LIKE action
        // Add red color to like button and increase the displayed like count
        target.closest(".ui.like.button").addClass("red");
        const label = $(this).next("a.ui.basic.red.left.pointing.label.count");
        label.html(function(i, val) {
            return val * 1 + 1;
        });
    }
}

function flagPost(e) {
    var post = $(this).closest(".ui.card");
    post
        .find(".ui.dimmer.flag")
        .dimmer({
            closable: false,
        })
        .dimmer("show");
    //repeat to ensure its closable
    post
        .find(".ui.dimmer.flag")
        .dimmer({
            closable: true,
        })
        .dimmer("show");
}

function addNewComment(event) {
    let target = $(event.target);
    const card = target.parents(".ui.fluid.card");
    const text = card.find("textarea.newcomment").val();
    let comments = card.find(".ui.comments");
    // no comments area - add it
    if (!comments.length) {
        const buttons = card.find(".three.ui.bottom.attached.icon.buttons");
        buttons.after('<div class="content"><div class="ui comments"></div>');
        comments = card.find(".ui.comments");
    }
    if (text.trim() !== "") {
        const isAgent = $('#isAgentCheckbox input').is(":checked");
        const agentType = $('#agentTypeDropdown').dropdown('get value');

        const src = !isAgent ? "/profile_pictures/avatar-icon.svg" : actors[agentType];
        const name = !isAgent ? "Guest" : agentType;

        const mess =
            `<div class="comment">
                <a class="avatar"> 
                    <img src=${src}> 
                </a>
                <div class="content">
                    <a class="author">${name}</a>
                    <div class="metadata">
                        <span class="date"><1 minute ago</span>
                        <i class="heart icon"></i> 0 Likes
                    </div>
                    <div class="text">${text}</div>
                </div>
            </div>`;

        card.find("textarea.newcomment").val("");
        if (comments.find(".typing.comment").length !== 0) {
            $(mess).insertBefore(".typing.comment");
        } else {
            comments.append(mess);
            // Add Typing Animation 3 seconds after the Guest leaves a comment.
            if (name === "Guest") {
                setTimeout(function() {
                    const typing_mess =
                        `<div class="typing comment" style="display: none;>     
                        <div class="content">
                            <img src="/typing.gif" style="width:40px;height:auto; margin-left: 45px;">
                            <p style="margin-left: 45px; color: #5d5d5d"> Someone is commenting... </p>
                        </div>
                    </div>`;
                    comments.append(typing_mess);
                    $(comments.find(".typing.comment")).show('400');
                }, 2000);
            }
        }

        // If after 60 seconds, and the animation is still there, remove it.
        clearTimeout(typing_timeout);
        typing_timeout = setTimeout(function() {
            if (comments.find(".typing.comment").length !== 0) {
                $(comments.find(".typing.comment")).slideUp(400, function() { $(this).remove(); });
            }
        }, 60000);

        socket.emit("post comment", {
            text: text,
            postID: card.attr("postID"),
            sessionID: window.location.pathname.split('/')[1],
            agent: name // indicates if comment was made as the convo AI agent (used to be a Boolean)
        });

        $.post("/feed", {
            sessionID: window.location.pathname.split('/')[1],
            postID: card.attr("postID"),
            actor: name,
            body: text
        });
    }
}

function likeComment(e) {
    const target = $(e.target);
    // Determine if the comment is being LIKED or UNLIKED based on the initial
    // button color. Red = UNLIKE, Not Red = LIKE.
    if (target.hasClass("red")) {
        // Since the button was already red, this button press is an UNLIKE action.
        // Remove red color from Like Button and heart icon
        target.removeClass("red");
        const comment = target.parents(".comment");
        comment.find("i.heart.icon").removeClass("red");
        // Decrease the like count by 1
        const label = comment.find("span.num");
        label.html(function(i, val) {
            return val * 1 - 1;
        });
    } else {
        // Since the button was not red, this button press is a LIKE action
        // Add red color to heart icon
        target.addClass("red");
        const comment = target.parents(".comment");
        comment.find("i.heart.icon").addClass("red");
        // Increase the like count by 1
        const label = comment.find("span.num");
        label.html(function(i, val) {
            return val * 1 + 1;
        });
    }
}

function flagComment(e) {
    const comment = $(this).parents(".comment");
    comment.replaceWith(
        `<div class='comment' style='background-color:black;color:white;'>
            <h5 class='ui inverted header'>
                <span>
                The admins will review this comment further. We are sorry you had this experience.
                </span>
            </h5>
        </div>`
    );
}

$(window).on("load", () => {
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

    // create a new Comment
    $("i.big.send.link.icon").click(addNewComment);

    // like a comment
    $("a.like.comment").click(likeComment);

    // flag a comment
    $("a.flag.comment").click(flagComment);

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