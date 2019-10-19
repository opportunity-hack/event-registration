using MongoDB.Driver;
using NetCoreReact.Helpers;
using NetCoreReact.Models.Documents;
using NetCoreReact.Models.DTO;
using NetCoreReact.Services.Data.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NetCoreReact.Services.Data
{
	public class EventDAO : IDAO<Event, DataResponse<Event>>
	{
		private readonly IMongoCollection<Event> _participants;

		public EventDAO(string connectionString, string databaseName, string collectionName)
		{
			try
			{
				var client = new MongoClient(connectionString);
				var database = client.GetDatabase(databaseName);
				_participants = database.GetCollection<Event>(collectionName);
			}
			catch (Exception e)
			{
				LoggerHelper.Log(e);
				throw e;
			}
		}

		public async Task<DataResponse<Event>> GetAll()
		{
			try
			{ 
				var participants = await _participants.FindAsync(x => true);
				var participantsList = await participants.ToListAsync();
				return new DataResponse<Event>()
				{
					Data = participantsList,
					Success = true
				};
			}
			catch (Exception e)
			{
				throw e;
			}
		}

		public async Task<DataResponse<Event>> Get(string index)
		{
			try
			{
				var participants = await _participants.FindAsync(x => x.Id.Equals(index));
				var participant = await participants.FirstOrDefaultAsync();
				return new DataResponse<Event>()
				{
					Data = new List<Event>() { participant },
					Success = true
				};
			}
			catch (Exception e)
			{
				throw e;
			}
		}

		public async Task<DataResponse<Event>> Add(Event participant)
		{
			try
			{ 
				await _participants.InsertOneAsync(participant);
				return new DataResponse<Event>()
				{
					Data = new List<Event>() { participant },
					Success = true
				};
			}
			catch (Exception e)
			{
				throw e;
			}
		}

		public async Task<DataResponse<Event>> Update(string index, Event participant)
		{
			try
			{
				await _participants.ReplaceOneAsync(x => x.Id.Equals(index), participant);
				return new DataResponse<Event>()
				{
					Data = new List<Event>() { participant },
					Success = true
				};
			}
			catch (Exception e)
			{
				throw e;
			}
		}

		public async Task<DataResponse<Event>> Delete(string index)
		{
			try
			{
				await _participants.DeleteOneAsync(x => x.Id.Equals(index));
				return new DataResponse<Event>()
				{
					Data = new List<Event>(),
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