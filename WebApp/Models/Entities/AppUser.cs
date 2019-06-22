using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace WebApp.Models.Entities
{
    public class AppUser
    {
        [Key]
        public String Id { get; set; }
        public String Name { get; set; }
        public String LastName { get; set; }
        public String Email { get; set; }
        public bool Activated { get; set; }
        public String Image { get; set; }

        [ForeignKey("PassangerType")]
        public int? PassangerTypeId { get; set; }
        public PassangerType PassangerType { get; set; }

        [ForeignKey("UserType")]
        public int? UserTypeId { get; set; }
        public UserType UserType { get; set; }

        [ForeignKey("Address")]
        public int? AddressId { get; set; }
        public Address Address { get; set; }


        public DateTime? Birthaday { get; set; }

        public bool Deny { get; set; }

        //[ForeignKey("RoleCoefficient")]
        //public int? RoleCoefficientId { get; set; }
        //public RoleCoefficient RoleCoefficient { get; set; }
        
    }
}