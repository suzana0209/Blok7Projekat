using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace WebApp.Models.Entities
{
    public class Timetable
    {
        public Timetable()
        {
        }

        public int Id { get; set; }

        [ForeignKey("Day")]
        public int DayId { get; set; }
        public Day Day { get; set; }

        [ForeignKey("Line")]
        public int LineId { get; set; }
        public Line Line { get; set; }


        public string Departures { get; set; }
        public int Version { get; set; }
        
    }
}