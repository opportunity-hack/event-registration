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
		public EmailService()
		{
		}

		public async Task<DataResponse<Event>> SendConfirmationEmail(DataInput<Participant> participant, Event currentEvent)
		{
			try
			{
				if (!currentEvent.Participants.FirstOrDefault(x => x.Email.Equals(participant.Data.Email, StringComparison.OrdinalIgnoreCase)).ConfirmSent)
				{
					var success = false;
					var clientKey = 0;
					var emailMessage = new SendGridMessage();
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

					emailMessage.AddTo(participant.Data.Email);
					emailMessage.SetTemplateData(dynamicTemplateData);

					while (!success)
					{
						var client = new SendGridClient(AppSettingsModel.appSettings.SendGridClients[clientKey].ApiKey);
						emailMessage.SetFrom(AppSettingsModel.appSettings.SendGridClients[clientKey].FromEmail, "Zuri's Circle");
						emailMessage.SetTemplateId(AppSettingsModel.appSettings.SendGridClients[clientKey].TemplateIDs[0]);
						var response = await client.SendEmailAsync(emailMessage);

						if (response.StatusCode == HttpStatusCode.Accepted || response.StatusCode == HttpStatusCode.OK)
						{
							success = true;
						}
						else if (clientKey.Equals(AppSettingsModel.appSettings.SendGridClients.Count - 1))
						{
							break;
						}
						else
						{
							++clientKey;
						}
					}

					return new DataResponse<Event>()
					{
						Success = success
					};
				}
				else
				{
					throw new Exception($"Confirmation email already sent for email: {participant.Data.Email}");
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
				var success = false;
				var clientKey = 0;
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

				while (!success)
				{
					var client = new SendGridClient(AppSettingsModel.appSettings.SendGridClients[clientKey].ApiKey);
					var emailMessage = MailHelper.CreateMultipleTemplateEmailsToMultipleRecipients
					(
						new EmailAddress(AppSettingsModel.appSettings.SendGridClients[clientKey].FromEmail, "Zuri's Circle"),
						emailList,
						AppSettingsModel.appSettings.SendGridClients[clientKey].TemplateIDs[1],
						dynamicTemplateDataList
					);
					var response = await client.SendEmailAsync(emailMessage);

					if (response.StatusCode == HttpStatusCode.Accepted || response.StatusCode == HttpStatusCode.OK)
					{
						success = true;
					}
					else if (clientKey.Equals(AppSettingsModel.appSettings.SendGridClients.Count - 1))
					{
						break;
					}
					else
					{
						++clientKey;
					}
				}

				return new DataResponse<Event>()
				{
					Success = success
				};
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

				foreach(var recipient in email.Data.Recipient_List.Distinct())
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