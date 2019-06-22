using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApp.Models.PomModels
{
    public class PomModelTimetableForEdit
    {
        public PomModelTimetableForEdit()
        {
        }

        public int LineId { get; set; }
        public int DayId { get; set; }
        public string Departures { get; set; }
        public string NewDepartures { get; set; }
    }
}