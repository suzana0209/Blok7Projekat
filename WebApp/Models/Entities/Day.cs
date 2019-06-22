using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApp.Models.Entities
{
    public class Day
    {
        public Day()
        {
            ListOfTimetables = new List<Timetable>();
        }

        public Day(string name)
        {
            Name = name;
        }

        public int Id { get; set; }       
        //vrijednost iz DayType-a
        [Required]
        public string Name { get; set; }
        //public List<Departure> ListOfDepartures { get; set; }
        public List<Timetable> ListOfTimetables { get; set; }
    }

    public enum DayType
    {
        Workday,
        Saturday,
        Sunday
    }
}