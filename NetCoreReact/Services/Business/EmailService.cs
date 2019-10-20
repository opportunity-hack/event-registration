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
				emailMessage.AddTo("jordanr3@live.com");// TO DO: emailMessage.AddTo(participant.Participant.Email);
				emailMessage.SetTemplateId(_confirmationTemplateID);

				var jwt = TokenHelper.GenerateToken("jordanr3@live.com", AppSettingsModel.appSettings.ConfirmEmailJwtSecret, currentEvent.Id);// TO DO: var jwt = TokenHelper.GenerateToken(participant.Participant.Email, AppSettingsModel.appSettings.ConfirmEmailJwtSecret, currentEvent.Id);
				var dynamicTemplateData = new EmailTemplateData
				{
					Event_Name = currentEvent.Title,
					Confirm_Url = $"http://localhost:44384/confirm?token={jwt}"
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

				// for sending feedback
				//var emailMessage = MailHelper.CreateMultipleTemplateEmailsToMultipleRecipients(email.From, email.To, email.Subject, email.PlainTextContent, email.HtmlContent, new List<Dictionary<string, string>>());
				//var response = await client.SendEmailAsync(emailMessage);
			}
			catch (Exception e)
			{
				throw e;
			}
		}
	}
}
