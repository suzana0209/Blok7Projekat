using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApp.Models.PomModels
{
    public class PomModelForBuyTicket
    {
        public PomModelForBuyTicket()
        {
        }

        public string Email { get; set; }
        public string TypeOfTicket { get; set; }
        public DateTime PurchaseDate { get; set; }
    }

    public class PomModelForAddTicketPayPal
    {
        public PomModelForAddTicketPayPal()
        {
        }

        public PomModelForBuyTicket pomModelForBuyTicket { get; set; }
        public int PayPalModelId { get; set; }
    }
}