using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NetCoreReact.Helpers;
using NetCoreReact.Models.Documents;
using NetCoreReact.Models.DTO;
using NetCoreReact.Services.Business;
using NetCoreReact.Services.Business.Interfaces;

namespace NetCoreReact.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class EmailController : ControllerBase
	{
		private readonly IEventService _eventService;
		private readonly IEmailService _emailService;
		private readonly IAuthenticationService _authenticationService;

		public EmailController(IEventService eventService, IEmailService emailService, IAuthenticationService authenticationService)
		{
			this._eventService = eventService;
			this._emailService = emailService;
			this._authenticationService = authenticationService;
		}

		[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
		[HttpPost("[action]")]
		public async Task<DataResponse<Event>> AddEmail([FromBody] DataInput<Participant> newParticipant)
		{
			try
			{
				var response = await _eventService.AddParticipant(newParticipant);
				var currentEvent = await _eventService.GetEvent(newParticipant.EventId);
				var email = await _emailService.SendConfirmationEmail(newParticipant, currentEvent.Data.FirstOrDefault());
				return email;
			}
			catch (Exception ex)
			{
				LoggerHelper.Log(ex);
				return new DataResponse<Event>()
				{
					Errors = new Dictionary<string, List<string>>()
					{
						["*"] = new List<string> { "An exception occurred, please try again." },
					},
					Success = false
				};
			}
		}

		[HttpPost("[action]")]
		public async Task<DataResponse<Event>> ConfirmEmail([FromBody] DataInput<string> token)
		{
			try
			{
				var response = _authenticationService.AuthenticateConfirmEmailToken(token.Data);
				var currentEvent = await _eventService.ConfirmEmail(response.Data[0], response.Data[1]);
				return currentEvent;
			}
			catch (Exception ex)
			{
				LoggerHelper.Log(ex);
				return new DataResponse<Event>()
				{
					Data = new List<Event>(),
					Errors = new Dictionary<string, List<string>>()
					{
						["*"] = new List<string> { "An exception occurred, please try again." },
					},
					Success = false
				};
			}
		}

		[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
		[HttpGet("[action]")]
		public async Task<DataResponse<Event>> SendFeedbackEmail(string eventID)
		{
			try
			{
				var currentEvent = await _eventService.GetEvent(eventID);
				var sendFeedback = await _emailService.SendFeedbackEmail(currentEvent.Data.FirstOrDefault());
				return sendFeedback;
			}
			catch (Exception ex)
			{
				LoggerHelper.Log(ex);
				return new DataResponse<Event>()
				{
					Data = new List<Event>(),
					Errors = new Dictionary<string, List<string>>()
					{
						["*"] = new List<string> { "An exception occurred, please try again." },
					},
					Success = false
				};
			}
		}
	}
}