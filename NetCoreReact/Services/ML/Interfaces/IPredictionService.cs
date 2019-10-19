using NetCoreReact.Models.ML;
using System.Collections.Generic;

namespace NetCoreReact.Services.ML.Interfaces
{
	public interface IPredictionService
	{
		PredictionOutput Predict(PredictionInput input);
		List<PredictionOutput> Predict(List<PredictionInput> input);
	}
}
