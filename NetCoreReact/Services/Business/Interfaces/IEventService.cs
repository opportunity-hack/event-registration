using NetCoreReact.Enums;
using NetCoreReact.Models;
using System.Threading.Tasks;

namespace NetCoreReact.Services.Business.Interfaces
{
	public interface IEventService
	{
		Task<PresentModel> AuthenticatedSampleGet(string name);
		Task<ParticipantsModel> UnauthenticatedSampleGet();
		Task<eResponse> AuthenticatedSamplePost(InputModel user);
	}
}
