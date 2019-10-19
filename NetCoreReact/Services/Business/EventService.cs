using NetCoreReact.Enums;
using NetCoreReact.Models;
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

		public async Task<PresentModel> AuthenticatedSampleGet(string participantName)
		{
			if (participantName.Equals("Please Select Your Name"))
			{
				return new PresentModel()
				{
					Title = "Oops!",
					PageDescription = "Looks like you forgot to select your name. Please return to the previous page and select your name from the dropdown before continuing.",
					Response = eResponse.Failure
				};
			}

			try
			{
				var participants = await _eventDAO.GetAll();

				if (participants.Data.Count() <= 1)
				{
					return new PresentModel()
					{
						Title = "Oops!",
						PageDescription = "Looks like you're the only one in the drawing pool. Make sure to come back soon to check and see if anyone else has joined the fun!",
						Response = eResponse.Failure
					};
				}

				var participant = participants.Data.FirstOrDefault(x => x.Name.Equals(participantName));

				if (participant == null)
				{
					return new PresentModel()
					{
						Title = "Oops!",
						PageDescription = "Looks like your name doesn't exist. Please return to the previous page and select a name from the dropdown.",
						Response = eResponse.Failure
					};
				}

				if (participant.HaveDrawn)
				{
					return new PresentModel()
					{
						Title = "Sorry, you have already drawn someone.",
						PageDescription = "If you can't remember who you drew, please text the system admin at (602) 810-3667.",
						Response = eResponse.Failure
					};
				}

				var availableParticipants = participants.Data.Where(x => x.Taken.Equals(false) && !x.Name.Equals(participantName));

				if (availableParticipants?.Count() > 0)
				{
					var secretSanta = availableParticipants.ElementAtOrDefault(new Random().Next(availableParticipants.Count()));

					if (secretSanta != null)
					{
						await _eventDAO.Update(
							secretSanta.Id, 
							new Event()
							{
								Id = secretSanta.Id,
								Name = secretSanta.Name,
								Taken = true,
								HaveDrawn = secretSanta.HaveDrawn,
								WishList = secretSanta.WishList,
								WhoTheyDrew = secretSanta.WhoTheyDrew

							});
						await _eventDAO.Update(
							participant.Id,
							new Event()
							{
								Id = participant.Id,
								Name = participant.Name,
								Taken = participant.Taken,
								HaveDrawn = true,
								WishList = participant.WishList,
								WhoTheyDrew = secretSanta.Name

							});
						return new PresentModel()
						{
							Name = secretSanta.Name,
							WishList = secretSanta.WishList,
							Title = "Here is Your Secret Santa:",
							PageDescription = "Screenshot or print this page so that you don't forget! Have fun playing Santa and Merry Christmas!!!",
							HeaderOne = "You Got:",
							HeaderTwo = "Their Christmas Wishlist:",
							Response = eResponse.Success
						};
					}
				}

				return new PresentModel()
				{
					Title = "Sorry, all names have already been drawn.",
					PageDescription = "If this a mistake and you didn't get to draw someone, please text (602) 810-3667.",
					Response = eResponse.Failure
				};
			}
			catch (Exception e)
			{
				throw e;
			}
		}

		public async Task<ParticipantsModel> UnauthenticatedSampleGet()
		{
			try
			{
				var participants = await _eventDAO.GetAll();
				return new ParticipantsModel()
				{
					Participants = participants.Data.Select(x => x.Name)
				};
			}
			catch (Exception e)
			{
				throw e;
			}
		}

		public async Task<eResponse> AuthenticatedSamplePost(InputModel user)
		{
			try
			{
				var participants = await _eventDAO.GetAll();
				if (!participants.Data.Any(x => x.Name.Equals(user.Name)))
				{
					await _eventDAO.Add(new Event()
					{
						Name = user.Name,
						Taken = false,
						HaveDrawn = false,
						WishList = user.Wishlist,
						WhoTheyDrew = string.Empty
					});
					return eResponse.Success;
				}
				else
				{
					return eResponse.Failure;
				}
			}
			catch (Exception e)
			{
				throw e;
			}
		}
	}
}