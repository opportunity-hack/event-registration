import React from "react";
import { Typography, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import Help0 from "../resources/images/0.PNG";
import Help1 from "../resources/images/1.PNG";
import Help2 from "../resources/images/2.PNG";
import Help3 from "../resources/images/3.PNG";
import Help4 from "../resources/images/4.PNG";
import Help5 from "../resources/images/5.PNG";
import Help6 from "../resources/images/6.PNG";
import Help7 from "../resources/images/7.PNG";
import Help8 from "../resources/images/8.PNG";
import Help9 from "../resources/images/9.PNG";
import Help10 from "../resources/images/10.PNG";
import Help11 from "../resources/images/11.PNG";
import Help12 from "../resources/images/12.PNG";

const useStyles = makeStyles(theme => ({
  image: {
    maxWidth: 800
  },
  section: {
    marginTop: theme.spacing(2)
  }
}));

export default function Help() {
  const classes = useStyles();
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Help Center
      </Typography>

	  <Typography variant="h6">
		For any issues with the system, please feel free to text or email the system administrator:
	  </Typography>
	  <Typography color="textSecondary" gutterBottom>
		(602) 810-3667<br />
		TMMooreGCU@gmail.com
      </Typography>
	  <br /><br />

	  <Typography variant="h6">
		How to create an event:
	  </Typography>
      <Typography color="textSecondary" gutterBottom>
		Navigate to <b>Events</b> -> <b>Create Event</b> and fill out the form to create a new event.
      </Typography>
	  <img src={Help0} alt="Create Event" className={classes.image} />
	  <br /><br />

      <Typography variant="h6" className={classes.section}>
        How to collect emails for an event:
      </Typography>
      <Typography color="textSecondary" gutterBottom>
		You can find the event you just created in <b>Events</b> -> <b>View Events</b>.
		You will most likely see it near the top - if you don't see it at first, you can
		filter the events by Title, Start Date, End Date, or Participants, simply by clicking
		the respective heading button. Once you found the event, click on the "<b>Add Emails</b>"
		button. This will take you to an input form where people can walk up to your laptop and enter in 
		their email for the event.
      </Typography>
      <img src={Help1} alt="View Events" className={classes.image} />
	  <Typography color="textSecondary" gutterBottom>
		The input form will look like this. Feel free to collapse the sidebar. 
		As soon as someone enters their email, the system will automatically send 
		them a "Confirmation" email so that they can confirm their email 
		in the system (letting you know that you can definitively reach them with 
		that email address):
      </Typography>
	  <img src={Help3} alt="Add Email" className={classes.image} />
	  <br /><br />

	  <Typography variant="h6">
		How to delete an event:
	  </Typography>
	  <Typography color="textSecondary" gutterBottom>
		If you ever need to delete an event, simply find it in <b>Events</b> -> <b>View Events</b>,
		select it's icon on the far left, and click the <b>Delete</b> button. 
		Please be aware, doing so will permanently delete the event and all of its emails/feedback.
      </Typography>
	  <img src={Help2} alt="Delete Event" className={classes.image} />
	  <br /><br />

	  <Typography variant="h6">
		How to view results of an event:
	  </Typography>
	  <Typography color="textSecondary" gutterBottom>
		After people have finished signing up for an event, you will be able to see all 
		of the emails that were entered by finding the event in <b>Events</b> -> <b>View Events</b> and clicking on "<b>View Event</b>".
      </Typography>
	  <img src={Help4} alt="View Event" className={classes.image} />
	  <Typography color="textSecondary" gutterBottom>
		The event view will look like this. From here, you have a few options:<br />
		1. <b>Participants</b> - this tab will display all the emails for the event, and allows you to request feedback from users.<br />
		2. <b>Feedback</b> - this tab will display all the feedback that users gave for the event.<br />
		3. <b>Send Email</b> - this tab allows you to send an email to everyone in the event (or to any email address(es) that you type in).<br />
      </Typography>
	  <img src={Help12} alt="Event" className={classes.image} />
	  <br /><br />

	  <Typography variant="h6">
		How to request feedback for an event:
	  </Typography>
	  <Typography color="textSecondary" gutterBottom>
		While on the "<b>Participants</b>" tab in the event view, you can click the "<b>Feedback</b>"
		or "<b>Confirm</b>" buttons for an email. This will send a request feedback email or a confirmation email to the address, respectively.
		You can only send 1 request feedback email and 1 confirmation email to each user per each event - once you have sent a feedback / confirmation
		email to a particular user, the respective button will be faded out. You can click the "<b>Send Feedback Email (All)</b>" button
		to send a request feedback email to all the users of an event, instead of having to click the Feedback button for each individual user. Lastly,
		clicking the "<b>Add Emails</b>" button will take you to the input form for entering in emails to the event.
      </Typography>
	  <img src={Help6} alt="Event Actions" className={classes.image} />
	  {/* 
	   * <Typography color="textSecondary" gutterBottom>
		While still on the "<b>Participants</b>" tab in the event view, you can upload emails to the event by clicking the "<b>Upload Emails</b>"
		button. This will allow you to select a file from your file system containing a list of emails to upload.
		The format of the file you want to upload needs to meet the following requirements:<br />
		1. Must be a <b>.csv</b> file.<br />
		2. Must have 1 email per line <b>OR</b> emails can all be on 1 line, seperated by commas.<br />
		Once you select the file, the emails will be uploaded to the system. Refresh the page to see the new emails.
      </Typography>
	  <img src={Help5 This file has been deleted} alt="Upload Emails" className={classes.image} />
	   * */}
	  <Typography color="textSecondary" gutterBottom>
		You can also download all the emails for the event by clicking the "<b>Download Emails</b>" button:
      </Typography>
	  <img src={Help7} alt="Download Emails" className={classes.image} />
	  <br /><br /> 

	  <Typography variant="h6">
		How to view feedback of an event:
	  </Typography>
	  <Typography color="textSecondary" gutterBottom>
		Click the "<b>Feedback</b>" tab while in the event view. This will take you to a pie chart that compares the positive, neutral, and negative 
		feedback the event may have received (it can be very accurate, but might not be 100% accurate all the time), as well as a bar chart displaying how many people signed up for the event, how many emails are confirmed, 
		how many request feedback email surveys were sent, and how many feedback responses were received. Beneath the charts 
		you will be able to see the actual feedback that people are giving (if they give any at all). There will be an emoji next to the feedback indicating its positivity 
		(again, the positivity might not be 100% accurate all the time). As a side note, you can click any email in the "<b>Participants</b>" or "<b>Feedback</b>" list and it will copy the email 
		address to your clipboard so that you can paste it into the "<b>Send Email</b>" tab.
      </Typography>
	  <img src={Help8} alt="Event Feedback" className={classes.image} />
	  <br /><br />

	  <Typography variant="h6">
		How to send an email to event participants:
	  </Typography>
	  <Typography color="textSecondary" gutterBottom>
		Click the "<b>Send Email</b>" tab while in the event view. This will take you to an email input form, and will automatically populate the recipient input with the 
		current event's participants. You can leave the recipients as is to send an email to everyone on the event, or you can change the recipient list by clicking the X's next to each email or by backspacing. 
		Feel free to type in any email (ANY email, it will send it), or copy an individual email from the "<b>Participants</b>" or "<b>Feedback</b>" lists and paste it into the recipient list. Fill out 
		the subject and body and then click send.
      </Typography>
	  <img src={Help9} alt="Send Email" className={classes.image} />
	  <br /><br />

	  <Typography variant="h6">
		How to view events:
	  </Typography>
	  <Typography color="textSecondary" gutterBottom>
		After you have created some events, you will be able to see them not only by going to <b>Events</b> -> <b>View Events</b> on the sidebar menu, but also by 
		clicking on the <b>Home</b> sidebar menu option. This will take you to a calendar view with all your events on it. You can click on an event on the calendar 
		to view it:
      </Typography>
	  <img src={Help10} alt="Home Calendar" className={classes.image} />
	  <br /><br />

	  <Typography variant="h6">
		How to view all emails in the system:
	  </Typography>
	  <Typography color="textSecondary" gutterBottom>
		If you ever want to view, download, or send an email to ALL the emails in the system (as opposed to only emails associated with one particular event) you 
		click on the <b>Emails</b> sidebar menu option. This will take you to a view very similar to an Event View, except this will show you ALL the emails in the 
		system. From here, you can download ALL emails, view ALL feedback, and send an email to absolutely everyone in the ststem (and of course, feel free to add/remove 
		recipients when sending emails).
      </Typography>
	  <img src={Help11} alt="View All Emails" className={classes.image} />
    </Box>
  );
}
