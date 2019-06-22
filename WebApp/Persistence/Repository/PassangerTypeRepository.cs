using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebApp.Models.Entities;

namespace WebApp.Persistence.Repository
{
    public class PassangerTypeRepository : Repository<PassangerType, int>, IPassangerTypeRepository
    {
        public PassangerTypeRepository(DbContext context) : base(context)
        {
        }
    }
}