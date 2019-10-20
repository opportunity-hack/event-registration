using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NetCoreReact.Helpers;
using NetCoreReact.Models.Documents;
using NetCoreReact.Models.DTO;
using NetCoreReact.Models.ML;
using NetCoreReact.Services.Business;
using NetCoreReact.Services.Business.Interfaces;
using NetCoreReact.Services.ML.Interfaces;

namespace NetCoreReact.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventController : ControllerBase
    {
		private readonly IEventService _eventService;
		private readonly IPredictionService _predictionService;
		private readonly IAuthenticationService _authenticationService;

		public EventController(IEventService eventService, IPredictionService predictionService, IAuthenticationService authenticationService)
		{
			this._eventService = eventService;
			this._predictionService = predictionService;
			this._authenticationService = authenticationService;
		}

		[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
		[HttpPost("[action]")]
		public async Task<DataResponse<Event>> CreateEvent([FromBody] DataInput<Event> newEvent)
		{
			try
			{
				return await _eventService.CreateEvent(newEvent);
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
		public async Task<DataResponse<Event>> GetEvent(string eventID)
		{
			try
			{
				return await _eventService.GetEvent(eventID);
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
		[HttpPost("[action]")]
		public async Task<DataResponse<Event>> DeleteEvent([FromBody] DataInput<string> deleteEvent)
		{
			try
			{
				return await _eventService.DeleteEvent(deleteEvent.Data);
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
		public async Task<DataResponse<Event>> GetAllEvents()
		{
			try
			{
				return await _eventService.GetAllEvents();
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
		public async Task<DataResponse<Event>> GetUpcomingEvents()
		{
			try
			{
				return await _eventService.GetUpcomingEvents();
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
		public async Task<DataResponse<Event>> GetPastEvents()
		{
			try
			{
				return await _eventService.GetPastEvents();
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

		[HttpPost("[action]")]
		public async Task<DataResponse<Event>> PostFeedbackResponse([FromBody] DataInput<Feedback> feedback)
		{
			try
			{
				var authenticate = _authenticationService.AuthenticateConfirmEmailToken(feedback.Data.Token);
				feedback.Data.Email = authenticate.Data[0];

				if (!string.IsNullOrEmpty(feedback.Data.Body))
				{
					var analysis = _predictionService.Predict(new PredictionInput() { Sentiment = feedback.Data.Body });
					feedback.Data.IsPositive = analysis.Prediction;
					feedback.Data.Score = analysis.Score;
				}

				var response = await _eventService.AddFeedback(feedback);
				return response;
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
	}
}