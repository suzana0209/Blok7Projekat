using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebApp.Models.Entities;

namespace WebApp.Persistence.Repository
{
    public interface ILineStationRepository : IRepository<LineStation, int>
    {
        void CompleteLine(List<LineStation> list);

    }
}
