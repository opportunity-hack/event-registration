# Team-3: Zuri's Circle
## Inspiration
Zuri's Circle seeks to provide temporary relief during unforeseen circumstances to families, elderly and the homeless. 
Some of the services that Zuri's Circle provides includes:
- Food
- Clothing
- Furniture
- Programs
- Resources

A challenge that Zuri's Circle faced was gathering and managing emails at volunteer or regular events - their process involved participants writing down their contact information by hand. This introduced problems with deciphering the contact info and proved to be ineffective. As a result, they were looking for a way to easily track and manage participant involvement in order to keep in contact with and retain their donors, recipients, and volunteers.

## What it does
Our solution, which we call **Zuri's Dashboard**, allows the NPO to:
- Create and track events
- Provide an interface for participants to enter their emails for any one event
- Automatically send a thank you and confirmation to entered emails
- Associate entered emails with their corresponding event
- Send a "Request Feedback" email for participants to describe their experience
- Provide an interface for sending a custom email to all participants of any one event
- Track all feedback received for every event
- Analyze positive and negative feedback for each event
- Import/Export emails for any one event

## How we built it
The backend solution for **Zuri's Dashboard** includes:
- ASP.NET Core 3.0
- ML.NET
- MongoDB
- Json Web Tokens
- Google OAuth 2.0
- Twilio / SendGrid

The frontend solution for **Zuri's Dashboard** includes:
- React
- Redux
- Material UI
- Chart.js

The cloud solution for **Zuri's Dashboard** is:
- Azure for the WebApp
- Heroku for the MongoDB database

## Challenges we ran into
One unfortunate challenge we ran into was the inability to successfully deploy a Docker image of our WebApp because of the lack of Docker documentation as well as version/incompatibility issues with .NET Core 3.0 (due to the framework being quite new at the time of this submission).

## Accomplishments that we're proud of
We are quite proud of our implementation of Machine Learning .NET (ML.NET) into this solution. To do this, we trained a supervised model with labeled data using a logistic regression algorithm to perform binary classification of sentiments. With our model, we were able to make accurate predictions on whether or not the feedback received from participants was positive or negative for analysis purposes; this also provided a "one-glance" view of whether or not an event was successful/positively received.

## What we learned
We learned how to incorporate Twilio / SendGrid into a .NET application, which none of our team members had done before. We also explored the React hooks API.

## What's next for Zuri's Dashboard
Future deployments of **Zuri's Dashboard** could include more customization for sending group emails to participants of an event, designated by their participant type (send just to donors, recipients, volunteers, etc.). Another much larger feature would be to analyze and label all feedback received from actual Zuri's Circle participants to train our machine learning model with for even more accurate predictions.
