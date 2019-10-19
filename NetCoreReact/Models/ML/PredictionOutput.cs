using Microsoft.ML.Data;

namespace NetCoreReact.Models.ML
{
	public class PredictionOutput
	{
		[ColumnName("PredictedLabel")]
		public bool Prediction { get; set; }

		public float Score { get; set; }
	}
}
