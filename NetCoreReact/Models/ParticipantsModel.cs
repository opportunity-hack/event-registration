using System.Collections.Generic;

namespace NetCoreReact.Models
{
	public class ParticipantsModel
	{
		public IEnumerable<string> Participants { get; set; } = new List<string>();
	}
}