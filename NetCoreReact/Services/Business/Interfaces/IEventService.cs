using NetCoreReact.Models.Documents;
using NetCoreReact.Models.DTO;
using System.Threading.Tasks;

namespace NetCoreReact.Services.Business.Interfaces
{
	public interface IEventService
	{
		Task<DataResponse<Event>> GetAllEvents();
		Task<DataResponse<Event>> GetUpcomingEvents();
		Task<DataResponse<Event>> GetPastEvents();
		Task<DataResponse<Event>> CreateEvent (DataInput<Event> newEvent);
		Task<DataResponse<Event>> GetEvent(string eventID);
		Task<DataResponse<Event>> UpdateEvent(Event currentEvent);
		Task<DataResponse<Event>> AddParticipant(DataInput<Participant> newParticipant);
		Task<DataResponse<Event>> AddFeedback(DataInput<Feedback> newFeedback);
		Task<DataResponse<Event>> ConfirmEmail(string email, string eventID);
	}
}