using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebApp.Models.Entities;

namespace WebApp.Persistence.Repository
{
    public class VehicleRepository : Repository<Vehicle, int>, IVehicleRepository
    {
        protected ApplicationDbContext applicationDb { get { return context as ApplicationDbContext; } }

        public VehicleRepository(DbContext context) : base(context)
        {
        }

        public IEnumerable<Line> GetLineFromDb()
        {
            return null;


            //throw new NotImplementedException();
        }
    }
}