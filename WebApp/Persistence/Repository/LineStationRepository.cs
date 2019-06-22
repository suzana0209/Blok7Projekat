using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebApp.Models.Entities;

namespace WebApp.Persistence.Repository
{
    public class LineStationRepository : Repository<LineStation, int>, ILineStationRepository
    {
        protected ApplicationDbContext applicationDb { get { return context as ApplicationDbContext; } }

        public LineStationRepository(DbContext context) : base(context)
        {
        }

        public void CompleteLine(List<LineStation> list)
        {
            foreach (var item in list)
            {
                applicationDb.LineStations.Add(item);
                applicationDb.SaveChanges();
            }
        }
    }
}