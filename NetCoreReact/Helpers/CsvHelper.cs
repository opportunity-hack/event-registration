using CsvHelper;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

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
				return mem.ToArray());
			}
			/**
			using (var memoryStream = new MemoryStream())
			using (var streamWriter = new StreamWriter(memoryStream))
			using (var csvWriter = new CsvWriter(streamWriter))
			{
				csvWriter.WriteRecords(records);
				streamWriter.Flush();
				return memoryStream.ToArray();
			}
	**/
		}
	}
}
