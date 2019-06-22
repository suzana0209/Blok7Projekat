using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebApp.Models.Entities;

namespace WebApp.Persistence.Repository
{
    public interface IAppUserRepository : IRepository<AppUser, string>
    {
        JwtSecurityToken DecodeJwt(string protectedToken);
        IEnumerable<AppUser> GetAll(int pageIndex, int pageSize);

    }
}
