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
		private readonly string _genericTemplateID;

		public EmailService(string aPIKey, string fromEmail, string confirmationTemplateID, string feedbackTemplateID, string genericTemplateID)
		{
			this._sendGridApiKey = aPIKey;
			this._fromEmail = fromEmail;
			this._confirmationTemplateID = confirmationTemplateID;
			this._feedbackTemplateID = feedbackTemplateID;
			this._genericTemplateID = genericTemplateID;
		}

		public async Task<DataResponse<Event>> SendConfirmationEmail(DataInput<Participant> participant, Event currentEvent)
		{
			try
			{
				var client = new SendGridClient(_sendGridApiKey);
				var emailMessage = new SendGridMessage();

				emailMessage.SetFrom(_fromEmail, "Zuri's Circle");
				emailMessage.AddTo(participant.Data.Email);
				emailMessage.SetTemplateId(_confirmationTemplateID);

				var confirmJwt = TokenHelper.GenerateToken(participant.Data.Email, AppSettingsModel.appSettings.ConfirmEmailJwtSecret, currentEvent.Id);
				var removeJwt = TokenHelper.GenerateToken(participant.Data.Email, AppSettingsModel.appSettings.RemoveEmailJwtSecret, currentEvent.Id);
				var dynamicTemplateData = new EmailTemplateData
				{
					Event_Name = currentEvent.Title,
					//Confirm_Url = $"https://localhost:44384/confirm?token={confirmJwt}",
					//Remove_Email_Url = $"https://localhost:44384/remove-email?token={removeJwt}"
					Confirm_Url = $"https://zurisdashboard.azurewebsites.net/confirm?token={confirmJwt}",
					Remove_Email_Url = $"https://zurisdashboard.azurewebsites.net/remove-email?token={removeJwt}"
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
					throw new Exception("Email(s) failed to send.");
				}
			}
			catch (Exception e)
			{
				throw e;
			}
		}

		public async Task<DataResponse<Event>> SendFeedbackEmail(string email, Event currentEvent)
		{
			try
			{
				var client = new SendGridClient(_sendGridApiKey);
				var emailList = new List<EmailAddress>();
				var dynamicTemplateDataList = new List<object>();
				var participants = currentEvent.Participants.Where(x => x.FeedbackSent.Equals(false)).ToList();

				if (!string.IsNullOrEmpty(email))
				{
					participants = participants.Where(x => x.Email.Equals(email, StringComparison.OrdinalIgnoreCase)).ToList();
				}

				foreach(var participant in participants)
				{
					emailList.Add(new EmailAddress(participant.Email));
					var feedbackJwt = TokenHelper.GenerateToken(participant.Email, AppSettingsModel.appSettings.FeedbackJwtSecret, currentEvent.Id);
					var removeJwt = TokenHelper.GenerateToken(participant.Email, AppSettingsModel.appSettings.RemoveEmailJwtSecret, currentEvent.Id);
					dynamicTemplateDataList.Add
					(
						new EmailTemplateData
						{
							Event_Name = currentEvent.Title,
							//Feedback_Url = $"https://localhost:44384/feedback?token={feedbackJwt}",
							//Remove_Email_Url = $"https://localhost:44384/remove-email?token={removeJwt}"
							Feedback_Url = $"https://zurisdashboard.azurewebsites.net/feedback?token={feedbackJwt}",
							Remove_Email_Url = $"https://zurisdashboard.azurewebsites.net/remove-email?token={removeJwt}"
						}
					);
				}

				var emailMessage = MailHelper.CreateMultipleTemplateEmailsToMultipleRecipients
				(
					new EmailAddress(_fromEmail, "Zuri's Circle"),
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
					throw new Exception("Email(s) failed to send.");
				}
			}
			catch (Exception e)
			{
				throw e;
			}
		}

		public async Task<DataResponse<Event>> SendGenericEmail(DataInput<EmailTemplateData> email)
		{
			try
			{
				var client = new SendGridClient(_sendGridApiKey);
				var emailList = new List<EmailAddress>();
				var dynamicTemplateDataList = new List<object>();

				foreach(var recipient in email.Data.Recipient_List)
				{
					emailList.Add(new EmailAddress(recipient));
					var removeJwt = TokenHelper.GenerateToken(recipient, AppSettingsModel.appSettings.RemoveEmailJwtSecret, string.Empty);
					dynamicTemplateDataList.Add
					(
						new EmailTemplateData
						{
							Title_Header = email.Data.Title_Header,
							Body_Copy = email.Data.Body_Copy,
							//Remove_Email_Url = $"https://localhost:44384/remove-email?token={removeJwt}"
							Remove_Email_Url = $"https://zurisdashboard.azurewebsites.net/remove-email?token={removeJwt}"
						}
					);
				}

				var emailMessage = MailHelper.CreateMultipleTemplateEmailsToMultipleRecipients
				(
					new EmailAddress(_fromEmail, "Zuri's Circle"),
					emailList,
					_genericTemplateID,
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
					throw new Exception("Email(s) failed to send.");
				}
			}
			catch (Exception e)
			{
				throw e;
			}
		}
	}
}