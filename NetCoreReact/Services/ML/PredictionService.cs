using Microsoft.Extensions.ML;
using NetCoreReact.Models.ML;
using NetCoreReact.Services.ML.Interfaces;

namespace NetCoreReact.Services.ML
{
	public class PredictionService : IPredictionService
	{
		private readonly PredictionEnginePool<PredictionInput, PredictionOutput> _predictionEnginePool;

		public PredictionService(PredictionEnginePool<PredictionInput, PredictionOutput> predictionEnginePool)
		{
			_predictionEnginePool = predictionEnginePool;
		}

		public PredictionOutput Predict(PredictionInput input)
		{
			return _predictionEnginePool.Predict(modelName: "MLModel", example: input);
		}
	}
}
