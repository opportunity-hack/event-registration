using Google.Apis.Auth;
using NetCoreReact.Models;
using System;
using System.Threading.Tasks;
using NetCoreReact.Helpers;
using Microsoft.AspNetCore.Http;
using NetCoreReact.Models.DTO;
using System.Collections.Generic;

namespace NetCoreReact.Services.Business
{
	public class AuthenticationService : IAuthenticationService
	{
		public async Task<Response> AuthenticateGoogleToken(TokenModel token, HttpResponse response)
		{
            var res = new DataResponse<string>();

			try
			{
				var payload = await GoogleJsonWebSignature.ValidateAsync(token.tokenId, new GoogleJsonWebSignature.ValidationSettings());
				var jwt = TokenHelper.GenerateToken(payload.Email);

				LoggerHelper.Log(payload.ExpirationTimeSeconds.ToString());
				CookieHelper.AddCookie(response, "User-Email", payload.Email);
				CookieHelper.AddCookie(response, "Authorization-Token", jwt);
                CookieHelper.AddCookie(response, "Avatar-Url", payload.Picture);

                res.Success = true;
                res.Data = new List<string>() { jwt };

            }
			catch (Exception e)
			{
                res.AddError("*", "Error authenticating with Google");
            }

            return res;

        }
	}
}
