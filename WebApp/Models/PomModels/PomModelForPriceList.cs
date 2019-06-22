using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApp.Models.PomModels
{
    public class PomModelForPriceList
    {
        public PomModelForPriceList()
        {
        }

        public PomModelForPriceList(int priceListId, string passangerType, string typeOfTicket)
        {
            PriceListId = priceListId;
            PassangerType = passangerType;
            TypeOfTicket = typeOfTicket;
        }

        public int PriceListId { get; set; }
        public string PassangerType { get; set; }
        public string TypeOfTicket { get; set; }
       
    }
}