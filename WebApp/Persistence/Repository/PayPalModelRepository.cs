using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebApp.Models.Entities;

namespace WebApp.Persistence.Repository
{
    public class PayPalModelRepository : Repository<PayPalModel, int>, IPayPalModelRepository
    {
        public PayPalModelRepository(DbContext context) : base(context)
        {
        }
    }

    
}