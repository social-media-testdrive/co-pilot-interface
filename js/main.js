const actors = {
    "Mrs. Warren": "/profile_pictures/teacher.jpg",
    "Daniel Powers": "/profile_pictures/student.jpg",
    "Alfred Fluffington": "/profile_pictures/student2.jpg",
    "Conversational AI Agent": "/profile_pictures/convo_bot.png"
}

function updateNewCommentImage() {
    const isAgent = window.sessionStorage.getItem('isAgent');
    const agentType = window.sessionStorage.getItem('agentType');

    const src = (isAgent === 'false') ? "/profile_pictures/avatar-icon.svg" : actors[agentType];
    if (window.location.pathname !== "/") {
        $(".extra.content > .input > .ui.label > img.ui.rounded.image").attr("src", src);
        // $(".extra.content > .input > .ui.label > img.ui.avatar.image").attr("srcset", src);
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

    updateNewCommentImage();

    $('#isAgentCheckbox').change(function() {
        if ($("input[name='isAgentCheckbox']").is(":checked")) {
            window.sessionStorage.setItem('isAgent', 'true');
            $('#agentTypeDropdown').removeClass("disabled");
        } else {
            window.sessionStorage.setItem('isAgent', 'false');
            $('#agentTypeDropdown').addClass("disabled");
        }
        updateNewCommentImage();
    });

    $("#agentTypeDropdown").dropdown({
        onChange: function(value, text, $choice) {
            window.sessionStorage.setItem('agentType', value);
            updateNewCommentImage();
        }
    })
});