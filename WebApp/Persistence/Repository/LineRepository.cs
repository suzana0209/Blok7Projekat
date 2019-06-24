using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebApp.Models.Entities;

namespace WebApp.Persistence.Repository
{
    public class LineRepository : Repository<Line, int>, ILineRepository
    {
        protected ApplicationDbContext applicationDb { get { return context as ApplicationDbContext; } }
        //ApplicationDbContext applicationDb = new ApplicationDbContext();
        public LineRepository(DbContext context) : base(context)
        {

        }

        public IEnumerable<Line> CompleteLine()
        {
            var v = applicationDb.Lines.Include(p=> p.ListOfStations).ToList();
            //var v = db.Lines.Include(p => p.ListOfStations).ToList();
            return v;
        }

        public void Delete(int id)
        {
            //throw new NotImplementedException();
            var line = applicationDb.Lines.Where(q => q.Id == id).Include(p => p.LineStations);
            applicationDb.Lines.RemoveRange(line);
        }

        public string AddStationsInList(int lineId, List<Station> stations)
        {
            var line = applicationDb.Lines.Include(l => l.ListOfStations).Where(l => l.Id == lineId).FirstOrDefault();
            line.ListOfStations.Clear();


            //foreach (Station s in stations)
            //{
            //    line.ListOfStations.Add(applicationDb.Stations.Find(s.Id));
            //}

            Station stationFromDb = new Station();

            foreach (var item in stations)
            {
                stationFromDb = applicationDb.Stations.Find(item.Id);
                if(stationFromDb != null)
                {
                    if(stationFromDb.Version > item.Version)
                    {
                        return "NotOk";
                    }
                }
                else
                {
                    return "null";
                }
                line.ListOfStations.Add(stationFromDb);

            }

            //throw new NotImplementedException();
            return "Ok";
        }

        

        public Line GetIdLine(int regNumber)
        {
            List<Line> l = applicationDb.Lines.Where(p => p.RegularNumber == regNumber).ToList();
            return l[0];
        }

        public bool ExistLine(int idLine)
        {
            Line retLine = applicationDb.Lines.Find(idLine);
            return (retLine != null) ? true : false;

            //throw new NotImplementedException();
        }
    }
}