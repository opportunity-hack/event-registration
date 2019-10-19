using NetCoreReact.Enums;
using NetCoreReact.Models;
using System.Threading.Tasks;

namespace NetCoreReact.Services.Business.Interfaces
{
	public interface ISampleService
	{
		Task<PresentModel> AuthenticatedSampleGet(string name);
		Task<ParticipantsModel> UnauthenticatedSampleGet();
		Task<eResponse> AuthenticatedSamplePost(InputModel user);
	}
}
