using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApp.Models.Entities;

namespace WebApp.Models.PomModels
{
    public class PomModelForLine
    {
        public PomModelForLine()
        {
            List = new List<Station>();
        }

        public int Id { get; set; }
        public List<Station> List { get; set; }
    }
}