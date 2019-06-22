using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebApp.Persistence.Repository;

namespace WebApp.Persistence.UnitOfWork
{
    public interface IUnitOfWork : IDisposable
    {
        IAddressRepository Addresses { get; set; }
        IAppUserRepository AppUsers { get; set; }
        IDayRepository Days { get; set; }
        //IDepartureRepository Departures { get; set; }
        ILineRepository Lines { get; set; }
        IPassangerTypeRepository PassangerTypes { get; set; }
        IPriceListRepository PriceLists { get; set; }
        //IRoleCoefficientRepository RoleCoefficients { get; set; }
        IStationRepository Stations { get; set; }
        ITicketPriceRepository TicketPrices { get; set; }
        ITicketRepository Tickets { get; set; }
        ITimetableRepository Timetables { get; set; }
        ITypeOfTicketRepository TypeOfTickets { get; set; }
        IUserTypeRepository UserTypes { get; set; }
        IVehicleRepository Vehicles { get; set; }
        ILineStationRepository LineStations { get; set; }
        int Complete();
    }
}
