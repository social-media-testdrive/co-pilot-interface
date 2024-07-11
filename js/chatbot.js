async function openActorChat(username, picture) {
    // Update chat header
    $(".actor-chat").attr("id", username);
    $(".actor-chat .chat .chat-header img.ui.avatar.image").attr("src", picture);
    $(".actor-chat .chat .chat-header .chat-about .chat-with").text("Chat with " + username);
    // Update chat history 
    const chat = $('.actor-chat.container.clearfix').data('chatInstance');
    chat.chatId = username;
    chat.mostRecentMessenger = null;
    chat.resetChat();
    // Show chat
    if (!$('.actor-chat .chat').is(":visible")) {
        $('.actor-chat .chat').transition('fade up');
    }
    // Toggle chat up
    if (!$('.actor-chat .chat .chat-history').is(":visible")) {
        $('.actor-chat .chat .chat-history').slideToggle(300, 'swing');
    }
    // Get previous messages in #USERNAME chat
    await $.getJSON("/chat", { "sessionID": sessionID, "chat_id": username }, function(data) {
        for (const msg of data) {
            chat.addMessageExternal(msg.body, msg.absTime, msg.name, msg.isAgent);
        }
    });
}

function clickMessageUser(event) {
    let target = $(event.target);
    const username = target.parent().siblings(".header").text();
    const picture = target.parent().siblings(".header").find("img").attr("src");
    openActorChat(username, picture);
}

$(window).on("load", function() {
    // Get previous messages in #co-pilot chat
    $.getJSON("/chat", { "sessionID": sessionID, "chat_id": "copilot-chat" }, function(data) {
        const chat = $('#copilot-chat.container.clearfix').data('chatInstance');
        for (const msg of data) {
            chat.addMessageExternal(msg.body, msg.absTime, msg.name, msg.isAgent);
        }
    });

    // Socket listening to broadcasts
    socket.on("chat message", async function(msg) {
        const chatId = msg.chatId;
        const chat = chatId == "copilot-chat" ? $('#copilot-chat.container.clearfix').data('chatInstance') : $('.actor-chat.container.clearfix').data('chatInstance');
        if (chat && sessionID == msg.sessionID) {
            //- If message received is to a new actor
            if (chatId != "copilot-chat" && chatId != chat.chatId) {
                await openActorChat(msg.chatId, msg.actorSrc);
            }
            chat.addMessageExternal(msg.body, msg.absTime, msg.name, msg.isAgent);
        }
    });

    // Enable popups over usernames
    $('.username').popup({ hoverable: true });

    $('.container.clearfix').each(function() {
        const chatId = this.id;
        const chat = {
            mostRecentMessenger: null,
            chatId: chatId,
            init: function() {
                this.cacheDOM();
                this.bindEvents();
                $(this.$chatHistory).closest('.container.clearfix').data('chatInstance', this); // Store instance
            },
            cacheDOM: function() {
                if (chatId) {
                    this.$chatHistory = $('#' + chatId + ' .chat-history');
                    this.$button = $('#' + chatId + ' button');
                    this.$textarea = $('#' + chatId + ' #message-to-send');
                    this.$img = $('#' + chatId + ' img.ui.avatar.image');
                    this.$chatHistoryList = this.$chatHistory.find('ul');
                } else {
                    this.$chatHistory = $('.actor-chat .chat-history');
                    this.$button = $('.actor-chat button');
                    this.$textarea = $('.actor-chat #message-to-send');
                    this.$img = $('.actor-chat img.ui.avatar.image');
                    this.$chatHistoryList = this.$chatHistory.find('ul');
                }
            },
            bindEvents: function() {
                this.$button.on('click', this.addMessage.bind(this));
                this.$textarea.on('keydown', this.addMessageEnter.bind(this));
            },
            render: function(body, absTime, name, isAgent) {
                if (body.trim() !== '') {
                    let template;
                    if (isAgent) {
                        template = Handlebars.compile($("#other-message-template").html());
                    } else {
                        template = Handlebars.compile($("#my-message-template").html());
                    }
                    let context = {
                        name: name,
                        messageOutput: body,
                        time: absTime,
                        addProfilePhoto: this.mostRecentMessenger != name,
                    };
                    this.mostRecentMessenger = name;

                    this.$chatHistoryList.append(template(context));

                    this.scrollToBottom();
                    this.$textarea.val('');
                } else {
                    this.scrollToBottom();
                    this.$textarea.val('');
                }
                if (!this.$chatHistory.is(":visible")) {
                    this.$chatHistory.slideToggle(300, 'swing');
                }
            },

            addMessage: function() {
                const isAgent = $('#isAgentCheckbox input').is(":checked");
                const agentType = $('#agentTypeDropdown').dropdown('get value');
                const name = !isAgent ? "Me" : agentType;
                const message = this.$textarea.val();
                const time = this.getCurrentTime();

                const actorSrc = this.$img.attr("src");

                socket.emit("chat message", {
                    sessionID: sessionID,
                    chatId: this.chatId,
                    body: message,
                    absTime: time,
                    name: name,
                    isAgent: isAgent,

                    actorSrc: actorSrc
                });
                this.render(message, time, name, isAgent);

                $.post("/chat", {
                    sessionID: sessionID,
                    chat_id: this.chatId,
                    body: message,
                    absTime: time,
                    name: name,
                    isAgent: isAgent
                });
            },

            addMessageExternal: function(body, absTime, name, isAgent) {
                this.render(body, absTime, name, isAgent);
            },

            addMessageEnter: function(event) {
                if (event.keyCode == 13 && !event.shiftKey) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    this.addMessage();
                }
            },

            scrollToBottom: function() {
                if (this.$chatHistory[0]) {
                    this.$chatHistory.scrollTop(this.$chatHistory[0].scrollHeight);
                }
            },

            getCurrentTime: function() {
                return new Date().toLocaleTimeString().
                replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
            },

            resetChat: function() {
                this.$chatHistoryList.empty();
            }
        };
        chat.init();
    });

    // Minimize chat box
    $('.chat-minimize, .chat-header').click(function(e) {
        e.stopImmediatePropagation();
        let chat = $(this).closest('.chat').children('.chat-history');
        chat.slideToggle(300, 'swing');
    });

    // Close chat box
    $('.chat-close').click(function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        $('.actor-chat .chat').transition('fade down');
    });
});