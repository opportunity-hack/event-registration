using System.Collections.Generic;

namespace NetCoreReact.Models.DTO
{
	public class DataInput<T> : Input
	{
		public T Data { get; set; }
	}
}
