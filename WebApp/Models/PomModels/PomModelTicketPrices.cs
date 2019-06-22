using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApp.Models.Entities;

namespace WebApp.Models.PomModels
{
    public class PomModelTicketPrices
    {
        public int TimeLimited { get; set; }
        public int Daily { get; set; }
        public int Monthly { get; set; }
        public int Annual { get; set; }
        public int IdPriceList { get; set; }
        public PriceList PriceList { get; set; }
    }
}