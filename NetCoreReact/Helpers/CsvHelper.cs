using CsvHelper;
using System.Collections.Generic;
using System.IO;

namespace NetCoreReact.Helpers
{
	public class CsvHelper
	{
		public static byte[] WriteCsvToMemory(IEnumerable<string> records)
		{
			using (var mem = new MemoryStream())
			using (var writer = new StreamWriter(mem))
			using (var csvWriter = new CsvWriter(writer))
			{
				foreach (var email in records)
				{
					csvWriter.WriteField(email);
					csvWriter.NextRecord();
				}

				writer.Flush();
				return mem.ToArray();
			}
		}
	}
}
