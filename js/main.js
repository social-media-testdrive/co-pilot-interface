const actors = {
    "Co-Pilot": "/profile_pictures/convo_bot.png",
    "Mrs. Warren": "/profile_pictures/teacher.jpg",
    "Daniel Powers": "/profile_pictures/student.jpg",
    "Alfred Fluffington": "/profile_pictures/student2.jpg"
}

// ----- BELOW IS UNUSED FOR THIS PROJECT.
// function updateNewCommentImage() {
//     const isAgent = window.sessionStorage.getItem('isAgent');
//     const agentType = window.sessionStorage.getItem('agentType');

//     const src = (isAgent === 'false') ? "/profile_pictures/avatar-icon.svg" : actors[agentType];
//     if (window.location.pathname !== "/") {
//         $(".extra.content > .input > .ui.label > img.ui.rounded.image").attr("src", src);
//         // $(".extra.content > .input > .ui.label > img.ui.avatar.image").attr("srcset", src);
//     }
// }

function updateChatImage() {
    const isAgent = window.sessionStorage.getItem('isAgent');
    const agentType = window.sessionStorage.getItem('agentType');

    const src = (isAgent === 'false') ? "/profile_pictures/convo_bot.png" : "/profile_pictures/avatar-icon.svg";
    if (window.location.pathname !== "/") {
        $("#copilot-chat .chat .chat-header img.ui.avatar.image").attr("src", src);
        if (isAgent == 'true') {
            $("#copilot-chat .chat .chat-header .chat-about").css("margin-top", "0px");
            $(".chat .chat-header").css("background", "#5ca6d0");
            $("#copilot-chat .chat .chat-header img.ui.avatar.image").css("margin-top", "0.35em");
            $("#copilot-chat .chat .chat-header .chat-about .chat-with").html("Chat with USER <br/>(as " + agentType + ")");
            $(".actor-chat .chat-message textarea").attr("disabled", "true");
            $(".actor-chat .chat-message textarea").attr("placeholder", "As Co-Pilot, you cannot chat with the actors. You may see what the research participant has chatted though.");
        } else {
            $("#copilot-chat .chat .chat-header .chat-about").css("margin-top", "6px");
            $(".chat .chat-header").css("background", "#293239");
            $("#copilot-chat .chat .chat-header img.ui.avatar.image").css("margin-top", "0em");
            $("#copilot-chat .chat .chat-header .chat-about .chat-with").html("Chat with Co-Pilot");
            $(".actor-chat .chat-message textarea").removeAttr("disabled");
            $(".actor-chat .chat-message textarea").attr("placeholder", "Type your message");
        }
    }
}

$(window).on("load", function() {
    // Check previous page, keep the same settings.
    const initialIsAgent = window.sessionStorage.getItem('isAgent');
    if (initialIsAgent === 'true') {
        $('#isAgentCheckbox input').prop('checked', true);
    } else {
        window.sessionStorage.setItem('isAgent', 'false');
        $('#agentTypeDropdown').addClass("disabled");
    }
    const initialAgentType = window.sessionStorage.getItem('agentType');
    if (initialAgentType) {
        $('#agentTypeDropdown').dropdown('set selected', initialAgentType);
    } else {
        window.sessionStorage.setItem('agentType', Object.keys(actors)[0]);
        $('#agentTypeDropdown').dropdown('set selected', Object.keys(actors)[0]);
    }
    $('#isAgentCheckbox').removeClass("hidden");
    $('#agentTypeDropdown').removeClass("hidden");

    // updateNewCommentImage();
    updateChatImage();

    $('#isAgentCheckbox').change(function() {
        if ($("input[name='isAgentCheckbox']").is(":checked")) {
            window.sessionStorage.setItem('isAgent', 'true');
            $('#agentTypeDropdown').removeClass("disabled");
        } else {
            window.sessionStorage.setItem('isAgent', 'false');
            $('#agentTypeDropdown').addClass("disabled");
        }
        // updateNewCommentImage();
        updateChatImage();
    });

    $("#agentTypeDropdown").dropdown({
        onChange: function(value, text, $choice) {
            window.sessionStorage.setItem('agentType', value);
            // updateNewCommentImage();
            updateChatImage();
        }
    })
});