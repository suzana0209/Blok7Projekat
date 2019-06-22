using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebApp.Models.Entities;

namespace WebApp.Persistence.Repository
{
    public interface ILineRepository : IRepository<Line, int>
    {
        IEnumerable<Line> CompleteLine();

        void Delete(int id);

        void AddStationsInList(int lineId, List<Station> stations);

        //List<Line> LineInTimetable();

        Line GetIdLine(int regNumber);
    }

}
