using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Web;
using WebApp.Models.Entities;

namespace WebApp.Persistence.Repository
{
    public class TicketRepository : Repository<Ticket, int>, ITicketRepository
    {
        protected ApplicationDbContext Context { get { return context as ApplicationDbContext; } }

        public TicketRepository(DbContext context) : base(context)
        {
        }

        public Ticket GetTicketWithInclude(int id)
        {
            List<Ticket> t = Context.Tickets.Include(x => x.AppUser).ToList();
            Ticket tt = t.Find(x => x.Id == id);
            return tt;
        }

        public bool NotifyViaEmail(string targetEmail, string subject, string body)
        {
            var client = new SmtpClient("smtp.gmail.com", 587)
            {
                Credentials = new NetworkCredential("pusgs2018.19projekat@gmail.com", "pusgs2019"),
                EnableSsl = true
            };

            client.Send("pusgs2018.19projekat@gmail.com", targetEmail, subject, body);
            return true;
            
        }
    }
}