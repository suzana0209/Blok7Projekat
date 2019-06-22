using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace WebApp.Models.Entities
{
    public class LineStation
    {
        public int Id { get; set; }
        public int OrdinalNumber { get; set; }

        [ForeignKey("Station")]
        public int StationId { get; set; }
        public Station Station { get; set; }

        [ForeignKey("Line")]
        public int LineId { get; set; }
        public Line Line { get; set; }


    }
}