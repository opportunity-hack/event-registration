using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace NetCoreReact.Models.Documents
{
	public class Event
	{
		[BsonId]
		[BsonRepresentation(BsonType.ObjectId)]
		public string Id { get; set; }
		public string Title { get; set; }
		public string StartDate { get; set; }
		public string EndDate { get; set; }
		public string Description { get; set; }
		public bool SentFeedback { get; set; }
		public List<Participant> Participants { get; set; }
		public List<Feedback> Feedback { get; set; }
	}
}