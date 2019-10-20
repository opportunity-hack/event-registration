using Microsoft.AspNetCore.Http;
using NetCoreReact.Models;
using NetCoreReact.Models.DTO;
using System.Threading.Tasks;

namespace NetCoreReact.Services.Business
{
	public interface IAuthenticationService
	{
		Task<DataResponse<string>> AuthenticateGoogleToken(TokenModel token, HttpResponse response);
		DataResponse<string> AuthenticateConfirmEmailToken(string token);
		DataResponse<string> AuthenticateDownloadToken(string token);
	}
}
