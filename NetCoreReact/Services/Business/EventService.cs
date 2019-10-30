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
				DateTime now = DateTime.UtcNow.Date;
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
				DateTime now = DateTime.UtcNow.Date.AddHours(23).AddMinutes(59).AddSeconds(59).AddMilliseconds(99);
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

		public async Task<DataResponse<Event>> UpdateEvent(Event currentEvent)
		{
			try
			{
				var result = await _eventDAO.Update(currentEvent.Id, currentEvent);
				return result;
			}
			catch (Exception e)
			{
				throw e;
			}
		}

		public async Task<DataResponse<Event>> DeleteEvent(string eventID)
		{
			try
			{
				var result = await _eventDAO.Delete(eventID);
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

				if (currentEvent.Participants.Count() == 0 || !currentEvent.Participants.Any(x => x.Email.Equals(newParticipant.Data.Email)))
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
				var response = await _eventDAO.Get(newFeedback.EventId);
				var currentEvent = response.Data.FirstOrDefault();

				if (currentEvent.Feedback.Count() == 0 || !currentEvent.Feedback.Any(x => x.Email.Equals(newFeedback.Data.Email)))
				{
					if (currentEvent.Participants.Count() > 0)
					{
						newFeedback.Data.Type = currentEvent.Participants.FirstOrDefault(x => x.Email.Equals(newFeedback.Data.Email))?.Type ?? ParticipantType.Attendee;
					}
					currentEvent.Feedback.Add(newFeedback.Data);
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

		public async Task<DataResponse<Event>> ConfirmEmail(string email, string eventID)
		{
			try
			{
				var response = await _eventDAO.Get(eventID);
				var currentEvent = response.Data.FirstOrDefault();
				var participant = currentEvent.Participants.FirstOrDefault(x => x.Email.Equals(email));

				if (participant != null)
				{
					participant.IsConfirmed = true;
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

		public async Task<DataResponse<Event>> SetConfirmEmailSent(string email, string eventID)
		{
			try
			{
				var response = await _eventDAO.Get(eventID);
				var currentEvent = response.Data.FirstOrDefault();

				if (string.IsNullOrEmpty(email))
				{
					currentEvent.Participants.ForEach(x => x.ConfirmSent = true);
				}
				else
				{
					var participant = currentEvent.Participants.FirstOrDefault(x => x.Email.Equals(email));
					if (participant != null)
					{
						participant.ConfirmSent = true;
					}
				}

				var result = await _eventDAO.Update(currentEvent.Id, currentEvent);
				return result;
			}
			catch (Exception e)
			{
				throw e;
			}
		}

		public async Task<DataResponse<Event>> SetFeedbackEmailSent(string email, string eventID)
		{
			try
			{
				var response = await _eventDAO.Get(eventID);
				var currentEvent = response.Data.FirstOrDefault();

				if (string.IsNullOrEmpty(email))
				{
					currentEvent.Participants.ForEach(x => x.FeedbackSent = true);
					currentEvent.SentFeedback = true;
				}
				else
				{
					var participant = currentEvent.Participants.FirstOrDefault(x => x.Email.Equals(email));
					if (participant != null)
					{
						participant.FeedbackSent = true;
					}
				}

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