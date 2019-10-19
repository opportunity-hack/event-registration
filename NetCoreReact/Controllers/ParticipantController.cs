﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NetCoreReact.Helpers;
using NetCoreReact.Models.DTO;
using NetCoreReact.Services.Business.Interfaces;

namespace NetCoreReact.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class ParticipantController : ControllerBase
	{
		private readonly IEventService _eventService;
		// todo email service

		public ParticipantController(IEventService eventService)
		{
			this._eventService = eventService;
			// todo email service
		}

		[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
		[HttpPost("[action]")]
		public async Task<Response> AddParticipant([FromBody] DataParticipant newParticipant)
		{
			try
			{
				return await _eventService.AddParticipant(newParticipant);
				// todo email service
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