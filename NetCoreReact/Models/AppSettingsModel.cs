using NetCoreReact.Models.Email;
using System.Collections.Generic;

namespace NetCoreReact.Models
{
    public class AppSettingsModel
    {
        public static AppSettingsModel appSettings { get; set; }
        public string JwtSecret { get; set; }
		public string ConfirmEmailJwtSecret { get; set; }
		public string RemoveEmailJwtSecret { get; set; }
		public string FeedbackJwtSecret { get; set; }
		public List<string> ValidEmails { get; set; }
		public List<EmailClient> SendGridClients { get; set; }
		public string AppDomain { get; set; }
		public string AppAudience { get; set; }
	}
}