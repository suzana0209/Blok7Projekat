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
using WebApp.Persistence;
using WebApp.Persistence.UnitOfWork;

namespace WebApp.Controllers
{
    [RoutePrefix("api/PayPalModels")]
    public class PayPalModelsController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();
        private readonly IUnitOfWork _unitOfWork;

        public PayPalModelsController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // GET: api/PayPalModels
        public IQueryable<PayPalModel> GetPayPalModels()
        {
            return db.PayPalModels;
        }

        // GET: api/PayPalModels/5
        [ResponseType(typeof(PayPalModel))]
        public IHttpActionResult GetPayPalModel(int id)
        {
            PayPalModel payPalModel = db.PayPalModels.Find(id);
            if (payPalModel == null)
            {
                return NotFound();
            }

            return Ok(payPalModel);
        }

        // PUT: api/PayPalModels/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutPayPalModel(int id, PayPalModel payPalModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != payPalModel.Id)
            {
                return BadRequest();
            }

            db.Entry(payPalModel).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PayPalModelExists(id))
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

        // POST: api/PayPalModels
        [ResponseType(typeof(PayPalModel))]
        [Route("Add")]
        public IHttpActionResult PostPayPalModel(PayPalModel payPalModel1)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            PayPalModel p = new PayPalModel();
            p.PayementId = payPalModel1.PayementId;
            p.PayerEmail = payPalModel1.PayerEmail;
            p.PayerName = payPalModel1.PayerName;
            p.PayerSurname = payPalModel1.PayerSurname;
            p.CurrencyCode = payPalModel1.CurrencyCode;
            p.Status = payPalModel1.Status;
            p.Value = payPalModel1.Value;
            p.CreateTime = DateTime.Parse(payPalModel1.CreateTime.ToString());
            DateTime pom = p.CreateTime.Value.AddHours(2);
            p.CreateTime = pom;


            _unitOfWork.PayPalModels.Add(payPalModel1);
            _unitOfWork.Complete();

            //db.PayPalModels.Add(payPalModel1);
            //db.SaveChanges();

            return Ok(payPalModel1.Id);

            //return CreatedAtRoute("DefaultApi", new { id = payPalModel1.Id }, payPalModel1);
        }

        // DELETE: api/PayPalModels/5
        [ResponseType(typeof(PayPalModel))]
        public IHttpActionResult DeletePayPalModel(int id)
        {
            PayPalModel payPalModel = db.PayPalModels.Find(id);
            if (payPalModel == null)
            {
                return NotFound();
            }

            db.PayPalModels.Remove(payPalModel);
            db.SaveChanges();

            return Ok(payPalModel);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool PayPalModelExists(int id)
        {
            return db.PayPalModels.Count(e => e.Id == id) > 0;
        }
    }
}