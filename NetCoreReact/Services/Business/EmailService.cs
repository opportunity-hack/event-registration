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

		public async Task<DataResponse<Event>> SendConfirmationEmail(string email, Event currentEvent)
		{
			try
			{
				var allClientsFailed = false;
				var success = false;
				var clientKey = 0;
				var client = new SendGridClient(AppSettingsModel.appSettings.SendGridClients[clientKey].ApiKey);
				var participants = currentEvent.Participants.Where(x => x.ConfirmSent.Equals(false)).ToList();
				string confirmJwt = string.Empty;
				string removeJwt = string.Empty;
				SendGridMessage emailMessage = null;
				SendGrid.Response response = null;

				if (string.IsNullOrEmpty(email))
				{
					currentEvent.SentConfirm = true;
				}
				else
				{
					participants = participants.Where(x => x.Email.Equals(email, StringComparison.OrdinalIgnoreCase)).ToList();
				}

				foreach (var participant in participants)
				{
					if (allClientsFailed)
					{
						break;
					}

					success = false;
					confirmJwt = TokenHelper.GenerateToken(participant.Email, AppSettingsModel.appSettings.ConfirmEmailJwtSecret, currentEvent.Id);
					removeJwt = TokenHelper.GenerateToken(participant.Email, AppSettingsModel.appSettings.RemoveEmailJwtSecret, currentEvent.Id);

					while (!success)
					{
						emailMessage = MailHelper.CreateSingleTemplateEmail
						(
							new EmailAddress(AppSettingsModel.appSettings.SendGridClients[clientKey].FromEmail, "Zuri's Circle"),
							new EmailAddress(participant.Email),
							AppSettingsModel.appSettings.SendGridClients[clientKey].TemplateIDs[0],
							new EmailTemplateData
							{
								Event_Name = currentEvent.Title,
								User_Name = participant.Name,
								Confirm_Url = $"https://localhost:44384/confirm?token={confirmJwt}",
								Remove_Email_Url = $"https://localhost:44384/remove-email?token={removeJwt}"
								//Confirm_Url = $"https://zurisdashboard.azurewebsites.net/confirm?token={confirmJwt}",
								//Remove_Email_Url = $"https://zurisdashboard.azurewebsites.net/remove-email?token={removeJwt}"
							}
						);

						response = await client.SendEmailAsync(emailMessage);

						if (response.StatusCode == HttpStatusCode.Accepted || response.StatusCode == HttpStatusCode.OK)
						{
							participant.ConfirmSent = true;
							success = true;
						}
						else if (clientKey.Equals(AppSettingsModel.appSettings.SendGridClients.Count - 1))
						{
							allClientsFailed = true;
							break;
						}
						else
						{
							client = new SendGridClient(AppSettingsModel.appSettings.SendGridClients[++clientKey].ApiKey);
						}
					}
				}

				if (allClientsFailed)
				{
					return new DataResponse<Event>()
					{
						Data = new List<Event> { currentEvent },
						Errors = new Dictionary<string, List<string>>()
						{
							["*"] = new List<string> { "Some or all emails failed to send. Daily email limit may have been reached." },
						},
						Success = false
					};
				}

				return new DataResponse<Event>()
				{
					Data = new List<Event> { currentEvent },
					Success = true
				};
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
				var allClientsFailed = false;
				var success = false;
				var clientKey = 0;
				var client = new SendGridClient(AppSettingsModel.appSettings.SendGridClients[clientKey].ApiKey);
				var participants = currentEvent.Participants.Where(x => x.FeedbackSent.Equals(false)).ToList();
				string feedbackJwt = string.Empty;
				string removeJwt = string.Empty;
				SendGridMessage emailMessage = null;
				SendGrid.Response response = null;

				if (string.IsNullOrEmpty(email))
				{
					currentEvent.SentFeedback = true;
				}
				else 
				{
					participants = participants.Where(x => x.Email.Equals(email, StringComparison.OrdinalIgnoreCase)).ToList();
				}

				foreach(var participant in participants)
				{
					if (allClientsFailed)
					{
						break;
					}

					success = false;
					feedbackJwt = TokenHelper.GenerateToken(participant.Email, AppSettingsModel.appSettings.FeedbackJwtSecret, currentEvent.Id);
					removeJwt = TokenHelper.GenerateToken(participant.Email, AppSettingsModel.appSettings.RemoveEmailJwtSecret, currentEvent.Id);

					while (!success)
					{
						emailMessage = MailHelper.CreateSingleTemplateEmail
						(
							new EmailAddress(AppSettingsModel.appSettings.SendGridClients[clientKey].FromEmail, "Zuri's Circle"),
							new EmailAddress(participant.Email),
							AppSettingsModel.appSettings.SendGridClients[clientKey].TemplateIDs[1],
							new EmailTemplateData
							{
								Event_Name = currentEvent.Title,
								User_Name = participant.Name,
								Feedback_Url = $"https://localhost:44384/feedback?token={feedbackJwt}",
								Remove_Email_Url = $"https://localhost:44384/remove-email?token={removeJwt}"
								//Feedback_Url = $"https://zurisdashboard.azurewebsites.net/feedback?token={feedbackJwt}",
								//Remove_Email_Url = $"https://zurisdashboard.azurewebsites.net/remove-email?token={removeJwt}"
							}
						);

						response = await client.SendEmailAsync(emailMessage);

						if (response.StatusCode == HttpStatusCode.Accepted || response.StatusCode == HttpStatusCode.OK)
						{
							participant.FeedbackSent = true;
							success = true;
						}
						else if (clientKey.Equals(AppSettingsModel.appSettings.SendGridClients.Count - 1))
						{
							allClientsFailed = true;
							break;
						}
						else
						{
							client = new SendGridClient(AppSettingsModel.appSettings.SendGridClients[++clientKey].ApiKey);
						}
					}
				}

				if (allClientsFailed)
				{
					return new DataResponse<Event>()
					{
						Data = new List<Event> { currentEvent },
						Errors = new Dictionary<string, List<string>>()
						{
							["*"] = new List<string> { "Some or all emails failed to send. Daily email limit may have been reached." },
						},
						Success = false
					};
				}

				return new DataResponse<Event>()
				{
					Data = new List<Event> { currentEvent },
					Success = true
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
				var allClientsFailed = false;
				var success = false;
				var clientKey = 0;
				var client = new SendGridClient(AppSettingsModel.appSettings.SendGridClients[clientKey].ApiKey);
				string removeJwt = string.Empty;
				SendGridMessage emailMessage = null;
				SendGrid.Response response = null;

				foreach (var recipient in email.Data.Recipient_List)//.Distinct())
				{
					if (allClientsFailed)
					{
						break;
					}

					success = false;
					removeJwt = TokenHelper.GenerateToken(recipient, AppSettingsModel.appSettings.RemoveEmailJwtSecret, string.Empty);

					while (!success)
					{
						emailMessage = MailHelper.CreateSingleTemplateEmail
						(
							new EmailAddress(AppSettingsModel.appSettings.SendGridClients[clientKey].FromEmail, "Zuri's Circle"),
							new EmailAddress(recipient),
							AppSettingsModel.appSettings.SendGridClients[clientKey].TemplateIDs[2],
							new EmailTemplateData
							{
								Title_Header = email.Data.Title_Header,
								Body_Copy = email.Data.Body_Copy,
								Remove_Email_Url = $"https://localhost:44384/remove-email?token={removeJwt}"
								//Remove_Email_Url = $"https://zurisdashboard.azurewebsites.net/remove-email?token={removeJwt}"
							}
						);

						response = await client.SendEmailAsync(emailMessage);

						if (response.StatusCode == HttpStatusCode.Accepted || response.StatusCode == HttpStatusCode.OK)
						{
							success = true;
						}
						else if (clientKey.Equals(AppSettingsModel.appSettings.SendGridClients.Count - 1))
						{
							allClientsFailed = true;
							break;
						}
						else
						{
							client = new SendGridClient(AppSettingsModel.appSettings.SendGridClients[++clientKey].ApiKey);
						}
					}
				}

				if (allClientsFailed)
				{
					return new DataResponse<Event>()
					{
						Errors = new Dictionary<string, List<string>>()
						{
							["*"] = new List<string> { "Some or all emails failed to send. Daily email limit may have been reached." },
						},
						Success = false
					};
				}

				return new DataResponse<Event>()
				{
					Success = true
				};
			}
			catch (Exception e)
			{
				throw e;
			}
		}
	}
}