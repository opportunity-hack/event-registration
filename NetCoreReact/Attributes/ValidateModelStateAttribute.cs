using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using NetCoreReact.Extensions;
using NetCoreReact.Models.DTO;

namespace NetCoreReact.Attributes
{
    public class ValidateModelStateAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (!context.ModelState.IsValid)
            {
                context.Result = new BadRequestObjectResult(new Response()
                {
                    Errors = context.ModelState.GetErrors()
                });
            }
        }
    }
}
