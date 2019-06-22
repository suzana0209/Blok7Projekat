using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApp.Models.Entities
{
    public class PassangerType
    {
        public PassangerType()
        {
        }

        public PassangerType(string name)
        {
            if (name == "Student")
                RoleCoefficient = 0.5;
            else if (name == "Pensioner")
                RoleCoefficient = 0.4;
            else
                RoleCoefficient = 1;
            Name = name;
        }

        public int Id { get; set; }
        [Required]
        public String Name { get; set; }
        public double RoleCoefficient { get; set; }
        
    }

    public enum PassangerTypeEnum
    {
        Student,
        Pensioner,
        Default,
        None
    }
}