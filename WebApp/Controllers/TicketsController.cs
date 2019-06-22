using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using WebApp.Models.Entities;
using WebApp.Models.PomModels;
using WebApp.Persistence;
using WebApp.Persistence.UnitOfWork;

namespace WebApp.Controllers
{
    [RoutePrefix("api/Tickets")]
    public class TicketsController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();
        IUnitOfWork _unitOfWork;

        protected TicketsController()
        {
        }

        public TicketsController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // GET: api/Tickets
        [Route("GetAllTypeOfTicket")]
        public IQueryable<TypeOfTicket> GetTickets()
        {
            return _unitOfWork.TypeOfTickets.GetAll().AsQueryable();
        }

        // GET: api/Tickets/5
        [Route("GetTicket")]
        [ResponseType(typeof(Ticket))]
        public IHttpActionResult GetTicket(int id)
        {
            Ticket ticket = _unitOfWork.Tickets.GetTicketWithInclude(id);

            if (ticket == null)
            {
                return NotFound();
            }
            if (ticket.AppUserId != null)
            {
                ticket.AppUserId = ticket.AppUser.Email;
            }


            return Ok(ticket);
        }

        // PUT: api/Tickets/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutTicket(int id, Ticket ticket)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != ticket.Id)
            {
                return BadRequest();
            }

            db.Entry(ticket).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TicketExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        [Route("Add")]
        // POST: api/Tickets
        //[ResponseType(typeof(void))]
        public IHttpActionResult PostTicket(PomModelForBuyTicket pom)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Ticket ticket = new Ticket();

            AppUser appUser = _unitOfWork.AppUsers.Find(user => user.Email == pom.Email).FirstOrDefault();
            TypeOfTicket tt = _unitOfWork.TypeOfTickets.Find(s => s.Name == pom.TypeOfTicket).FirstOrDefault();

            TicketPrice ticketPrice = _unitOfWork.TicketPrices.Find(a => a.TypeOfTicketId == tt.Id).FirstOrDefault();

            double coeff = _unitOfWork.PassangerTypes.Find(dd => dd.Id == appUser.PassangerTypeId).FirstOrDefault().RoleCoefficient;
            double c = ticketPrice.Price - (ticketPrice.Price * coeff);

            ticket.PriceOfTicket = c;

            ticket.AppUserId = appUser.Id;
            ticket.TicketPriceId = ticketPrice.Id;
            ticket.Valid = true;
            ticket.PurchaseDate = DateTime.Now;
            ticket.TypeOfTicketId = tt.Id;
            ticket.Email = pom.Email;

            _unitOfWork.Tickets.Add(ticket);
            _unitOfWork.Complete();

            return Ok(ticket.Id);
        }


        [Route("SendMail")]
        public string SendMail(PomModelForBuyTicket ticket)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState).ToString();
            }

            string subject = "Ticket purchase";
            string desc =   $"Dear {ticket.Email},\nYour purchase is successfull.\n " +
                $"Ticket price: {_unitOfWork.TicketPrices.Find(a => a.TypeOfTicketId == a.Id).FirstOrDefault().Price} din\n " +
                            $"Type of ticket:Time Limited\n" +
                            $"Time of purchase: {DateTime.Now}\n" +
                            $"Ticket is valid for the next hour.\n\n" +
                            $"Thank you.";
            var email = ticket.Email;
            TypeOfTicket tt = _unitOfWork.TypeOfTickets.Find(s => s.Name == ticket.TypeOfTicket).FirstOrDefault();
            TicketPrice ticketPrice = _unitOfWork.TicketPrices.Find(a => a.TypeOfTicketId == tt.Id).FirstOrDefault();

            Ticket storeTicket = new Ticket();
            storeTicket.Email = email;
            storeTicket.PriceOfTicket = ticketPrice.Price;
            storeTicket.PurchaseDate = DateTime.Now;
            storeTicket.TypeOfTicketId = tt.Id;
            storeTicket.Valid = true;
            storeTicket.TicketPriceId = ticketPrice.Id;

            _unitOfWork.Tickets.NotifyViaEmail(email, subject, desc);
            _unitOfWork.Tickets.Add(storeTicket);
            _unitOfWork.Complete();

            return "Ok";

        }


        
        [Route("ValidateTicket")]
        public string ValidateTicket(PomModelForAuthorization pomModel)
        {
            int idTicket = Int32.Parse(pomModel.Id);

            Ticket ticketFormDb = _unitOfWork.Tickets.Get(idTicket);

            string nameOfTicket = _unitOfWork.TypeOfTickets.Get(Int32.Parse(ticketFormDb.TypeOfTicketId.ToString())).Name;//get TimeLimited, Daily, Monthly,Annul

            if(ticketFormDb == null)
            {
                return "Ticket doesn't exist in db! ";
            }

            DateTime purchaseDateTime = DateTime.Parse(ticketFormDb.PurchaseDate.ToString());

            //int? v1;
            //int v2;
            //v2 = v1 == null ? default(int) : v1;

            if (ticketFormDb.AppUserId == null)
            {
                string s = CheckTicketWithoutUser(nameOfTicket, purchaseDateTime);
                return s;
            }
            else
            {
                string ss = CheckTicket(nameOfTicket, purchaseDateTime);
                return ss;
            }


            //return "Ok";
        }

        public string CheckTicketWithoutUser(string typeTicket, DateTime dateTime)
        {
            DateTime currentDateTime = DateTime.Now;
            dateTime = dateTime.AddHours(1);

            if (dateTime < currentDateTime)     //karta je istekla
                return "Ticket isn't valid! Time is up!";

            return "Ticket is valid!";
        }

        public string CheckTicket(string typeTicket, DateTime dateTime)
        {
            DateTime pomDateTime = new DateTime();
            DateTime expiritionDateTime = new DateTime();

            if(typeTicket == "TimeLimited")
            {
                return CheckTicketWithoutUser(typeTicket, dateTime);
            }
            else if(typeTicket == "Daily")
            {
                pomDateTime = dateTime.AddDays(1);
                expiritionDateTime = new DateTime(pomDateTime.Year, pomDateTime.Month, pomDateTime.Day);
                return IsTicketValid(DateTime.Now, expiritionDateTime);
            }
            else if(typeTicket == "Monthly")
            {
                pomDateTime = dateTime.AddMonths(1);
                expiritionDateTime = new DateTime(pomDateTime.Year, pomDateTime.Month, 1);
                return IsTicketValid(DateTime.Now, expiritionDateTime);
            }
            else if( typeTicket == "Annual")
            {
                pomDateTime = dateTime.AddYears(1);
                expiritionDateTime = new DateTime(pomDateTime.Year, 1, 1);
                return IsTicketValid(DateTime.Now, expiritionDateTime);
            }
            return "Ticket is valid!";
        }

        public string IsTicketValid(DateTime current, DateTime expirition)
        {
            if (current > expirition)
                return "Ticket isn't valid! Time is up! (register user)";
            else
                return "Ticket is valid!";
        }

        [Route("GetTicketWithCurrentAppUser")]
        //[ResponseType(typeof(Ticket))]
        public List<Ticket> GetTicketWithCurrentAppUser(string pom)
        {
            if (!ModelState.IsValid)
            {
                return null;
                //return BadRequest(ModelState).ToString();
            }

            List<Ticket> ret = new List<Ticket>();

            string userId = pom.ToString();
            string nameTicket = "";

            List<Ticket> ticketFormDb = _unitOfWork.Tickets.Find(a => a.AppUserId == userId).ToList();

            foreach (var item in ticketFormDb)
            {
                nameTicket = _unitOfWork.TypeOfTickets.Get(Int32.Parse(item.TypeOfTicketId.ToString())).Name;
                if(CheckTicket(nameTicket, DateTime.Parse(item.PurchaseDate.ToString())) != "Ticket is valid!")
                {
                    item.Valid = false;
                }
                
            }

            return ticketFormDb;
        }


        // DELETE: api/Tickets/5
        [ResponseType(typeof(Ticket))]
        public IHttpActionResult DeleteTicket(int id)
        {
            Ticket ticket = db.Tickets.Find(id);
            if (ticket == null)
            {
                return NotFound();
            }

            db.Tickets.Remove(ticket);
            db.SaveChanges();

            return Ok(ticket);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TicketExists(int id)
        {
            return db.Tickets.Count(e => e.Id == id) > 0;
        }
    }
}