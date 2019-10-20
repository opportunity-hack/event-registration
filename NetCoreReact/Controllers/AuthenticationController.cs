using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using NetCoreReact.Models;
using NetCoreReact.Helpers;
using NetCoreReact.Services.Business;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using NetCoreReact.Models.DTO;
using System.Collections.Generic;

namespace NetCoreReact.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
	[ApiController]
    [Route("api/[controller]")]
	public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenticationService _authenticationService;

        public AuthenticationController(IAuthenticationService _authenticationService)
        {
            this._authenticationService = _authenticationService;
        }

        [AllowAnonymous]
        [HttpPost("Google")]
        public async Task<DataResponse<string>> AuthenticateGoogleToken([FromBody]TokenModel token)
        {
            try
            {
				return await _authenticationService.AuthenticateGoogleToken(token, HttpContext.Response);
            }
            catch (Exception ex)
            {
				LoggerHelper.Log(ex);
				return new DataResponse<string>()
				{
					Data = new List<string>(),
					Errors = new Dictionary<string, List<string>>()
					{
						["*"] = new List<string> { "Sorry, an error occured while logging in with Google." },
					},
					Success = false
				};
			}
        }
	}
}