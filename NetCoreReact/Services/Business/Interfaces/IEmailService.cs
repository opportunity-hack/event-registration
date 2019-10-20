using NetCoreReact.Models.Documents;
using NetCoreReact.Models.DTO;
using System.Threading.Tasks;

namespace NetCoreReact.Services.Business.Interfaces
{
	public interface IEmailService
	{
		Task<DataResponse<Event>> SendConfirmationEmail(DataParticipant email, Event currentEvent);
		Task<DataResponse<Event>> SendFeedbackEmail(Event currentEvent);
	}
}
