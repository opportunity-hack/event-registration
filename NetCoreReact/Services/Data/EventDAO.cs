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
		private readonly IMongoCollection<Event> _events;

		public EventDAO(string connectionString, string databaseName, string eventCollection)
		{
			try
			{
				var client = new MongoClient(connectionString);
				var database = client.GetDatabase(databaseName);
				_events = database.GetCollection<Event>(eventCollection);
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
				var events = await _events.FindAsync(x => true);
				var eventsList = await events.ToListAsync();
				return new DataResponse<Event>()
				{
					Data = eventsList,
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
				var events = await _events.FindAsync(x => x.Id.Equals(index));
				var foundEvent = await events.FirstOrDefaultAsync();
				return new DataResponse<Event>()
				{
					Data = new List<Event>() { foundEvent },
					Success = true
				};
			}
			catch (Exception e)
			{
				throw e;
			}
		}

		public async Task<DataResponse<Event>> Add(Event newEvent)
		{
			try
			{ 
				await _events.InsertOneAsync(newEvent);
				return new DataResponse<Event>()
				{
					Data = new List<Event>() { newEvent },
					Success = true
				};
			}
			catch (Exception e)
			{
				throw e;
			}
		}

		public async Task<DataResponse<Event>> Update(string index, Event updatedEvent)
		{
			try
			{
				await _events.ReplaceOneAsync(x => x.Id.Equals(index), updatedEvent);
				return new DataResponse<Event>()
				{
					Data = new List<Event>() { updatedEvent },
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
				await _events.DeleteOneAsync(x => x.Id.Equals(index));
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