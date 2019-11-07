using NetCoreReact.Helpers;
using NetCoreReact.Models;
using NetCoreReact.Models.Documents;
using NetCoreReact.Models.DTO;
using NetCoreReact.Models.Email;
using NetCoreReact.Services.Business.Interfaces;
using RestSharp;
using RestSharp.Authenticators;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace NetCoreReact.Services.Business
{
	public class EmailService : IEmailService
	{
		private readonly string _apiKey;
		private readonly string _baseUrl;
		private readonly string _domain;

		public EmailService(string apiKey, string baseUrl, string domain)
		{
			this._apiKey = apiKey;
			this._baseUrl = baseUrl;
			this._domain = domain;
		}

		private string BuildRecipientVariables(List<Participant> participants, Event currentEvent = null, string title = "", string body = "", bool isGeneric = false)
		{
			var confirmJwt = string.Empty; 
			var feedbackJwt = string.Empty;
			var removeJwt = string.Empty;

			var stringBuilder = new StringBuilder();
			var length = participants?.Count ?? 0;
			stringBuilder.Append("{");

			for (int i=0; i<length; i++)
			{
				confirmJwt = TokenHelper.GenerateToken(participants[i]?.Email ?? string.Empty, AppSettingsModel.appSettings.ConfirmEmailJwtSecret, currentEvent?.Id ?? string.Empty);
				feedbackJwt = TokenHelper.GenerateToken(participants[i]?.Email ?? string.Empty, AppSettingsModel.appSettings.FeedbackJwtSecret, currentEvent?.Id ?? string.Empty);
				removeJwt = TokenHelper.GenerateToken(participants[i]?.Email ?? string.Empty, AppSettingsModel.appSettings.RemoveEmailJwtSecret, currentEvent?.Id ?? string.Empty);
				stringBuilder.Append($"\"{participants[i]?.Email ?? string.Empty}\":" +
				$"{{" +
					$"\"User_Name\": \"{participants[i]?.Name ?? string.Empty}\"," +
					$"\"Event_Name\": \"{currentEvent?.Title ?? string.Empty}\"," +
					// UNCOMMENT FOR LIVE:
					$"\"Confirm_Url\": \"https://zurisdashboard.azurewebsites.net/confirm?token={confirmJwt}\"," +
					$"\"Feedback_Url\": \"https://zurisdashboard.azurewebsites.net/feedback?token={feedbackJwt}\"," +
					$"\"Remove_Email_Url\": \"https://zurisdashboard.azurewebsites.net/remove-email?token={removeJwt}\"," +
					// COMMENT LINES FOR LIVE:
					//$"\"Confirm_Url\": \"https://localhost:44384/confirm?token={confirmJwt}\"," +
					//$"\"Feedback_Url\": \"https://localhost:44384/feedback?token={feedbackJwt}\"," +
					//$"\"Remove_Email_Url\": \"https://localhost:44384/remove-email?token={removeJwt}\"," +
					$"\"Title_Header\": \"{title}\"," +
					$"\"Body_Copy\": \"{body}\"" +
				$"}}");

				if (i<length-1)
				{
					stringBuilder.Append(",");
				}
			}

			if (isGeneric)
			{
				stringBuilder.Append(",");
				// UNCOMMENT FOR LIVE:
				stringBuilder.Append($"\"zuriscircle.mbc@gmail.com\":" +
				// COMMENT THIS LINE FOR LIVE:
				//stringBuilder.Append($"\"tmoore82@my.gcu.edu\":" +
				$"{{" +
					$"\"Title_Header\": \"{title}\"," +
					$"\"Body_Copy\": \"{body}\"" +
				$"}}");
			}

			stringBuilder.Append("}");
			return stringBuilder.ToString();
		}


		public async Task<DataResponse<Event>> SendConfirmationEmail(string email, Event currentEvent)
		{
			var client = new RestClient();
			var success = 0;

			try
			{
				var participants = currentEvent.Participants.Where(x => x.ConfirmSent.Equals(false)).ToList();
				if (string.IsNullOrEmpty(email))
				{
					currentEvent.SentConfirm = true;
				}
				else
				{
					participants = participants.Where(x => x.Email.Equals(email, StringComparison.OrdinalIgnoreCase)).ToList();
				}

				var participantLists = ListHelper.splitList(participants);
				foreach (var participantList in participantLists)
				{
					var request = new RestRequest();
					var response = new RestResponse();
					var tcs = new TaskCompletionSource<IRestResponse>();
					client.BaseUrl = new Uri(this._baseUrl);
					client.Authenticator = new HttpBasicAuthenticator("api", this._apiKey);
					request.AddParameter("domain", this._domain, ParameterType.UrlSegment);
					request.Resource = $"{this._domain}/messages";
					request.AddParameter("from", "Zuri's Circle <zuriscircle@zurisdashboard.org>");
					foreach(var participant in participantList)
					{
						request.AddParameter("to", participant.Email);
						participant.ConfirmSent = true;
					}
					request.AddParameter("subject", "Thanks for coming!");
					request.AddParameter("template", "thanksandconfirmation");
					request.AddParameter("recipient-variables", BuildRecipientVariables(participantList, currentEvent));
					request.Method = Method.POST;
					client.ExecuteAsync(request, response => {
						tcs.SetResult(response);
					});
					response = await tcs.Task as RestResponse;

					if (response.StatusCode == HttpStatusCode.Accepted || response.StatusCode == HttpStatusCode.OK || response.ResponseStatus == ResponseStatus.Completed)
					{
						++success;
					}
				}

				if (success.Equals(participantLists.ToList().Count))
				{
					return new DataResponse<Event>()
					{
						Data = new List<Event> { currentEvent },
						Success = true
					};
				}
				else
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
			}
			catch (Exception e)
			{
				throw e;
			}
		}

		public async Task<DataResponse<Event>> SendFeedbackEmail(string email, Event currentEvent)
		{
			var client = new RestClient();
			var success = 0;

			try
			{
				var participants = currentEvent.Participants.Where(x => x.FeedbackSent.Equals(false)).ToList();
				if (string.IsNullOrEmpty(email))
				{
					currentEvent.SentFeedback = true;
				}
				else
				{
					participants = participants.Where(x => x.Email.Equals(email, StringComparison.OrdinalIgnoreCase)).ToList();
				}

				var participantLists = ListHelper.splitList(participants);
				foreach (var participantList in participantLists)
				{
					var request = new RestRequest();
					var response = new RestResponse();
					var tcs = new TaskCompletionSource<IRestResponse>();
					client.BaseUrl = new Uri(this._baseUrl);
					client.Authenticator = new HttpBasicAuthenticator("api", this._apiKey);
					request.AddParameter("domain", this._domain, ParameterType.UrlSegment);
					request.Resource = $"{this._domain}/messages";
					request.AddParameter("from", "Zuri's Circle <zuriscircle@zurisdashboard.org>");
					foreach (var participant in participantList)
					{
						request.AddParameter("to", participant.Email);
						participant.FeedbackSent = true;
					}
					request.AddParameter("subject", "How did we do?");
					request.AddParameter("template", "feedback");
					request.AddParameter("recipient-variables", BuildRecipientVariables(participantList, currentEvent));
					request.Method = Method.POST;
					client.ExecuteAsync(request, response => {
						tcs.SetResult(response);
					});
					response = await tcs.Task as RestResponse;

					if (response.StatusCode == HttpStatusCode.Accepted || response.StatusCode == HttpStatusCode.OK || response.ResponseStatus == ResponseStatus.Completed)
					{
						++success;
					}
				}

				if (success.Equals(participantLists.ToList().Count))
				{
					return new DataResponse<Event>()
					{
						Data = new List<Event> { currentEvent },
						Success = true
					};
				}
				else
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
			}
			catch (Exception e)
			{
				throw e;
			}
		}

		public async Task<DataResponse<Event>> SendGenericEmail(DataInput<EmailTemplateData> email)
		{
			var client = new RestClient();
			var success = 0;

			try
			{
				var participants = email.Data.Recipient_List.Distinct().Select(x => new Participant() { Email = x }).ToList();

				var participantLists = ListHelper.splitList(participants);
				foreach (var participantList in participantLists)
				{
					var request = new RestRequest();
					var response = new RestResponse();
					var tcs = new TaskCompletionSource<IRestResponse>();
					client.BaseUrl = new Uri(this._baseUrl);
					client.Authenticator = new HttpBasicAuthenticator("api", this._apiKey);
					request.AddParameter("domain", this._domain, ParameterType.UrlSegment);
					request.Resource = $"{this._domain}/messages";
					request.AddParameter("from", "Zuri's Circle <zuriscircle@zurisdashboard.org>");
					foreach (var participant in participantList)
					{
						request.AddParameter("to", participant.Email);
					}
					// UNCOMMENT FOR LIVE:
					request.AddParameter("bcc", "zuriscircle.mbc@gmail.com");
					// COMMENT THIS LINE FOR LIVE:
					//request.AddParameter("bcc", "tmoore82@my.gcu.edu");
					request.AddParameter("subject", "Zuri's Circle");
					request.AddParameter("template", "generic");
					request.AddParameter("recipient-variables", BuildRecipientVariables(participantList, title: email.Data.Title_Header, body: email.Data.Body_Copy, isGeneric: true));
					request.Method = Method.POST;
					client.ExecuteAsync(request, response => {
						tcs.SetResult(response);
					});
					response = await tcs.Task as RestResponse;

					if (response.StatusCode == HttpStatusCode.Accepted || response.StatusCode == HttpStatusCode.OK || response.ResponseStatus == ResponseStatus.Completed)
					{
						++success;
					}
				}

				if (success.Equals(participantLists.ToList().Count))
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
						Errors = new Dictionary<string, List<string>>()
						{
							["*"] = new List<string> { "Some or all emails failed to send. Daily email limit may have been reached." },
						},
						Success = false
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