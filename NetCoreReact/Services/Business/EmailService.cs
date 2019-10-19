using NetCoreReact.Services.Business.Interfaces;

namespace NetCoreReact.Services.Business
{
	public class EmailService : IEmailService
	{
		private readonly string _sendGridApiKey;
		public EmailService(string aPIKey)
		{
			_sendGridApiKey = aPIKey;
		}
	}
}
