using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebApp.Models.Entities;

namespace WebApp.Persistence.Repository
{
    public class DayRepository : Repository<Day, int>, IDayRepository
    {
        protected ApplicationDbContext applicationDb { get { return context as ApplicationDbContext; } }


        public DayRepository(DbContext context) : base(context)
        {
            
        }

       
    }
}