using NetCoreReact.Helpers;
using NetCoreReact.Models;
using NetCoreReact.Models.Documents;
using NetCoreReact.Models.DTO;
using NetCoreReact.Models.Email;
using NetCoreReact.Services.Business.Interfaces;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace NetCoreReact.Services.Business
{
	public class EmailService : IEmailService
	{
		private readonly string _sendGridApiKey;
		private readonly string _fromEmail;
		private readonly string _confirmationTemplateID;
		private readonly string _feedbackTemplateID;

		public EmailService(string aPIKey, string fromEmail, string confirmationTemplateID, string feedbackTemplateID)
		{
			this._sendGridApiKey = aPIKey;
			this._fromEmail = fromEmail;
			this._confirmationTemplateID = confirmationTemplateID;
			this._feedbackTemplateID = feedbackTemplateID;
		}

		public async Task<DataResponse<Event>> SendConfirmationEmail(DataParticipant participant, Event currentEvent)
		{
			try
			{
				var client = new SendGridClient(_sendGridApiKey);
				var emailMessage = new SendGridMessage();

				emailMessage.SetFrom("trevomoo@gmail.com");// TO DO: emailMessage.SetFrom(_fromEmail);
				emailMessage.AddTo("trevomoo@gmail.com");// TO DO: emailMessage.AddTo(participant.Participant.Email);
				emailMessage.SetTemplateId(_confirmationTemplateID);

				var jwt = TokenHelper.GenerateToken("trevomoo@gmail.com", AppSettingsModel.appSettings.ConfirmEmailJwtSecret, currentEvent.Id);// TO DO: var jwt = TokenHelper.GenerateToken(participant.Participant.Email, AppSettingsModel.appSettings.ConfirmEmailJwtSecret, currentEvent.Id);
				var dynamicTemplateData = new EmailTemplateData
				{
					Event_Name = currentEvent.Title,
					Confirm_Url = $"https://localhost:44384/confirm?token={jwt}"
					// TO DO: Confirm_Url = $"LIVEURL/confirm?token={jwt}"
				};

				emailMessage.SetTemplateData(dynamicTemplateData);
				var response = await client.SendEmailAsync(emailMessage);

				if (response.StatusCode == HttpStatusCode.Accepted)
				{
					return new DataResponse<Event>()
					{
						Success = true
					};
				}
				else
				{
					return new DataResponse<Event>()
					{
						Success = false,
						Errors = new Dictionary<string, List<string>>()
						{
							["*"] = new List<string> { "An exception occurred, please try again." },
						}
					};
				}
			}
			catch (Exception e)
			{
				throw e;
			}
		}

		public async Task<DataResponse<Event>> SendFeedbackEmail(Event currentEvent)
		{
			try
			{
				var client = new SendGridClient(_sendGridApiKey);
				var emailList = new List<EmailAddress>();
				var dynamicTemplateDataList = new List<object>();

				// TO DO:
				/**
				foreach(var participant in currentEvent.Participants)
				{
					emailList.Add(new EmailAddress(participant.Email));
					var jwt = TokenHelper.GenerateToken(participant.Email, AppSettingsModel.appSettings.ConfirmEmailJwtSecret, currentEvent.Id);
					dynamicTemplateDataList.Add
					(
						new EmailTemplateData
						{
							Event_Name = currentEvent.Title,
							Feedback_Url = $"https://localhost:44384/feedback?token={jwt}"
							// TO DO: Confirm_Url = $"LIVEURL/feedback?token={jwt}"
						}
					);
				}
				**/

				emailList.Add(new EmailAddress("trevomoo@gmail.com"));
				emailList.Add(new EmailAddress("carterlrice@gmail.com"));
				emailList.Add(new EmailAddress("jordanr3@live.com"));
				var jwt1 = TokenHelper.GenerateToken("trevomoo@gmail.com", AppSettingsModel.appSettings.ConfirmEmailJwtSecret, currentEvent.Id);
				dynamicTemplateDataList.Add
					(
						new EmailTemplateData
						{
							Event_Name = currentEvent.Title,
							Feedback_Url = $"https://localhost:44384/feedback?token={jwt1}"
						}
					);
				var jwt2 = TokenHelper.GenerateToken("carterlrice@gmail.com", AppSettingsModel.appSettings.ConfirmEmailJwtSecret, currentEvent.Id);
				dynamicTemplateDataList.Add
					(
						new EmailTemplateData
						{
							Event_Name = currentEvent.Title,
							Feedback_Url = $"https://localhost:44384/feedback?token={jwt2}"
						}
					);
				var jwt3 = TokenHelper.GenerateToken("jordanr3@live.com", AppSettingsModel.appSettings.ConfirmEmailJwtSecret, currentEvent.Id);
				dynamicTemplateDataList.Add
					(
						new EmailTemplateData
						{
							Event_Name = currentEvent.Title,
							Feedback_Url = $"https://localhost:44384/feedback?token={jwt3}"
						}
					);

				var emailMessage = MailHelper.CreateMultipleTemplateEmailsToMultipleRecipients
				(
					new EmailAddress("trevomoo@gmail.com"),// TO DO: new EmailAddress(_fromEmail),
					emailList,
					_feedbackTemplateID,
					dynamicTemplateDataList
				);

				var response = await client.SendEmailAsync(emailMessage);

				if (response.StatusCode == HttpStatusCode.Accepted)
				{
					return new DataResponse<Event>()
					{
						Success = true
					};
				}
				else
				{
					return new DataResponse<Event>()
					{
						Success = false,
						Errors = new Dictionary<string, List<string>>()
						{
							["*"] = new List<string> { "An exception occurred while trying to send feedback emails, please try again." },
						}
					};
				}
			}
			catch (Exception e)
			{
				throw e;
			}
		}
	}
}
