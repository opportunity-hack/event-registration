using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace NetCoreReact.Extensions
{
    public static class ModelStateExtensions
    {
        public static Dictionary<string, List<string>> GetErrors(this ModelStateDictionary modelState)
        {
            var result = new Dictionary<string, List<string>>();

            var erroneousFields = modelState.Where(ms => ms.Value.Errors.Any())
                .Select(x => new {x.Key, x.Value.Errors});

            foreach (var erroneousField in erroneousFields)
            {
                var fieldKey = erroneousField.Key;
                result[fieldKey] = new List<string>();

                foreach (var error in erroneousField.Errors)
                {
                    result[fieldKey].Add(error.ErrorMessage);
                }
            }

            return result;
        }
    }
}
