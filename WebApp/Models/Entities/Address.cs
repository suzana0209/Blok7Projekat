using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApp.Models.Entities
{
    public class Address
    {
        public Address()
        {
        }

        public int Id { get; set; }
        public String City { get; set; }
        public String Street { get; set; }
        public String Number { get; set; }
    }
}