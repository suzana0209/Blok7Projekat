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
using WebApp.Hubs;
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
        private CvlHub _hub;

        public StationsController()
        {
        }

        public StationsController(IUnitOfWork unitOfWork, CvlHub hub)
        {
            _unitOfWork = unitOfWork;
            _hub = hub;

        }

        // GET: api/Stations
        [Route("GetAll")]
        public IQueryable<Station> GetStations()
        {
            var v = _unitOfWork.Stations.GetAll().AsQueryable();
            //return db.Stations;
            return v;
        }

        [HttpPost]
        [Route("SendStationsToHub")]
        public IHttpActionResult SendStationsToHub(List<Station> listStations)
        {
            //if (!ModelState.IsValid)
            //{
            //    return BadRequest(ModelState);
            //}

            _hub.AddStations(listStations);
            return Ok();
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

        
        [Route("AlredyExistStation")]
        public string AlredyExistStation(Station station)
        {
            if(_unitOfWork.Stations.GetAll().ToList() == null)
            {
                return "null";
            }

            Station statFromDb = _unitOfWork.Stations.Find(a => a.Name == station.Name).FirstOrDefault();
            if(statFromDb != null)
            {
                return "Yes";   //postoji -> Ne dodaj!!!
            }

            return "No";    //ne postoji u bazi -> mogu dodati
        }

        [Route("AlredyExistsStationForEdit")]
        public string AlredyExistsStationForEdit(Station station)
        {
            List<Station> stationsFromDb = _unitOfWork.Stations.GetAll().ToList();

            if(stationsFromDb == null)
            {
                return "null";
            }
            
            Station stat = stationsFromDb.Find(a => a.AddressStation == station.AddressStation);

            string s = (stat != null) ? "Yes" : "No";

            return s;
            //return "No"; //ne postoji - > mogu izmijeniti stanicu
        }

        [Route("Add")]
        // POST: api/Stations
        [ResponseType(typeof(Station))]
        public IHttpActionResult PostStation(Station station)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            if (_unitOfWork.Stations.ExistStation(station.Id))
            {
                return Content(HttpStatusCode.Conflict, $" WARNING: Station with {station.Id} ID already exists in database !");
            }

            if(station.Version != 0)
            {
                station.Version = 0;
            }

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

            Station stationFromDb = _unitOfWork.Stations.Get(station.Id);
            if(stationFromDb != null)
            {
                if(stationFromDb.Version > station.Version)
                {
                    return Content(HttpStatusCode.Conflict, $" WARNING: You are trying to edit a station with ID {stationFromDb.Id}  that has been changed recently!");
                }
            }
            else
            {
                return Content(HttpStatusCode.NotFound, $"Station that you are trying to edit with ID {station.Id}  do not exist in database! ");
            }

            stationFromDb.Version++;
            stationFromDb.Longitude = station.Longitude;
            stationFromDb.Latitude = station.Latitude;
            stationFromDb.Name = station.Name;
            stationFromDb.AddressStation = station.AddressStation;

            _unitOfWork.Stations.Update(stationFromDb);
            _unitOfWork.Complete();
            return Ok(stationFromDb.Id);
            
            
        }

        [Route("Delete")]
        // DELETE: api/Stations/5
        [ResponseType(typeof(Station))]
        public IHttpActionResult DeleteStation(int id)
        {
            Station station = _unitOfWork.Stations.Get(id);
            if (station == null)
            {
                //return NotFound();
                return Content(HttpStatusCode.NotFound, $"Station with ID {id} that you are trying delete either do not exist in database!");
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
    }
}