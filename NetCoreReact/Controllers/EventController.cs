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

		public EventController(IEventService eventService, IPredictionService predictionService)
		{
			this._eventService = eventService;
			this._predictionService = predictionService;
		}
		/**
		[HttpGet("[action]")]
		public async Task<ParticipantsModel> UnauthenticatedSampleGet()
		{
			try
			{
				return await _eventService.UnauthenticatedSampleGet();
			}
			catch (Exception ex)
			{
				LoggerHelper.Log(ex);
				return new ParticipantsModel();
			}
		}

		[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
		[HttpPost("[action]")]
		public async Task<PresentModel> AuthenticatedSampleGet(string name)
		{
			try
			{
				return await _eventService.AuthenticatedSampleGet(name);
			}
			catch (Exception ex)
			{
				LoggerHelper.Log(ex);
				return new PresentModel();
			}
		}

		[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
		[HttpPost("[action]")]
		public async Task<eResponse> AuthenticatedSamplePost([FromBody] InputModel user)
		{
			try
			{
				// Example of making single ML predictions:
				var result1 = _predictionService.Predict(new PredictionInput() { Sentiment = "I hated this so much" });
				var result2 = _predictionService.Predict(new PredictionInput() { Sentiment = "I loved this a lot it was absolutely amazing, great job!" });
				var result3 = _predictionService.Predict(new PredictionInput() { Sentiment = "I dont think that was fun" });
				var result4 = _predictionService.Predict(new PredictionInput() { Sentiment = "I'm sort of indifferent about it" });
				var result5 = _predictionService.Predict(new PredictionInput() { Sentiment = "This sucked worst experience ever, never coming back." });
				var result6 = _predictionService.Predict(new PredictionInput() { Sentiment = "This was so awesome I loved it!" });
                var inputResult = _predictionService.Predict(new PredictionInput() { Sentiment = user.Wishlist });

				// Example of making ML predictions on a list of objects:
				var inputList = new List<PredictionInput>()
				{
					new PredictionInput() { Sentiment = "I hated this so much" },
					new PredictionInput() { Sentiment = "I loved this a lot it was absolutely amazing, great job!" },
					new PredictionInput() { Sentiment = "I dont think that was fun" },
					new PredictionInput() { Sentiment = "I'm sort of indifferent about it" },
					new PredictionInput() { Sentiment = "This sucked worst experience ever, never coming back." },
					new PredictionInput() { Sentiment = "This was so awesome I loved it!" },
					new PredictionInput() { Sentiment = user.Wishlist }
				};
				var listResult = _predictionService.Predict(inputList);

                return await _eventService.AuthenticatedSamplePost(user);
			}
			catch (Exception ex)
			{
				LoggerHelper.Log(ex);
				return eResponse.Failure;
			}
		}
		**/
		[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
		[HttpPost("[action]")]
		public async Task<DataResponse<Event>> CreateEvent([FromBody] Event newEvent)
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
	}
}