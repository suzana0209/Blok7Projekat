using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace WebApp.Models.Entities
{
    public class TicketPrice
    {
        public int Id { get; set; }
        
        public Double Price { get; set; }

        [ForeignKey("PriceList")]
        public int PriceListId { get; set; }
        public PriceList PriceList { get; set; }

        [ForeignKey("TypeOfTicket")]
        public int TypeOfTicketId { get; set; }
        public TypeOfTicket TypeOfTicket { get; set; }
    }
}