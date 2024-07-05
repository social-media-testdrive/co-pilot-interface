$(window).on("load", function() {
    // Socket listening to broadcasts
    socket.on("chat message", function(msg) {
        const chat = $('.container.clearfix').data('chatInstance');
        if (chat && sessionID == msg.sessionID) {
            chat.addMessageExternal(msg.isAgent, msg.name, msg.text);
        } else {
            console.error("Chat instance not found for message:", msg);
        }
    })

    $('.container.clearfix').each(function() {
        const chatId = this.id;
        const chat = {
            // messageResponses: [],
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
            render: function(isAgent, name, message) {
                this.scrollToBottom();
                if (message.trim() !== '') {
                    let template;
                    if (isAgent) {
                        template = Handlebars.compile($("#other-message-template").html());
                    } else {
                        template = Handlebars.compile($("#my-message-template").html());
                    }
                    let context = {
                        name: name,
                        messageOutput: message,
                        time: this.getCurrentTime()
                    };

                    this.$chatHistoryList.append(template(context));

                    this.scrollToBottom();
                    this.$textarea.val('');

                    setTimeout(function() {
                        this.scrollToBottom();
                    }.bind(this), 1500);
                }
            },

            addMessage: function() {
                const isAgent = $('#isAgentCheckbox input').is(":checked");
                const agentType = $('#agentTypeDropdown').dropdown('get value');

                // TO DO: Edit chat interface to include photo of agent & participant
                // const src = !isAgent ? "/profile_pictures/avatar-icon.svg" : actors[agentType];
                const name = !isAgent ? "Me" : agentType;
                const message = this.$textarea.val();
                socket.emit("chat message", {
                    text: message,
                    sessionID: window.location.pathname.split('/')[1],
                    name: name,
                    isAgent: isAgent
                });

                // TO DO: Add infrastructure to log messages into the database
                this.render(isAgent, name, message);
            },

            addMessageExternal: function(isAgent, name, message) {
                this.render(isAgent, name, message);
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