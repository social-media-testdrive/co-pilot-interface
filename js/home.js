function addSessionID(event) {
    const sessionID = $("input[name='Session ID']").val().trim();
    if (sessionID == "") {
        // Focuses cursor to input field, if the input field is blank
        $("input[name='Session ID']").val("");
        $("input[name='Session ID']").focus();
    } else {
        // Sets session storage "SessionID", redirect to '/cyberbully' route
        // window.sessionStorage.setItem('Session ID', sessionID);
        window.location.href = `/${sessionID}`;
    }
}

$(window).on("load", () => {
    // Press icon to enter input
    $(".enter.button").click(function(event) {
        addSessionID(event);
    });

    // Press enter to enter input
    window.addEventListener("keydown", function(event) {
        if (event.key === 'Enter' && event.target.className == "sessionID") {
            event.stopImmediatePropagation();
            addSessionID(event);
        }
    }, true);
});