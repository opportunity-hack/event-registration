using Microsoft.AspNetCore.Http;
using System;

namespace NetCoreReact.Helpers
{
	public class CookieHelper
	{
		public static void AddCookie(HttpResponse response, string key, string value, int? expireTime = null)
		{
			response.Cookies.Append
			(
				key,
				value,
				new CookieOptions()
				{
					Expires = expireTime.HasValue ? DateTime.UtcNow.AddMinutes(expireTime.Value) : DateTime.UtcNow.AddMonths(1),
					IsEssential = true,
					SameSite = SameSiteMode.None,
					Secure = true
				}
			);
		}
	}
}
