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

            

            try
            {
                Line l = new Line();

                
                _unitOfWork.Lines.AddStationsInList(line.Id, line.ListOfStations);

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

                
               // _unitOfWork.Lines.Update(line);

                _unitOfWork.Complete();


                return Ok(line.Id);

                //db.Entry(line).State = EntityState.Modified;


                //db.SaveChanges();

            }

            catch (DbUpdateConcurrencyException)
            {
                
            }

            return StatusCode(HttpStatusCode.NoContent);
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
            Line newLine = new Line();
            newLine.ListOfStations = new List<Station>();
            newLine.RegularNumber = line.RegularNumber;
            newLine.Id = line.Id;
            
            
            newLine.ListOfStations = new List<Station>();


            List<Station> listModel = new List<Station>();
            listModel = line.ListOfStations;

            List<Line> linesFromDb = new List<Line>();
            linesFromDb = _unitOfWork.Lines.GetAll().ToList();


            var v = _unitOfWork.Lines.CompleteLine();
            

            List<Station> list = new List<Station>();
            list = _unitOfWork.Stations.GetAll().ToList();

            foreach (var item in list)
            {
                if (listModel.Any(a=> a.Id == item.Id))
                {
                         
                    newLine.ListOfStations.Add(item);
                }
            }

            
            _unitOfWork.Lines.Add(newLine);
            _unitOfWork.Complete();

            List<LineStation> l = new List<LineStation>();
            for (int i = 0; i < newLine.ListOfStations.Count; i++)
            {
                LineStation l1 = new LineStation();
                l1.LineId = newLine.Id;
                l1.OrdinalNumber = i + 1;
                l1.StationId = line.ListOfStations[i].Id;

                l.Add(l1);
            }

            _unitOfWork.LineStations.CompleteLine(l);

            return Ok(newLine.Id);

            //db.Lines.Add(line);
            //db.SaveChanges();

            //return CreatedAtRoute("DefaultApi", new { id = line.Id }, line);
        }

        //public bool CanAddLine(List<Station> l1, List<Station> l2)
        //{
        //    foreach (var item in l2)
        //    {
        //        if(!l1.Any(p=> p.Name == item.Name))
        //        {
        //            return false;
        //        }
        //    }
        //    return true;

        //    //return l1.All(l2.Contains);
        //}

        [Route("Delete")]
        // DELETE: api/Lines/5
        [ResponseType(typeof(Line))]
        public IHttpActionResult DeleteLine(int id)
        {
            // = db.Lines.Find(id);

            Line line = _unitOfWork.Lines.Get(id);
            Vehicle v = _unitOfWork.Vehicles.Find(x => x.LineId == line.Id).FirstOrDefault();
            v.LineId = null;
            _unitOfWork.Vehicles.Update(v);
            _unitOfWork.Complete();

            if (line == null)
            {
                return NotFound();
            }

            _unitOfWork.Lines.Remove(line);
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

        //private bool LineExists(int id)
        //{
        //    return db.Lines.Count(e => e.Id == id) > 0;
        //}
    }
}