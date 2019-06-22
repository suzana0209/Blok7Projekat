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
    [RoutePrefix("api/PassangerType")]
    public class PassangerTypesController : ApiController
    {
        //private ApplicationDbContext db = new ApplicationDbContext();
        private readonly IUnitOfWork unitOfWork;

        public PassangerTypesController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        // GET: api/PassangerTypes
        [Route("GetAllPassangerTypes")]
        public IQueryable<PassangerType> GetPassangerTypes()
        {
            return unitOfWork.PassangerTypes.GetAll().AsQueryable();
        }

        // GET: api/PassangerTypes/5
        //[ResponseType(typeof(PassangerType))]
        //public IHttpActionResult GetPassangerType(int id)
        //{
            //PassangerType passangerType = unitOfWork.PassangerTypes.Find(id);
            //if (passangerType == null)
            //{
            //    return NotFound();
            //}

            //return Ok(passangerType);
        //}

        // PUT: api/PassangerTypes/5
        //[ResponseType(typeof(void))]
        //public IHttpActionResult PutPassangerType(int id, PassangerType passangerType)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    if (id != passangerType.Id)
        //    {
        //        return BadRequest();
        //    }

        //    db.Entry(passangerType).State = EntityState.Modified;

        //    try
        //    {
        //        db.SaveChanges();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!PassangerTypeExists(id))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return StatusCode(HttpStatusCode.NoContent);
        //}

        // POST: api/PassangerTypes
        //[ResponseType(typeof(PassangerType))]
        //public IHttpActionResult PostPassangerType(PassangerType passangerType)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    db.PassangerTypes.Add(passangerType);
        //    db.SaveChanges();

        //    return CreatedAtRoute("DefaultApi", new { id = passangerType.Id }, passangerType);
        //}

        // DELETE: api/PassangerTypes/5
        //[ResponseType(typeof(PassangerType))]
        //public IHttpActionResult DeletePassangerType(int id)
        //{
        //    PassangerType passangerType = db.PassangerTypes.Find(id);
        //    if (passangerType == null)
        //    {
        //        return NotFound();
        //    }

        //    db.PassangerTypes.Remove(passangerType);
        //    db.SaveChanges();

        //    return Ok(passangerType);
        //}

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                unitOfWork.Dispose();
            }
            base.Dispose(disposing);
        }

        //private bool PassangerTypeExists(int id)
        //{
        //    return unitOfWork.PassangerTypes.Count(e => e.Id == id) > 0;
        //}
    }
}