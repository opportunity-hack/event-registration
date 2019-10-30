using Newtonsoft.Json;
using System.Collections.Generic;

namespace NetCoreReact.Models.Email
{
	public class EmailTemplateData
	{
		[JsonProperty("Event_Name")]
		public string Event_Name { get; set; }
		[JsonProperty("Confirm_Url")]
		public string Confirm_Url { get; set; }

		[JsonProperty("Feedback_Url")]
		public string Feedback_Url { get; set; }
		[JsonProperty("Recipient_List")]
		public List<string> Recipient_List { get; set; }
		[JsonProperty("Title_Header")]
		public string Title_Header { get; set; }
		[JsonProperty("Body_Copy")]
		public string Body_Copy { get; set; }
	}
}
