using System.Collections.Generic;

namespace NetCoreReact.Models.Email
{
	public class EmailClient
	{
		public string ApiKey { get; set; }
		public List<string> TemplateIDs { get; set; }
		public string FromEmail { get; set; }
	}
}
