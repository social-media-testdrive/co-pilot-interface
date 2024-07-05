# Social Media Co-Pilot (hcc-project)
This is the source code for a very simple [chatbot] used in the Social Media Co-Pilot study. This is a collaborative study at Cornell University.

## Description

This chatbot will be used to explore conversational strategies in cyberbullying. It will be used in interviews with students and educators.

In one sense, it is an imagined version of the final product (which is the [“How to be an Upstander”](https://app.socialmediatestdrive.org/intro/cyberbullying) module that implements a fully independent and functioning conversational ai component in the free-play section). The interface allows us to simulate conversational strategies to test responses with end-users and get their feedback, before building the final product. The end-users do not know the responses are human-controlled, but think they are computer-driven.

## Behavior
* Submitting the same “Session ID” value into the input field on the landing page allows multiple users to enter the same “room”. Only people in the same “room” can see the corresponding chat in that “room”.
    * Note: You can therefore use the “Session ID” to distinguish between each interview session.
* By default, users act as the "Student".
* If a user wants to play the Researcher (or the "Co-Pilot"), they can toggle the toggle at the footer, which will then display all of that person’s future chat messages as the selected “Co-Pilot role”.

## How to Install Locally
### Installing the Prerequisites

Follow these instructions: https://truman.gitbook.io/the-truman-platform/setting-up-truman/installing-truman/installing-the-prerequisites

### Setting up the interface locally

Follow these instructions: https://truman.gitbook.io/the-truman-platform/setting-up-truman/installing-truman/setting-up-truman-locally