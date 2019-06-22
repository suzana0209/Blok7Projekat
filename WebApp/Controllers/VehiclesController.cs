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
    [RoutePrefix("api/Vehicles")]
    public class VehiclesController : ApiController
    {
        //private ApplicationDbContext db = new ApplicationDbContext();
        private readonly IUnitOfWork _unitOfWork;

        public VehiclesController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // GET: api/Vehicles
        [Route("GetAll")]
        public IQueryable<Vehicle> GetVehicles()
        {
            return _unitOfWork.Vehicles.GetAll().AsQueryable();
        }

        [Route("GetLinesForVehicle")]
        public List<Line> GetLinesForVehicle()
        {
            var lines = _unitOfWork.Vehicles.GetAll().ToList();

            List<Line> retVal = new List<Line>();
            List<int> niz = new List<int>();
            for (int i = 0; i < lines.Count; i++)
            {
                if (lines[i].LineId == null)
                    niz.Add(i);
            }
            foreach (var item in niz)
            {
                lines.RemoveAt(item);
            }

            foreach (var item in _unitOfWork.Lines.GetAll().ToList())
            {
                
                if (!lines.Any(x => x.LineId == item.Id))
                    retVal.Add(item);
            }

            return retVal;
            
        }

        [Route("GetVehicle")]
        // GET: api/Vehicles/5
        [ResponseType(typeof(Vehicle))]
        public IHttpActionResult GetVehicle(int id)
        {
            Vehicle vehicle = _unitOfWork.Vehicles.Get(id);
            if (vehicle == null)
            {
                return NotFound();
            }

            return Ok(vehicle);
        }

        // PUT: api/Vehicles/5
        [ResponseType(typeof(void))]
        //public IHttpActionResult PutVehicle(int id, Vehicle vehicle)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    if (id != vehicle.Id)
        //    {
        //        return BadRequest();
        //    }

        //    db.Entry(vehicle).State = EntityState.Modified;

        //    try
        //    {
        //        db.SaveChanges();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!VehicleExists(id))
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
        // POST: api/Vehicles
        [ResponseType(typeof(Vehicle))]
        public IHttpActionResult PostVehicle(Vehicle vehicle)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _unitOfWork.Vehicles.Add(vehicle);
            _unitOfWork.Complete();

            return Ok(vehicle.Id);
            //return CreatedAtRoute("DefaultApi", new { id = vehicle.Id }, vehicle);
        }

        [Route("TimetablesForVehicle")]
        public List<Timetable> GetTimbletable()
        {
            List<Timetable> retVal = new List<Timetable>();
            List<Vehicle> vehicles = _unitOfWork.Vehicles.GetAll().ToList();
            foreach (var item in _unitOfWork.Timetables.GetAll())
            {
                if (vehicles.Any(x => x.LineId == item.LineId))
                    retVal.Add(item);
            }
            return retVal;
        }

        [Route("Delete")]
        // DELETE: api/Vehicles/5
        [ResponseType(typeof(Vehicle))]
        public IHttpActionResult DeleteVehicle(int id)
        {
            Vehicle vehicle = _unitOfWork.Vehicles.Get(id);
            if (vehicle == null)
            {
                return NotFound();
            }

            _unitOfWork.Vehicles.Remove(vehicle);
            _unitOfWork.Complete();

            return Ok(vehicle);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _unitOfWork.Dispose();
            }
            base.Dispose(disposing);
        }

        [Route("Edit")]
        public IHttpActionResult Edit(Vehicle v)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Vehicle vv = _unitOfWork.Vehicles.Find(x => x.Id == v.Id).FirstOrDefault();
            vv.LineId = v.LineId;

            _unitOfWork.Vehicles.Update(vv);
            _unitOfWork.Complete();
            return Ok();

        }

        //private bool VehicleExists(int id)
        //{
        //    return db.Vehicles.Count(e => e.Id == id) > 0;
        //}
    }
}