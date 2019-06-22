using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebApp.Models.Entities;
using WebApp.Models.PomModels;

namespace WebApp.Persistence.Repository
{
    public interface IStationRepository : IRepository<Station, int>
    {
        List<Station> AllOrderedStations(int id);
       List<PomModelForLine> All();
    }
}
