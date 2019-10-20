using SendGrid.Helpers.Mail;
using System.Collections.Generic;
using System.Linq;

namespace NetCoreReact.Models.Email
{
	public class Email
	{
		public Email()
		{
			{
				To = new List<EmailAddress>() { new EmailAddress("carterlrice@gmail.com") };
				From = new EmailAddress("trevomoo@gmail.com");
				Subject = new List<string>() { "test" };
				HtmlContent = "test";
				PlainTextContent = "test";
			};
		}
		public Email(List<string> to, string from, string subject, string htmlContent, string plainTextContent)
		{
			var emailList = new List<EmailAddress>();
			var subjectList = new List<string>();

			foreach (var email in to)
			{
				emailList.Add(new EmailAddress(email));
				subjectList.Add(subject);
			}

			{
				To = emailList;
				From = new EmailAddress(from);
				Subject = subjectList;
				HtmlContent = htmlContent;
				PlainTextContent = plainTextContent;
			};
		}
		public EmailAddress From { get; set; }
		public List<EmailAddress> To { get; set; }
		public List<string> Subject { get; set; }
		public string PlainTextContent { get; set; }
		public string HtmlContent { get; set; }
	}
}
