# Social Media Co-Pilot (hcc-project) - Ongoing Study
This is the source code for a very simple chatbot, used in the *Social Media Co-Pilot* study. This is a collaborative study at Cornell University.

## Demo website
https://co-pilot-test.onrender.com


https://github.com/user-attachments/assets/2068a9d2-016a-480f-a81a-b4efe6ba15ee


## Description

This chatbot is used to explore conversational strategies in cyberbullying. It is used in interviews with students and educators.

In one sense, it is an imagined version of the final product (which is the *Social Media TestDrive* [“How to be an Upstander”](https://app.socialmediatestdrive.org/intro/cyberbullying) module that implements a fully independent and functioning conversational AI component in the free-play section). This chatbot interface allows us to simulate conversational strategies to test responses with end-users and get their feedback, before building the final product. The end-users do not know the responses are human-controlled, but think they are computer-driven.

## Behavior
* On the landing page of the application, a list of experimental scenarios is displayed. There is a URL link to provide to the "Student" and "Co-Pilot" for each scenario. 
    * By default, both links do not display the footer toggle (which allows the user to toggle between the "Student" and "Co-Pilot" roles). To display the footer, add *footer=true* as a query parameter to the URL link.
* Submitting the same “Session ID” value into the input field on the second landing page allows multiple users to enter the same “room”. Only people in the same “room” can see the corresponding chats and actions to the posts in that “room”. Therefore, for a research participant and researcher to interact, they will need to use the same "Session ID" value.
    * Note: You can therefore use the “Session ID” to distinguish between each interview session as well.
    * Note: All actions done in the "room" are recorded with that corresponding "Session ID" session only.

* In general, the web address is used to indicate the experimental scenario, the session, the role of the user, and whether to display the footer toggle. Specifically:
    * The first path subdirectory indicates the experimental scenario to display.
    * The second path subdirectory indicates the current session by the provided "Session ID".
    * The query parameter *?copilot=true* indicates the user should be the "Co-Pilot", which displays all chat messages as the Co-Pilot. 
    * The query parameter *?footer=true* displays the footer toggle.

## Functionalities
* *Posts:* Liking, flagging, and sharing posts & liking, flagging, and adding comments are all functional, persistent, and recorded in the database with their corresponding session by "Session ID".
* *Chats:* The chats are functional, persistent, and recorded in the database with their corresponding session by "Session ID". Chats are implemented with socket.io (https://socket.io/get-started/chat/). 
    * All chat messages by the "Student" user are shown to the "Co-Pilot" user in real time and vice versa. They appear in the same way they appear on the "Student"'s screen (i.e. the chat messages are not flipped to reflect the messenger on the right side of the chat necessarily).
    * The "Co-Pilot" user's messages appear on the left side of the chat.  The "Student" user's messages appear on the right side of the chat.
    * Note: The "Co-Pilot" user cannot respond to other chats other than the "Co-Pilot" chat.

## How to Install Locally
### Installing the Prerequisites

Follow these instructions: https://truman.gitbook.io/the-truman-platform/setting-up-truman/installing-truman/installing-the-prerequisites

### Setting up the interface locally

Follow these instructions: https://truman.gitbook.io/the-truman-platform/setting-up-truman/installing-truman/setting-up-truman-locally
