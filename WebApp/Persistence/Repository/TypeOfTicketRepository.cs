using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebApp.Models.Entities;

namespace WebApp.Persistence.Repository
{
    public class TypeOfTicketRepository : Repository<TypeOfTicket, int>, ITypeOfTicketRepository
    {
        public TypeOfTicketRepository(DbContext context) : base(context)
        {
        }
    }
}