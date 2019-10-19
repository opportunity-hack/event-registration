namespace NetCoreReact.Models.Documents
{
	public class Participant
	{
		public string Email { get; set; }
		public string DateEntered { get; set; }
		public ParticipantType Type { get; set; }
		public bool IsConfirmed { get; set; }
	}
}