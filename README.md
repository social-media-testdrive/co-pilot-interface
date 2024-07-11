# Social Media Co-Pilot (hcc-project)
This is the source code for a very simple chatbot, used in the *Social Media Co-Pilot* study. This is a collaborative study at Cornell University.

## Description

This chatbot is used to explore conversational strategies in cyberbullying. It is used in interviews with students and educators.

In one sense, it is an imagined version of the final product (which is the *Social Media TestDrive* [“How to be an Upstander”](https://app.socialmediatestdrive.org/intro/cyberbullying) module that implements a fully independent and functioning conversational AI component in the free-play section). This chatbot interface allows us to simulate conversational strategies to test responses with end-users and get their feedback, before building the final product. The end-users do not know the responses are human-controlled, but think they are computer-driven.

## Behavior
* Upon entering the application, a list of experimental scenarios is displayed, alongside each scenario's corresponding link to provide to the research participant and to the researcher.
* Submitting the same “Session ID” value into the input field on the second landing page allows multiple users to enter the same “room”. Only people in the same “room” can see the corresponding chats in that “room”. Therefore, for a research participant and researcher to interact, they need to provide the same "Session ID" value.
    * Note: You can therefore use the “Session ID” to distinguish between each interview session as well.
    * Note: All actions done in the "room" (including on posts) are recorded with that corresponding "Session ID" session only.
* By default, users act as the "Student".
* If a user wants to act as the "Co-Pilot", they will need to toggle the toggle in the footer, which, will then display all of that person’s future chat messages as the "Co-Pilot".

* In general, the web address can be used to indicate the experimental scenario desired, the session, and the role of the user. For example:
    * The first path subdirectory indicates the experimental scenario. 
    * The second path subdirectory indicates the session via the provided "Session ID".
    * The query parameter "?footer=true" indicates the user should be the "Co-Pilot", and when included, displays the toggle in the footer.

## Functionalities
* *Posts:* Liking, flagging, and sharing posts & liking, flagging, and adding comments are all functional, persistent, and recorded in the database with their corresponding session by "Session ID".
* *Chats:* The chats are functional, persistent, and recorded in the database with their corresponding session by "Session ID". Chats are implemented with socket.io (https://socket.io/get-started/chat/). 
    * All chat messages by the "Student" user are shown to the "Co-Pilot" user in real time. They appear in the same way they appear on the "Student"'s screen (i.e. the chat messages are not flipped to reflect messenger on the right side of the chat).
    * The "Co-Pilot" user's messages appear as "Co-Pilot" to the "Student". 
    * Note: The "Co-Pilot" user cannot respond to other chats other than the "Co-Pilot" chat.


## Demo: https://co-pilot-lvl5.onrender.com
## How to Install Locally
### Installing the Prerequisites

Follow these instructions: https://truman.gitbook.io/the-truman-platform/setting-up-truman/installing-truman/installing-the-prerequisites

### Setting up the interface locally

Follow these instructions: https://truman.gitbook.io/the-truman-platform/setting-up-truman/installing-truman/setting-up-truman-locally