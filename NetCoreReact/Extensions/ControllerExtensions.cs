using Microsoft.AspNetCore.Mvc;
using NetCoreReact.Models.DTO;

namespace NetCoreReact.Extensions
{
    public static class ControllerExtensions
    {
        public static IActionResult GenerateResponse(this ControllerBase controllerBase, Response response)
        {
            if (response.Success)
            {
                return controllerBase.Ok(response);
            }

            return controllerBase.BadRequest(response);
        }
    }
}
