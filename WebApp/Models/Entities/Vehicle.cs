using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace WebApp.Models.Entities
{
    public class Vehicle
    {
        public int Id { get; set; }
        [Required]
        public String RegistrationNumber { get; set; }
        public String TypeOfVehicle { get; set; }
        //public Double Longitude { get; set; }
        //public Double Latitude { get; set; }

        [ForeignKey("Line")]
        public int? LineId { get; set; }
        public Line Line { get; set; }
    }
}