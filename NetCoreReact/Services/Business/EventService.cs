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

		public async Task<DataResponse<Event>> CreateEvent(DataInput<Event> newEvent)
		{
			try
			{
				var result = await _eventDAO.Add(newEvent.Data);
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

		public async Task<DataResponse<Event>> AddParticipant(DataInput<Participant> newParticipant)
		{
			try
			{
				var response = await _eventDAO.Get(newParticipant.EventId);
				var currentEvent = response.Data.FirstOrDefault();

				if (!currentEvent.Participants.Any(x => x.Email.Equals(newParticipant.Data.Email)))
				{
					currentEvent.Participants.Add(newParticipant.Data);
					var result = await _eventDAO.Update(currentEvent.Id, currentEvent);
					return result;
				}
				else
				{
					throw new Exception();
				}
			}
			catch (Exception e)
			{
				throw e;
			}
		}

		public async Task<DataResponse<Event>> AddFeedback(DataInput<Feedback> newFeedback)
		{
			try
			{
				/**
				var response = await _eventDAO.Get(newParticipant.EventId);
				var currentEvent = response.Data.FirstOrDefault();

				if (!currentEvent.Participants.Any(x => x.Email.Equals(newParticipant.Data.Email)))
				{
					currentEvent.Participants.Add(newParticipant.Data);
					var result = await _eventDAO.Update(currentEvent.Id, currentEvent);
					return result;
				}
				else
				{
					throw new Exception();
				}
	**/
				return null;
			}
			catch (Exception e)
			{
				throw e;
			}
		}

		public async Task<DataResponse<Event>> ConfirmEmail(string email, string eventID)
		{
			try
			{
				var response = await _eventDAO.Get(eventID);
				var currentEvent = response.Data.FirstOrDefault();
				var participants = currentEvent.Participants;

				var participant = participants.FirstOrDefault(x => x.Email.Equals(email));
				if (participant != null)
				{
					participant.IsConfirmed = true;
					currentEvent.Participants = participants;

					var result = await _eventDAO.Update(currentEvent.Id, currentEvent);
					return result;
				}
				else
				{
					throw new Exception();
				}
			}
			catch (Exception e)
			{
				throw e;
			}
		}
	}
}