using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace NetCoreReact.Models.Documents
{
	public class Participant
	{
		[EmailAddress]
		[Required]
		[BsonRequired]
		public string Email { get; set; }
		[Required]
		[BsonRequired]
		public ParticipantType Type { get; set; }
		public string DateEntered { get; set; }
		public bool IsConfirmed { get; set; } = false;
	}
}