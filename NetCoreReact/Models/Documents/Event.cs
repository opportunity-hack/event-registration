using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace NetCoreReact.Models.Documents
{
	public class Event
	{
		[BsonId]
		[BsonRepresentation(BsonType.ObjectId)]
		public string Id { get; set; }
		[Required]
		[BsonRequired]
		public string Title { get; set; }
		[Required]
		[BsonRequired]
		public string StartDate { get; set; }
		[Required]
		[BsonRequired]
		public string EndDate { get; set; }
		[Required]
		[BsonRequired]
		public string Description { get; set; }
		public bool SentFeedback { get; set; } = false;
		public List<Participant> Participants { get; set; } = new List<Participant>();
		public List<Feedback> Feedback { get; set; } = new List<Feedback>();
	}
}