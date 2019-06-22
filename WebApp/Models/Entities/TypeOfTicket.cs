using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApp.Models.Entities
{
    public class TypeOfTicket
    {
        public TypeOfTicket()
        {
        }

        public TypeOfTicket(string name)
        {
            Name = name;
            ListOfTicketPrices = new List<TicketPrice>();
        }

        public int Id { get; set; }
        [Required]
        public String Name { get; set; }
        List<TicketPrice> ListOfTicketPrices { get; set; }
       
    }

    public enum TicketTypeEnum
    {
        TimeLimited,
        Daily,
        Monthly,
        Annual
    }
}