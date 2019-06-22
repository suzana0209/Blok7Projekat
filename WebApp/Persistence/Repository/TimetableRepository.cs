using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebApp.Models.Entities;

namespace WebApp.Persistence.Repository
{
    public class TimetableRepository : Repository<Timetable, int>, ITimetableRepository
    {
        protected ApplicationDbContext applicationDb { get { return context as ApplicationDbContext; } }

        public TimetableRepository(DbContext context) : base(context)
        {
        }

        public List<Timetable> GetAllTimetable()
        {
            return applicationDb.Timetables.ToList();
            //throw new NotImplementedException();
        }

        public List<Timetable> LineInTimetables()
        {

            List<Timetable> tt = applicationDb.Timetables.Include(p => p.LineId).ToList();

            return tt;
            //throw new NotImplementedException();
        }

        public Timetable GetTimetable(int idTimetable)
        {
            return applicationDb.Timetables.Find(idTimetable);
        }
    }
}