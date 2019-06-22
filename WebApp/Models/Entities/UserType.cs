using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApp.Models.Entities
{
    public class UserType
    {
        public UserType()
        {
        }

        public UserType(string name)
        {
            Name = name;
        }

        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
    }

    public enum UserTypeEnum
    {
        Admin,
        Controller,
        AppUser
    }
}