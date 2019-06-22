using System;
using System.Data.Entity;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using WebApp.Models;
using WebApp.Models.Entities;

namespace WebApp.Persistence
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public virtual DbSet<AppUser> AppUser { get; set; }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<Day> Days { get; set; }
        //public DbSet<Departure> Departures { get; set; }
        public DbSet<Line> Lines { get; set; }
        public DbSet<PassangerType> PassangerTypes { get; set; }
        public DbSet<PriceList> PriceLists { get; set; }
        //public DbSet<RoleCoefficient> RoleCoefficients { get; set; }
        public DbSet<Station> Stations { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<TicketPrice> TicketPrices { get; set; }
        public DbSet<Timetable> Timetables { get; set; }
        public DbSet<TypeOfTicket> TypeOfTickets { get; set; }
        public DbSet<UserType> UserTypes { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<LineStation> LineStations { get; set; }



        public ApplicationDbContext()
            : base("DefaultConnection", throwIfV1Schema: false)
        {
        }
        
        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }
    }
}