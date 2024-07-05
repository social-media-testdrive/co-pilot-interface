# convo-ai-prototype

This is the source code for a very simple [wizard of oz prototype](https://convoai-prototype.herokuapp.com/) used in
the Conversational AI-based Agent co-design study. This is a collaborative study with the Cornell Social Media Lab and Prof. Qian Yang. 

## Description

This wizard of oz prototype will be used in the second or third round of co-design interviews with students and educators.

It is an early iteration of the final product (which is the [“How to be an Upstander”](https://app.socialmediatestdrive.org/intro/cyberbullying) module that implements a fully independent and functioning conversational ai component in the free-play section). The wizard of oz prototype allows us to fake the “conversational ai agent” responses to test the responses with end-users and get their feedback, before building the final product. The end-users do not know the responses are human-controlled, but think they are computer-driven.
## Definitions
* **User:** The student
* **Researcher:** The researcher
## Required Behavior 
* Researchers can see User-created comments, and the context of the post the comments were left on (the original post, previous comments etc.)
* Researchers can see the GPT-3 model output, and edit it. 
* Researchers can play the human wizard and leave comments that the User will see.
* The platform logs all the comments left by the User and the Researcher, and the GPT-3 model output.

## Intended Behavior
If you open the above link in two different tabs or browsers side by side, you'll be able to see what the WoZ prototype will look like during the second/third round of interviews-- with 2 (or more) people on the site at once.

One tab will be like the tab the student has open on their own laptop, and the other tab will be like the tab the researcher has open on their own laptop.

* A User and a Researcher can submit the same “Session ID” value into the input field on the landing page to enter the same “room”. Only people in the same “room” can see the comments that are left by others in that same “room”.
    * Note: You can therefore use the “Session ID” to distinguish between each co-design interview/session. 
    * All comments (from both the User and the researcher) are logged in a MongoDB database. So if you want to see the comments that were left in a co-design interview/session retro-actively, you can enter the past “Session ID” into the input field, and the interface will display the comments. Alternatively, you can access it through the URL, by appending the “Session ID” value as the first route parameter (ex: Session ID = ‘test’, URL = https://convoai-prototype.herokuapp.com/test) 
* Anyone can leave a comment on any post. Leaving a comment on the post will reflect and appear on any other browsers open that are also in the same “Session ID” room, and it will also display a notification to all the other users. Clicking on this notification scrolls the window to the corresponding post.
* If a person wants to play the Researcher (or the "Conversational AI Agent"), they can toggle the toggle at the footer, which will then display all of that person’s future comments they make as the “Conversational AI Agent”. While playing the “Conversational AI Agent”, the Researcher will also see the GPT-3 model output to comments that Users are making, and the Researcher can edit it. Also, the screen will automatically scroll to any comments that come in from other Users, so it makes it easier for the Researcher to follow and see when and where a User left a comment.