using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApp.Models.Entities
{
    public class Station
    {
        public Station()
        {
            ListOfLines = new List<Line>();
        }

        public int Id { get; set; }
        [Required]
        public String Name { get; set; }
        public String AddressStation { get; set; }
        public Double Longitude { get; set; }
        public Double Latitude { get; set; }
        public int Version { get; set; }

        public List<Line> ListOfLines { get; set; }
        public List<LineStation> LineStations { get; set; }

    }
}