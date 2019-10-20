using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace NetCoreReact.Models.Documents
{
	public class Feedback
	{
		[Required]
		[BsonRequired]
		public string Email { get; set; }
		public string Body { get; set; }
		public int Rating { get; set; }
		[Required]
		[BsonRequired]
		public string DateEntered { get; set; }
		public double Score { get; set; }
		public bool IsPositive { get; set; }
		[BsonIgnore]
		public string Token { get; set; }
	}
}