using System.Collections.Generic;

namespace NetCoreReact.Models.DTO
{
    public class DataResponse<T> : Response
    {
        public List<T> Data { get; set; }
    }
}
