using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace NetCoreReact.Models.Documents
{
	public class Feedback
	{
		public string Email { get; set; }
		[Required]
		[BsonRequired]
		public string Body { get; set; }
		[Required]
		[BsonRequired]
		public string DateEntered { get; set; }
		public double Score { get; set; }
		public bool IsPositive { get; set; }
		[BsonIgnore]
		public string Token { get; set; }
	}
}