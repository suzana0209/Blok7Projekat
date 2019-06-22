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
    [RoutePrefix("api/TicketPrices")]
    public class TicketPricesController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();
        private readonly IUnitOfWork _unitOfWork;

        public TicketPricesController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public TicketPricesController()
        {
        }

        [Route("GetAllTicketPrices")]
        public IEnumerable<TicketPrice> GetTicketPrices()
        {
            return _unitOfWork.TicketPrices.GetAll().ToList();
        }

        [Route("GetValidPrices")]
        public PomModelTicketPrices GetValidPrices(int id)
        {
            PomModelTicketPrices ticketPrice = new PomModelTicketPrices();
            var p = _unitOfWork.TicketPrices.Find(x => x.PriceListId == id);

            TypeOfTicket typeOfTicket = _unitOfWork.TypeOfTickets.Find(m => m.Name == "Daily").FirstOrDefault();
            ticketPrice.Daily = (int)p.First(x => x.TypeOfTicketId == typeOfTicket.Id).Price;
            typeOfTicket = _unitOfWork.TypeOfTickets.Find(m => m.Name == "Monthly").FirstOrDefault();
            ticketPrice.Monthly = (int)p.First(x => x.TypeOfTicketId == typeOfTicket.Id).Price;
            typeOfTicket = _unitOfWork.TypeOfTickets.Find(m => m.Name == "Annual").FirstOrDefault();
            ticketPrice.Annual = (int)p.First(x => x.TypeOfTicketId == typeOfTicket.Id).Price;
            typeOfTicket = _unitOfWork.TypeOfTickets.Find(m => m.Name == "TimeLimited").FirstOrDefault();
            ticketPrice.TimeLimited = (int)p.First(x => x.TypeOfTicketId == typeOfTicket.Id).Price;
            ticketPrice.IdPriceList = id;

            return ticketPrice;
        }


        [Route("GetTicketPrice")]
        // GET: api/TicketPrices/5
        [ResponseType(typeof(TicketPrice))]
        public IHttpActionResult GetTicketPrices(int id)
        {
            TicketPrice ticketPrices = _unitOfWork.TicketPrices.Get(id);
            if (ticketPrices == null)
            {
                return NotFound();
            }

            return Ok(ticketPrices);
        }

        // PUT: api/TicketPrices/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutTicketPrice(int id, TicketPrice ticketPrice)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != ticketPrice.Id)
            {
                return BadRequest();
            }

            db.Entry(ticketPrice).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TicketPriceExists(id))
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
        [ResponseType(typeof(TicketPrice))]
        public IHttpActionResult PostTicketPrices([FromBody] PomModelTicketPrices hm)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            TicketPrice ticketPrice = new TicketPrice
            {
                TypeOfTicketId = _unitOfWork.TypeOfTickets.Find(k => k.Name == "Hourly").FirstOrDefault().Id,
                PriceListId = _unitOfWork.PriceLists.Get(hm.IdPriceList).Id,
                Price = hm.TimeLimited
            };

            _unitOfWork.TicketPrices.Add(ticketPrice);
            ticketPrice = new TicketPrice
            {
                TypeOfTicketId = _unitOfWork.TypeOfTickets.Find(k => k.Name == "Daily").FirstOrDefault().Id,
                PriceListId = _unitOfWork.PriceLists.Get(hm.IdPriceList).Id,
                Price = hm.Daily
            };
            _unitOfWork.TicketPrices.Add(ticketPrice);
            ticketPrice = new TicketPrice
            {
                TypeOfTicketId = _unitOfWork.TypeOfTickets.Find(k => k.Name == "Monthly").FirstOrDefault().Id,
                PriceListId = _unitOfWork.PriceLists.Get(hm.IdPriceList).Id,
                Price = hm.Monthly
            };
            _unitOfWork.TicketPrices.Add(ticketPrice);
            ticketPrice = new TicketPrice
            {
                TypeOfTicketId = _unitOfWork.TypeOfTickets.Find(k => k.Name == "Annual").FirstOrDefault().Id,
                PriceListId = _unitOfWork.PriceLists.Get(hm.IdPriceList).Id,
                Price = hm.Annual
            };

            _unitOfWork.TicketPrices.Add(ticketPrice);

            _unitOfWork.Complete();
            return Ok();
            
        }

        // DELETE: api/TicketPrices/5
        [ResponseType(typeof(TicketPrice))]
        public IHttpActionResult DeleteTicketPrice(int id)
        {
            TicketPrice ticketPrice = db.TicketPrices.Find(id);
            if (ticketPrice == null)
            {
                return NotFound();
            }

            db.TicketPrices.Remove(ticketPrice);
            db.SaveChanges();

            return Ok(ticketPrice);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TicketPriceExists(int id)
        {
            return db.TicketPrices.Count(e => e.Id == id) > 0;
        }
    }
}