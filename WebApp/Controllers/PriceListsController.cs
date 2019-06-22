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
    [RoutePrefix("api/Pricelist")]
    public class PriceListsController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();
        private readonly IUnitOfWork _unitOfWork;

        public PriceListsController()
        {
        }

        public PriceListsController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [Route("GetPricelists")]
        // GET: api/PriceLists
        public IEnumerable<PriceList> GetPriceLists()
        {
            return _unitOfWork.PriceLists.GetAll().ToList();
        }

        // GET: api/PriceLists/5
        [Route("GetPricelist")]
        [ResponseType(typeof(PriceList))]
        public PriceList GetPriceList()
        {
            
           PriceList p = _unitOfWork.PriceLists.GetAllPricelists().ToList().FindLast(x => x.ToTime >= DateTime.Now && x.FromTime <= DateTime.Now);
           return p;
        }

        [Route("GetPricelistLast")]
        [ResponseType(typeof(PriceList))]
        public PriceList GetPricelistLast()
        {
            return _unitOfWork.PriceLists.GetAllPricelists().ToList().Last();
        }

        // PUT: api/PriceLists/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutPriceList(int id, PriceList priceList)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != priceList.Id)
            {
                return BadRequest();
            }

            db.Entry(priceList).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PriceListExists(id))
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

        // POST: api/PriceLists
        [Route("Add")]
        [ResponseType(typeof(PriceList))]
        public bool PostPriceList(PomModelTicketPrices ticketPrices)
        {
            if (!ModelState.IsValid)
            {
                return false;
            }

            PriceList priceList = new PriceList();
            priceList = ticketPrices.PriceList;
            priceList.ListOfTicketPrices = new List<TicketPrice>();
            TicketPrice ticketPrice = new TicketPrice
            {
                TypeOfTicketId = _unitOfWork.TypeOfTickets.Find(k => k.Name == "TimeLimited").FirstOrDefault().Id,
                Price = ticketPrices.TimeLimited
            };

            priceList.ListOfTicketPrices.Add(ticketPrice);
            ticketPrice = new TicketPrice
            {
                TypeOfTicketId = _unitOfWork.TypeOfTickets.Find(k => k.Name == "Daily").FirstOrDefault().Id,
                Price = ticketPrices.Daily
            };
            priceList.ListOfTicketPrices.Add(ticketPrice);
            ticketPrice = new TicketPrice
            {
                TypeOfTicketId = _unitOfWork.TypeOfTickets.Find(k => k.Name == "Monthly").FirstOrDefault().Id,
                Price = ticketPrices.Monthly
            };
            priceList.ListOfTicketPrices.Add(ticketPrice);
            ticketPrice = new TicketPrice
            {
                TypeOfTicketId = _unitOfWork.TypeOfTickets.Find(k => k.Name == "Annual").FirstOrDefault().Id,
                Price = ticketPrices.Annual
            };

            priceList.ListOfTicketPrices.Add(ticketPrice);

            _unitOfWork.PriceLists.Add(priceList);
            _unitOfWork.Complete();

            return true;
        }

        [Route("Calculate")]
        public PomModelForAuthorization Calculate(PomModelForPriceList pom)
        {
            PomModelForAuthorization p = new PomModelForAuthorization();

            PassangerType pass= _unitOfWork.PassangerTypes.Find(x => x.Name == pom.PassangerType).FirstOrDefault();

            int idTicket = _unitOfWork.TypeOfTickets.Find(x => x.Name == pom.TypeOfTicket).FirstOrDefault().Id;

            double regularPriceTicket = _unitOfWork.TicketPrices.Find(x => (x.PriceListId == pom.PriceListId && x.TypeOfTicketId == idTicket)).FirstOrDefault().Price;

            double finallyPrice = regularPriceTicket - (regularPriceTicket * pass.RoleCoefficient);

            p.Id = finallyPrice.ToString();

            return p;
        }

        // DELETE: api/PriceLists/5
        [ResponseType(typeof(PriceList))]
        public IHttpActionResult DeletePriceList(int id)
        {
            PriceList priceList = db.PriceLists.Find(id);
            if (priceList == null)
            {
                return NotFound();
            }

            db.PriceLists.Remove(priceList);
            db.SaveChanges();

            return Ok(priceList);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool PriceListExists(int id)
        {
            return db.PriceLists.Count(e => e.Id == id) > 0;
        }
    }
}