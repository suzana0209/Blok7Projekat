using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebApp.Models.Entities;

namespace WebApp.Persistence.Repository
{
    public class AddressRepository : Repository<Address, int>, IAddressRepository
    {
        public AddressRepository(DbContext context) : base(context)
        {
        }
    }
}