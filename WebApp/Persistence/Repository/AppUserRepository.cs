using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IdentityModel.Tokens;
using System.Linq;
using System.Web;
using WebApp.Models.Entities;

namespace WebApp.Persistence.Repository
{
    public class AppUserRepository : Repository<AppUser, string>, IAppUserRepository
    {
        protected ApplicationDbContext applicationDb { get { return context as ApplicationDbContext; } }


        public AppUserRepository(DbContext context) : base(context)
        {
        }

        public JwtSecurityToken DecodeJwt(string protectedToken)
        {
            var handler = new JwtSecurityTokenHandler();
            var decodedToken = handler.ReadToken(protectedToken) as JwtSecurityToken;

            return decodedToken;
        }

        public IEnumerable<AppUser> GetAll(int pageIndex, int pageSize)
        {
            return applicationDb.AppUser.Skip((pageIndex - 1) * pageSize).Take(pageSize);
        }
    }
}