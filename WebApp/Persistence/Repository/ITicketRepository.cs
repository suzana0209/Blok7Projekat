using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebApp.Models.Entities;

namespace WebApp.Persistence.Repository
{
    public interface ITicketRepository : IRepository<Ticket, int>
    {
        bool NotifyViaEmail(string targetEmail, string subject, string body);
        Ticket GetTicketWithInclude(int id);
    }
}
