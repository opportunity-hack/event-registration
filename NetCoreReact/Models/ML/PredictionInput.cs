using Microsoft.ML.Data;

namespace NetCoreReact.Models.ML
{
	public class PredictionInput
	{
		[ColumnName("Sentiment"), LoadColumn(0)]
		public string Sentiment { get; set; }

		[ColumnName("Label"), LoadColumn(1)]
		public bool Label { get; set; }
	}
}
