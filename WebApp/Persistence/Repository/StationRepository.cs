using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebApp.Models.Entities;
using WebApp.Models.PomModels;

namespace WebApp.Persistence.Repository
{
    public class StationRepository : Repository<Station, int>, IStationRepository
    {
        protected ApplicationDbContext applicationDb { get { return context as ApplicationDbContext; } }

        public StationRepository(DbContext context) : base(context)
        {
        }

        public List<Station> AllOrderedStations(int id)
        {
            List<LineStation> ret = new List<LineStation>();

            ret = applicationDb.LineStations.Where(i => i.LineId == id).OrderBy(o => o.OrdinalNumber).ToList();

            List<Station> retStation = new List<Station>();

            List<Station> stFromdb = applicationDb.Stations.ToList();

            List<int> retList = new List<int>();

            List<Station> retVal = new List<Station>();

            foreach (var item in ret)
            {
                if (stFromdb.Any(p => p.Id == item.StationId))
                {
                    retList.Add(item.StationId);
                }
            }

            for (int i = 0; i < retList.Count; i++)
            {
                int p = retList[i];
                foreach (var item in stFromdb)
                {
                    if (p == item.Id)
                    {
                        retVal.Add(item);
                    }
                }
            }

            return retVal;
        }

        public List<PomModelForLine> All()
        {
            List<PomModelForLine> retVal = new List<PomModelForLine>();
            foreach (var item in applicationDb.Lines.ToList())
            {
                PomModelForLine pp = new PomModelForLine();
                pp.Id = item.Id;
                pp.List = AllOrderedStations(item.Id);
                retVal.Add(pp);
            }
            return retVal;
        }
    }
}