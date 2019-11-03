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
				result.Data = result.Data.OrderByDescending(x => x.StartDate).ToList();
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

				if (currentEvent.Participants.Count() == 0 || !currentEvent.Participants.Any(x => x.Email.Equals(newParticipant.Data.Email, StringComparison.OrdinalIgnoreCase)))
				{
					currentEvent.Participants.Add(newParticipant.Data);
					var result = await _eventDAO.Update(currentEvent.Id, currentEvent);
					return result;
				}
				else
				{
					throw new Exception("Email has already been added.");
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

				if (currentEvent.Feedback.Count() == 0 || !currentEvent.Feedback.Any(x => x.Email.Equals(newFeedback.Data.Email, StringComparison.OrdinalIgnoreCase)))
				{
					if (currentEvent.Participants.Count() > 0)
					{
						newFeedback.Data.Type = currentEvent.Participants.FirstOrDefault(x => x.Email.Equals(newFeedback.Data.Email, StringComparison.OrdinalIgnoreCase))?.Type ?? ParticipantType.Attendee;
					}
					currentEvent.Feedback.Add(newFeedback.Data);
					var result = await _eventDAO.Update(currentEvent.Id, currentEvent);
					return result;
				}
				else
				{
					throw new Exception("Email has already given feedback.");
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
				var participant = currentEvent.Participants.FirstOrDefault(x => x.Email.Equals(email, StringComparison.OrdinalIgnoreCase));

				if (participant != null)
				{
					participant.IsConfirmed = true;
					var result = await _eventDAO.Update(currentEvent.Id, currentEvent);
					return result;
				}
				else
				{
					throw new Exception("Could not find participant.");
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
					var participant = currentEvent.Participants.FirstOrDefault(x => x.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
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
					var participant = currentEvent.Participants.FirstOrDefault(x => x.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
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

		public async Task<DataResponse<Event>> RemoveEmail(string email)
		{
			try
			{
				var response = await _eventDAO.GetAll();

				foreach(var currentEvent in response.Data)
				{
					var participant = currentEvent.Participants.FirstOrDefault(x => x.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
					if (participant != null)
					{
						currentEvent.Participants.Remove(participant);
						await _eventDAO.Update(currentEvent.Id, currentEvent);
					}
				}

				return new DataResponse<Event>()
				{
					Success = true
				};
			}
			catch (Exception e)
			{
				throw e;
			}
		}
	}
}