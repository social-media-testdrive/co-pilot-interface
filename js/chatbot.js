$(window).on("load", function() {
    // Get previous messages in #co-pilot chat
    $.getJSON("/chat", { "sessionID": sessionID, "chat_id": "copilot-chat" }, function(data) {
        const chat = $('#copilot-chat.container.clearfix').data('chatInstance');
        for (const msg of data) {
            chat.addMessageExternal(msg.body, msg.absTime, msg.name, msg.isAgent);
        }
    });

    // Socket listening to broadcasts
    socket.on("chat message", function(msg) {
        const chat = $('.container.clearfix').data('chatInstance');
        if (chat && sessionID == msg.sessionID) {
            chat.addMessageExternal(msg.body, msg.absTime, msg.name, msg.isAgent);
        } else {
            console.error("Chat instance not found for message:", msg);
        }
    });

    $('.container.clearfix').each(function() {
        const chatId = this.id;
        const chat = {
            mostRecentMessenger: null,
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
                    this.$chatHistoryList = this.$chatHistory.find('ul');
                } else {
                    this.$chatHistory = $('.chat-history');
                    this.$button = $('button');
                    this.$textarea = $('#message-to-send');
                    this.$chatHistoryList = this.$chatHistory.find('ul');
                }
            },
            bindEvents: function() {
                this.$button.on('click', this.addMessage.bind(this));
                this.$textarea.on('keydown', this.addMessageEnter.bind(this));
            },
            render: function(body, absTime, name, isAgent) {
                this.scrollToBottom();
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

                    setTimeout(function() {
                        this.scrollToBottom();
                    }.bind(this), 1500);
                }
                if (!this.$chatHistory.is(":visible")) {
                    this.$chatHistory.slideToggle(300, 'swing');
                }
            },

            addMessage: function() {
                const isAgent = $('#isAgentCheckbox input').is(":checked");
                const agentType = $('#agentTypeDropdown').dropdown('get value');

                // TO DO: Edit chat interface to include photo of agent & participant
                // const src = !isAgent ? "/profile_pictures/avatar-icon.svg" : actors[agentType];
                const name = !isAgent ? "Me" : agentType;
                const message = this.$textarea.val();
                const time = this.getCurrentTime();

                socket.emit("chat message", {
                    sessionID: sessionID,
                    body: message,
                    absTime: time,
                    name: name,
                    isAgent: isAgent
                });
                this.render(message, time, name, isAgent);

                $.post("/chat", {
                    sessionID: sessionID,
                    chat_id: chatId,
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
                // Enter was pressed without shift key
                if (event.keyCode == 13 && !event.shiftKey) {
                    // prevent default behavior
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
        };
        chat.init();
    });

    // Minimize chat box
    $('a.chat-minimize').click(function(e) {
        e.preventDefault();
        let chat = $(this).closest('.chat').children('.chat-history');
        chat.slideToggle(300, 'swing');
    });

    // Close chat box
    // $('a.chat-close').click(function(e) {
    //     e.preventDefault();
    //     let chat = $(this).closest('.chat');
    //     chat.fadeOut(300, 'swing');
    //     var chatId = $(this).closest('.container.clearfix')[0].id;

    //     $.post("/chatAction", {
    //         absTime: Date.now(),
    //         chatId: (chatId) ? chatId : 'chatbox1',
    //         subdirectory2: pathArray[2],
    //         subdirectory1: pathArray[1],
    //         closed: true,
    //         _csrf: $('meta[name="csrf-token"]').attr('content')
    //     });
    // });
});