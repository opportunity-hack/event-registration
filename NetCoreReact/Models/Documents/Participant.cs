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
		[Required]
		[BsonRequired]
		public string DateEntered { get; set; }
		public bool ConfirmSent { get; set; } = false;
		public bool FeedbackSent { get; set; } = false;
		public bool IsConfirmed { get; set; } = false;
	}
}