namespace NetCoreReact.Models.Documents
{
	public class Feedback
	{
		public string Email { get; set; }
		public string Body { get; set; }
		public int Rating { get; set; }
		public string DateEntered { get; set; }
		public double Score { get; set; }
		public bool IsPositive { get; set; }
	}
}