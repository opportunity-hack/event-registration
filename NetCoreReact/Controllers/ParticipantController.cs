using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NetCoreReact.Helpers;
using NetCoreReact.Models.DTO;
using NetCoreReact.Models.Email;
using NetCoreReact.Services.Business.Interfaces;

namespace NetCoreReact.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class ParticipantController : ControllerBase
	{
		private readonly IEventService _eventService;
		private readonly IEmailService _emailService;

		public ParticipantController(IEventService eventService, IEmailService emailService)
		{
			this._eventService = eventService;
			this._emailService = emailService;
		}

		[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
		[HttpPost("[action]")]
		public async Task<Response> AddParticipant([FromBody] DataParticipant newParticipant)
		{
			try
			{
				var response = await _eventService.AddParticipant(newParticipant);
				var email = await _emailService.SendConfirmationEmail(new Email());
				return response;
			}
			catch (Exception ex)
			{
				LoggerHelper.Log(ex);
				return new Response()
				{
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
