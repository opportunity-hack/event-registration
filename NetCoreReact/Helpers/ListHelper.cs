using System;
using System.Collections.Generic;

namespace NetCoreReact.Helpers
{
	public class ListHelper
	{
		public static IEnumerable<List<T>> splitList<T>(List<T> items, int size = 900)
		{
			for (int i = 0; i < items.Count; i += size)
			{
				yield return items.GetRange(i, Math.Min(size, items.Count - i));
			}
		}
	}
}
