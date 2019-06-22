using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApp.Models.PomModels
{
    public class TimetablePomModel
    {
        public int LineId { get; set; }
        public string DayId { get; set; }
        public string Departures { get; set; }
    }
}