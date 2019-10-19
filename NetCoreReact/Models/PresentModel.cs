using NetCoreReact.Enums;

namespace NetCoreReact.Models
{
	public class PresentModel
	{
		public string Name { get; set; } = string.Empty;
		public string WishList { get; set; } = string.Empty;
		public string Title { get; set; } = "Here is Your Secret Santa:";
		public string PageDescription { get; set; } = "Screenshot or print this page so that you don't forget! Have fun playing Santa and Merry Christmas!!!";
		public string HeaderOne { get; set; } = "You Got:";
		public string HeaderTwo { get; set; } = "Their Christmas Wishlist:";
		public eResponse Response { get; set; } = eResponse.Nothing;
	}
}