using CsvHelper;
using System.Collections.Generic;
using System.IO;

namespace NetCoreReact.Helpers
{
	public class CsvHelper
	{
		public static byte[] WriteCsvToMemory(IEnumerable<string> records)
		{
			using (var memoryStream = new MemoryStream())
			using (var streamWriter = new StreamWriter(memoryStream))
			using (var csvWriter = new CsvWriter(streamWriter))
			{
				csvWriter.WriteRecords(records);
				streamWriter.Flush();
				return memoryStream.ToArray();
			}
		}
	}
}
