using Google.Apis.Auth;
using NetCoreReact.Models;
using System;
using System.Threading.Tasks;
using NetCoreReact.Helpers;
using Microsoft.AspNetCore.Http;
using NetCoreReact.Models.DTO;
using System.Collections.Generic;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;

namespace NetCoreReact.Services.Business
{
	public class AuthenticationService : IAuthenticationService
	{
		public async Task<DataResponse<string>> AuthenticateGoogleToken(TokenModel token, HttpResponse response)
		{
            var res = new DataResponse<string>();

			try
			{
				var payload = await GoogleJsonWebSignature.ValidateAsync(token.tokenId, new GoogleJsonWebSignature.ValidationSettings());
				var jwt = TokenHelper.GenerateToken(payload.Email, AppSettingsModel.appSettings.JwtSecret, string.Empty);

				LoggerHelper.Log(payload.ExpirationTimeSeconds.ToString());
				CookieHelper.AddCookie(response, "User-Email", payload.Email);
				CookieHelper.AddCookie(response, "Authorization-Token", jwt);
                CookieHelper.AddCookie(response, "Avatar-Url", payload.Picture);

                res.Success = true;
                res.Data = new List<string>() { jwt };

            }
			catch (Exception e)
			{
				res.Success = false;
				res.AddError("*", "Error authenticating with Google");
            }

            return res;
        }

		public DataResponse<string> AuthenticateConfirmEmailToken(string token)
		{
			var res = new DataResponse<string>();

			try
			{
				var validationParameters = new TokenValidationParameters()
				{
					ValidIssuer = AppSettingsModel.appSettings.AppDomain,
					ValidAudiences = new[] { AppSettingsModel.appSettings.AppAudience },
					IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(AppSettingsModel.appSettings.ConfirmEmailJwtSecret)),
					ValidateIssuer = true,
					ValidateAudience = true,
					ValidateIssuerSigningKey = true
				};

				JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();
				var user = handler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);

				if (validatedToken == null)
				{
					throw new Exception();
				}
				else
				{
					return new DataResponse<string>()
					{
						Success = true,
						Data = new List<string>()
						{
							user.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub)?.Value ?? string.Empty,
							user.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Azp)?.Value ?? string.Empty
						}
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
