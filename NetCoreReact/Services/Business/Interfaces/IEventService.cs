using NetCoreReact.Enums;
using NetCoreReact.Models.Documents;
using NetCoreReact.Models.DTO;
using System.Threading.Tasks;

namespace NetCoreReact.Services.Business.Interfaces
{
	public interface IEventService
	{
		/**
		Task<PresentModel> AuthenticatedSampleGet(string name);
		Task<ParticipantsModel> UnauthenticatedSampleGet();
		**/
		Task<Response> CreateEvent (Event newEvent);
	}
}
