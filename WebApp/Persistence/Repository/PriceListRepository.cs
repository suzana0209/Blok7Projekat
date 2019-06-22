using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebApp.Models.Entities;

namespace WebApp.Persistence.Repository
{
    public class PriceListRepository : Repository<PriceList, int>, IPriceListRepository
    {
        protected ApplicationDbContext Context { get { return context as ApplicationDbContext; } }
        public PriceListRepository(DbContext context) : base(context)
        {
        }

        public IEnumerable<PriceList> GetAllPricelists()
        {
            return Context.PriceLists.Include(p => p.ListOfTicketPrices).ToList();
        }
    }
}