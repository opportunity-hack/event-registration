using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NetCoreReact.Models
{
    public class User
    {
        public int UserId { get; set; }

        public string Email { get; set; }

        public DateTime CreatedOn { get; set; }
    }
}
