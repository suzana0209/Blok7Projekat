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
    [RoutePrefix("api/Stations")]
    public class StationsController : ApiController
    {
        //private ApplicationDbContext db = new ApplicationDbContext();
        private readonly IUnitOfWork _unitOfWork;

        public StationsController()
        {
        }

        public StationsController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // GET: api/Stations
        [Route("GetAll")]
        public IQueryable<Station> GetStations()
        {
            var v = _unitOfWork.Stations.GetAll().AsQueryable();
            //return db.Stations;
            return v;
        }


        [Route("GetOrderedAll")]
        [ResponseType(typeof(Station))]
        public IQueryable<Station> GetOrderedStations(int id)
        {
            return _unitOfWork.Stations.AllOrderedStations(id).AsQueryable();
        }

        [Route("GetOrderedAllLines")]
        [ResponseType(typeof(Station))]
        public List<PomModelForLine> GetOrderedStationsLines()
        {
            List<PomModelForLine> keyValuePairs = new List<PomModelForLine>();
            keyValuePairs = _unitOfWork.Stations.All();
            return keyValuePairs;
        }

        [Route("GetIdes")]
        public List<int> GetIdes()
        {
            List<PomModelForLine> keyValuePairs = new List<PomModelForLine>();
            keyValuePairs = _unitOfWork.Stations.All();
            List<int> retVal = new List<int>();
            foreach (var item in keyValuePairs)
            {
                retVal.Add(item.Id);
            }

            return retVal;
        }

        // GET: api/Stations/5
        //[ResponseType(typeof(Station))]
        //public IHttpActionResult GetStation(int id)
        //{
        //    Station station = db.Stations.Find(id);
        //    if (station == null)
        //    {
        //        return NotFound();
        //    }

        //    return Ok(station);
        //}


        // PUT: api/Stations/5
        //[ResponseType(typeof(void))]
        //public IHttpActionResult PutStation(int id, Station station)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    if (id != station.Id)
        //    {
        //        return BadRequest();
        //    }

        //    db.Entry(station).State = EntityState.Modified;

        //    try
        //    {
        //        db.SaveChanges();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!StationExists(id))
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

        [Route("Add")]
        // POST: api/Stations
        [ResponseType(typeof(Station))]
        public IHttpActionResult PostStation(Station station)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //db.Stations.Add(station);
            //db.SaveChanges();

            _unitOfWork.Stations.Add(station);
            _unitOfWork.Complete();

            return Ok(station.Id);

            //return CreatedAtRoute("DefaultApi", new { id = station.Id }, station);
        }
        
        [HttpPost]
        [Route("Edit")]
        // POST: api/Stations
        [ResponseType(typeof(Station))]
        public IHttpActionResult EditStation(Station station)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            _unitOfWork.Stations.Update(station);
            _unitOfWork.Complete();
            return Ok(station.Id);
            
            
        }

        [Route("Delete")]
        // DELETE: api/Stations/5
        [ResponseType(typeof(Station))]
        public IHttpActionResult DeleteStation(int id)
        {
            Station station = _unitOfWork.Stations.Get(id);
            if (station == null)
            {
                return NotFound();
            }

            _unitOfWork.Stations.Remove(station);
            _unitOfWork.Complete();

            return Ok(station);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _unitOfWork.Dispose();
            }
            base.Dispose(disposing);
        }

        //private bool StationExists(int id)
        //{
        //    return db.Stations.Count(e => e.Id == id) > 0;
        //}
    }
}