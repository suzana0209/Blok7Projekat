using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using Unity;
using WebApp.Persistence.Repository;

namespace WebApp.Persistence.UnitOfWork
{
    public class DemoUnitOfWork : IUnitOfWork
    {
        private readonly DbContext _context;
      
        public DemoUnitOfWork(DbContext context)
        {
            _context = context;
        }

        [Dependency]
        public IAddressRepository Addresses { get; set; }
        [Dependency]
        public IAppUserRepository AppUsers { get; set; }
        [Dependency]
        public IDayRepository Days { get; set; }
        //[Dependency]
        //public IDepartureRepository Departures { get; set; }
        [Dependency]
        public ILineRepository Lines { get; set; }

        [Dependency]
        public ILineStationRepository LineStations { get; set; }

        [Dependency]
        public IPassangerTypeRepository PassangerTypes { get; set; }
        [Dependency]
        public IPriceListRepository PriceLists { get; set; }
        //[Dependency]
        //public IRoleCoefficientRepository RoleCoefficients { get; set; }
        [Dependency]
        public IStationRepository Stations { get; set; }
        [Dependency]
        public ITicketPriceRepository TicketPrices { get; set; }
        [Dependency]
        public ITicketRepository Tickets { get; set; }
        [Dependency]
        public ITimetableRepository Timetables { get; set; }
        [Dependency]
        public ITypeOfTicketRepository TypeOfTickets { get; set; }
        [Dependency]
        public IUserTypeRepository UserTypes { get; set; }
        [Dependency]
        public IVehicleRepository Vehicles { get; set; }



        public int Complete()
        {
            return _context.SaveChanges();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}