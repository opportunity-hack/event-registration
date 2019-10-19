using Microsoft.Extensions.ML;
using Microsoft.ML;
using NetCoreReact.Models.ML;
using NetCoreReact.Services.ML.Interfaces;
using System.Collections.Generic;
using System.Linq;

namespace NetCoreReact.Services.ML
{
	public class PredictionService : IPredictionService
	{
		private readonly PredictionEnginePool<PredictionInput, PredictionOutput> _predictionEnginePool;
		private readonly ITransformer _mLModel;
		private readonly MLContext _mLContext;

		public PredictionService(PredictionEnginePool<PredictionInput, PredictionOutput> predictionEnginePool, ITransformer mLModel, MLContext mLContext)
		{
			_predictionEnginePool = predictionEnginePool;
			_mLModel = mLModel;
			_mLContext = mLContext;
		}

		public PredictionOutput Predict(PredictionInput input)
		{
			return _predictionEnginePool.Predict(modelName: "MLModel", example: input);
		}

		public List<PredictionOutput> Predict(List<PredictionInput> input)
		{
			var predictionOutput = _mLModel.Transform(_mLContext.Data.LoadFromEnumerable(input));
			return _mLContext.Data.CreateEnumerable<PredictionOutput>(predictionOutput, reuseRowObject: false).ToList();
		}
	}
}
