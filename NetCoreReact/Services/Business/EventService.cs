using NetCoreReact.Models.Documents;
using NetCoreReact.Models.DTO;
using NetCoreReact.Services.Business.Interfaces;
using NetCoreReact.Services.Data.Interfaces;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace NetCoreReact.Services.Business
{
	public class EventService : IEventService
	{
		private readonly IDAO<Event, DataResponse<Event>> _eventDAO;

		public EventService(IDAO<Event, DataResponse<Event>> eventDAO)
		{
			this._eventDAO = eventDAO;
		}

		public async Task<DataResponse<Event>> GetAllEvents()
		{
			try
			{
				var result = await _eventDAO.GetAll();
				return result;
			}
			catch (Exception e)
			{
				throw e;
			}
		}

		public async Task<DataResponse<Event>> GetUpcomingEvents()
		{
			try
			{
				var result = await _eventDAO.GetAll();
				DateTime now = DateTime.UtcNow;
				result.Data = result.Data.Where(x => DateTime.Compare(now, DateTime.Parse(x.StartDate)) <= 0).ToList();
				return result;
			}
			catch (Exception e)
			{
				throw e;
			}
		}

		public async Task<DataResponse<Event>> GetPastEvents()
		{
			try
			{
				var result = await _eventDAO.GetAll();
				DateTime now = DateTime.UtcNow;
				result.Data = result.Data.Where(x => DateTime.Compare(now, DateTime.Parse(x.EndDate)) > 0).ToList();
				return result;
			}
			catch (Exception e)
			{
				throw e;
			}
		}

		public async Task<DataResponse<Event>> CreateEvent(Event newEvent)
		{
			try
			{
				var result = await _eventDAO.Add(newEvent);
				return result;
			}
			catch (Exception e)
			{
				throw e;
			}
		}

		public async Task<DataResponse<Event>> GetEvent(string eventID)
		{
			try
			{
				var result = await _eventDAO.Get(eventID);
				return result;
			}
			catch (Exception e)
			{
				throw e;
			}
		}

		public async Task<DataResponse<Event>> AddParticipant(DataParticipant newParticipant)
		{
			try
			{
				var response = await _eventDAO.Get(newParticipant.EventId);
				var currentEvent = response.Data.FirstOrDefault();

				currentEvent.Participants.Add(newParticipant.Participant);

				var result = await _eventDAO.Update(currentEvent.Id, currentEvent);
				return result;
			}
			catch (Exception e)
			{
				throw e;
			}
		}
	}
}