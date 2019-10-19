using Microsoft.AspNetCore.Http;
using NetCoreReact.Models;
using NetCoreReact.Models.DTO;
using System.Threading.Tasks;

namespace NetCoreReact.Services.Business
{
	public interface IAuthenticationService
	{
		Task<Response> AuthenticateGoogleToken(TokenModel token, HttpResponse response);
	}
}
