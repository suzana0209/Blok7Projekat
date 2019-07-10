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
        //private ApplicationDbContext db = new ApplicationDbContext();
        private readonly IUnitOfWork _unitOfWork;

        public LineStationsController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public LineStationsController()
        {
        }

        // GET: api/LineStations
        

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
            

            return Ok();

            //return CreatedAtRoute("DefaultApi", new { id = lineStation.Id }, lineStation);
        }

        // DELETE: api/LineStations/5
       
        


        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _unitOfWork.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}