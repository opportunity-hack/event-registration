using MongoDB.Driver;
using NetCoreReact.Helpers;
using NetCoreReact.Models.DB;
using NetCoreReact.Models.DTO;
using NetCoreReact.Services.Data.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NetCoreReact.Services.Data
{
	public class SampleDAO : IDAO<SampleDocument, DataResponse<SampleDocument>>
	{
		private readonly IMongoCollection<SampleDocument> _participants;

		public SampleDAO(string connectionString, string databaseName, string collectionName)
		{
			try
			{
				var client = new MongoClient(connectionString);
				var database = client.GetDatabase(databaseName);
				_participants = database.GetCollection<SampleDocument>(collectionName);
			}
			catch (Exception e)
			{
				LoggerHelper.Log(e);
				throw e;
			}
		}

		public async Task<DataResponse<SampleDocument>> GetAll()
		{
			try
			{ 
				var participants = await _participants.FindAsync(x => true);
				var participantsList = await participants.ToListAsync();
				return new DataResponse<SampleDocument>()
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

		public async Task<DataResponse<SampleDocument>> Get(string index)
		{
			try
			{
				var participants = await _participants.FindAsync(x => x.Id.Equals(index));
				var participant = await participants.FirstOrDefaultAsync();
				return new DataResponse<SampleDocument>()
				{
					Data = new List<SampleDocument>() { participant },
					Success = true
				};
			}
			catch (Exception e)
			{
				throw e;
			}
		}

		public async Task<DataResponse<SampleDocument>> Add(SampleDocument participant)
		{
			try
			{ 
				await _participants.InsertOneAsync(participant);
				return new DataResponse<SampleDocument>()
				{
					Data = new List<SampleDocument>() { participant },
					Success = true
				};
			}
			catch (Exception e)
			{
				throw e;
			}
		}

		public async Task<DataResponse<SampleDocument>> Update(string index, SampleDocument participant)
		{
			try
			{
				await _participants.ReplaceOneAsync(x => x.Id.Equals(index), participant);
				return new DataResponse<SampleDocument>()
				{
					Data = new List<SampleDocument>() { participant },
					Success = true
				};
			}
			catch (Exception e)
			{
				throw e;
			}
		}

		public async Task<DataResponse<SampleDocument>> Delete(string index)
		{
			try
			{
				await _participants.DeleteOneAsync(x => x.Id.Equals(index));
				return new DataResponse<SampleDocument>()
				{
					Data = new List<SampleDocument>(),
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