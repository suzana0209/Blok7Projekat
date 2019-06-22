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
    [RoutePrefix("api/LineStations")]
    public class LineStationsController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();
        private readonly IUnitOfWork _unitOfWork;

        public LineStationsController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public LineStationsController()
        {
        }

        // GET: api/LineStations
        public IQueryable<LineStation> GetLineStations()
        {
            return db.LineStations;
        }

        [Route("GetLine")]
        // GET: api/LineStations/5
        [ResponseType(typeof(LineStation))]
        public IHttpActionResult GetLineStation(int id)
        {
            LineStation lineStation = _unitOfWork.LineStations.Get(id);
            if (lineStation == null)
            {
                return NotFound();
            }

            return Ok(lineStation);
        }

        // PUT: api/LineStations/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutLineStation(int id, LineStation lineStation)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != lineStation.Id)
            {
                return BadRequest();
            }

            db.Entry(lineStation).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LineStationExists(id))
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

        [Route("AddLineStations")]
        // POST: api/LineStations
        //[ResponseType(typeof(LineStation))]
        public IHttpActionResult PostLineStation(Line lineStations)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            List<LineStation> lineStation = new List<LineStation>();
            for (int i = 0; i < lineStations.ListOfStations.Count; i++)
            {
                LineStation l = new LineStation();
                l.OrdinalNumber = i;
                l.StationId = lineStations.ListOfStations[i].Id;
                l.LineId = lineStations.Id;
            }

            foreach (var item in lineStation)
            {
                _unitOfWork.LineStations.Add(item);
                _unitOfWork.Complete();
            }
            // db.LineStations.Add(lineStation);
            //db.SaveChanges();

            return Ok();

            //return CreatedAtRoute("DefaultApi", new { id = lineStation.Id }, lineStation);
        }

        // DELETE: api/LineStations/5
        [ResponseType(typeof(LineStation))]
        public IHttpActionResult DeleteLineStation(int id)
        {
            LineStation lineStation = db.LineStations.Find(id);
            if (lineStation == null)
            {
                return NotFound();
            }

            db.LineStations.Remove(lineStation);
            db.SaveChanges();

            return Ok(lineStation);
        }

        


        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool LineStationExists(int id)
        {
            return db.LineStations.Count(e => e.Id == id) > 0;
        }
    }
}