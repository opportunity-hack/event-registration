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
		private readonly string _confirmationTemplateID;
		private readonly string _feedbackTemplateID;
		public EmailService(string aPIKey, string confirmationTemplateID, string feedbackTemplateID)
		{
			this._sendGridApiKey = aPIKey;
			this._confirmationTemplateID = confirmationTemplateID;
			this._feedbackTemplateID = feedbackTemplateID;
		}

		public async Task<Models.DTO.Response> SendConfirmationEmail(Email email)
		{
			try
			{
				var client = new SendGridClient(_sendGridApiKey);
				var emailMessage = new SendGridMessage();
				emailMessage.SetFrom(email.From);
				emailMessage.AddTo(email.To.FirstOrDefault());
				emailMessage.SetTemplateId(_confirmationTemplateID);

				var dynamicTemplateData = new EmailTemplateData
				{
					Event_Name = "Fucking 'Ell",
					Confirm_Url = "https://www.youtube.com/watch?v=oHg5SJYRHA0"
				};

				emailMessage.SetTemplateData(dynamicTemplateData);
				var response = await client.SendEmailAsync(emailMessage);


				// for sending feedback
				//var emailMessage = MailHelper.CreateMultipleTemplateEmailsToMultipleRecipients(email.From, email.To, email.Subject, email.PlainTextContent, email.HtmlContent, new List<Dictionary<string, string>>());
				//var response = await client.SendEmailAsync(emailMessage);

				if (response.StatusCode == HttpStatusCode.Accepted)
				{
					return new Models.DTO.Response()
					{
						Success = true
					};
				}
				else
				{
					return new Models.DTO.Response()
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
	}
}
