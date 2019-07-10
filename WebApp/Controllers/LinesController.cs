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
    [RoutePrefix("api/Lines")]
    public class LinesController : ApiController
    {
        //private ApplicationDbContext db = new ApplicationDbContext();
        private readonly IUnitOfWork _unitOfWork;

        public LinesController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // GET: api/Lines
        [Route("GetAll")]
        public IEnumerable<Line> GetLines()
        {
            //return db.Lines;
            var v = _unitOfWork.Lines.CompleteLine();
            //var v = _unitOfWork.Lines.
            return v;
        }

        [Route("GetLine")]
        //GET: api/Lines/5
        [ResponseType(typeof(Line))]
        public IHttpActionResult GetLine(int id)
        {
            Line line = _unitOfWork.Lines.Get(id);
            if (line == null)
            {
                return NotFound();
            }

            return Ok(line);
        }

        [Route("EditLine")]
        //PUT: api/Lines/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutLine(int id, Line line)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            if (id != line.Id)
            {
                return BadRequest();
            }

            Line lineFromDb = _unitOfWork.Lines.Get(id);

            if(lineFromDb != null)
            {
                if(lineFromDb.Version > line.Version)
                {
                    return Content(HttpStatusCode.Conflict, $"WARNING You are trying to edit a Line with ID {id} that has been changed recently! ");
                }

                string retMessage = _unitOfWork.Lines.AddStationsInList(line.Id, line.ListOfStations);

                if(retMessage == "null")
                {
                    return Content(HttpStatusCode.Conflict, $"WARNING: You are trying to edit a Line with ID {id} which station has been removed! ");
                }
                else if(retMessage == "NotOk")
                {
                    return Content(HttpStatusCode.Conflict, $" You are trying to edit a Line with {id} which station has been changed! ");
                }
                else { }

                List<Line> linesFromDbWithStations = _unitOfWork.Lines.CompleteLine().ToList();

                List<LineStation> lineStations = _unitOfWork.LineStations.GetAll().Where(data => data.LineId == line.Id).ToList();

                _unitOfWork.LineStations.RemoveRange(lineStations);
                int i = 0;
                foreach (Station s in line.ListOfStations)
                {
                    i++;
                    LineStation o = new LineStation();
                    o.LineId = line.Id;
                    o.StationId = s.Id;
                    o.OrdinalNumber = i;
                    _unitOfWork.LineStations.Add(o);

                }
                //novo dodato
                _unitOfWork.Complete();

            }
            else //null
            {
                return Content(HttpStatusCode.NotFound, $"WARNING Line with ID{id} that you are trying to edit either do not exist in database! ");
            }

            lineFromDb.Version++;
            _unitOfWork.Lines.Update(lineFromDb);

            _unitOfWork.Complete();

            return Ok(lineFromDb.Id);
        }

        [Route("AlredyExistRegularNumber")]
        public string AlredyExistRegularNumber(Line line)
        {
            Line l = _unitOfWork.Lines.Find(a => a.RegularNumber == line.RegularNumber).FirstOrDefault();

            string s = (l != null) ? "Yes" : "No";
            return s;    //ne postoji -> mogu dodati
        }

        [Route("Add")]
        // POST: api/Lines
        [ResponseType(typeof(Line))]
        public IHttpActionResult PostLine(Line line)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (_unitOfWork.Lines.ExistLine(line.Id))
            {
                return Content(HttpStatusCode.Conflict, $"WARNING Line with ID {line.Id} already exists!");
            }

            if(line.Version != 0)
            {
                line.Version = 0;
            }

            Line newLine = new Line();
            newLine.ListOfStations = new List<Station>();
            newLine.RegularNumber = line.RegularNumber;
            //newLine.Id = line.Id;


            newLine.ListOfStations = new List<Station>();


            List<Station> listModel = new List<Station>();
            listModel = line.ListOfStations;

            List<Line> linesFromDb = new List<Line>();
            linesFromDb = _unitOfWork.Lines.GetAll().ToList();


            var v = _unitOfWork.Lines.CompleteLine();


            List<Station> listStationFromDb = new List<Station>();
            listStationFromDb = _unitOfWork.Stations.GetAll().ToList();

            if(listStationFromDb == null)
            {
                return NotFound();
            }

           
            List<LineStation> l = new List<LineStation>();
            for (int i = 0; i < listModel.Count; i++)
            {
                //ovdje dodajemo za verzije
                Station stationAdd = listStationFromDb.Find(a => a.Id.Equals(listModel[i].Id));
                if(stationAdd == null)
                {
                    return Content(HttpStatusCode.Conflict, $"WARNING Station with ID {listModel[i].Id} that you want to add in line has been removed!");
                }
                else
                {
                    if(stationAdd.Version > listModel[i].Version)
                    {
                        return Content(HttpStatusCode.Conflict, $"WARNING Station with ID {listModel[i].Id} that you want to add in line has been changed!");
                    }
                }



                LineStation l1 = new LineStation();
                l1.LineId = newLine.Id;
                l1.OrdinalNumber = i + 1;
                l1.StationId = line.ListOfStations[i].Id;

                l.Add(l1);

                newLine.ListOfStations.Add(listStationFromDb.Find(st=> st.Id == listModel[i].Id));
            }

            //????????????????NE MOZEEEE!
            //newLine.ListOfStations = new List<Station>();

            _unitOfWork.Lines.Add(newLine);
            _unitOfWork.Complete();

            foreach (var item in l)
            {
                item.LineId = newLine.Id;
            }

            _unitOfWork.LineStations.CompleteLine(l);

            

            return Ok(newLine.Id);

            
        }

        

        [Route("Delete")]
        // DELETE: api/Lines/5
        [ResponseType(typeof(Line))]
        public IHttpActionResult DeleteLine(int id)
        {
            

            Line line = _unitOfWork.Lines.Get(id);
           

            if (line == null)
            {
                //return NotFound();
                return Content(HttpStatusCode.NotFound, $" WARNING: Line with ID {id} that you are trying to delete  do not exist in database!");
            }

            // _unitOfWork.Lines.Remove(line);
            _unitOfWork.Lines.Delete(id);
            _unitOfWork.Complete();

            return Ok(line);
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