using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApp.Models.Entities
{
    public class PayPalModel
    {
        [Key]
        public int Id { get; set; }
        public String PayementId { get; set; }
        public String PayerEmail { get; set; }
        public String PayerName { get; set; }
        public String PayerSurname { get; set; }
        public DateTime? CreateTime { get; set; }
        public String CurrencyCode { get; set; }   //valuta
        public String Status { get; set; } //Completed
        public Double Value { get; set; }
    }
}