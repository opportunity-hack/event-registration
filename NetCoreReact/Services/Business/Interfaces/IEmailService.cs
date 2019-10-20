using NetCoreReact.Models.Email;
using System.Threading.Tasks;

namespace NetCoreReact.Services.Business.Interfaces
{
	public interface IEmailService
	{
		Task<Models.DTO.Response> SendConfirmationEmail(Email email);
	}
}
