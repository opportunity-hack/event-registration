using NetCoreReact.Models.ML;

namespace NetCoreReact.Services.ML.Interfaces
{
	public interface IPredictionService
	{
		PredictionOutput Predict(PredictionInput input);
	}
}
