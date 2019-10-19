using NetCoreReact.Models.Documents;
using NetCoreReact.Models.DTO;
using System.Threading.Tasks;

namespace NetCoreReact.Services.Business.Interfaces
{
	public interface IEventService
	{
		Task<DataResponse<Event>> CreateEvent (Event newEvent);
		Task<DataResponse<Event>> AddParticipant(DataParticipant newParticipant);
	}
}
