using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebApp.Models.Entities;

namespace WebApp.Persistence.Repository
{
    public class UserTypeRepository : Repository<UserType, int>, IUserTypeRepository
    {
        public UserTypeRepository(DbContext context) : base(context)
        {
        }
    }
}