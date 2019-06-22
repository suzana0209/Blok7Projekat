using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using WebApp.Models;
using WebApp.Models.Entities;
using WebApp.Models.PomModels;
using WebApp.Persistence;
using WebApp.Persistence.UnitOfWork;

namespace WebApp.Controllers
{
    [RoutePrefix("api/AppUser")]
    public class AppUsersController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();
        private readonly IUnitOfWork unitOfWork;

        private const string LocalLoginProvider = "Local";
        private ApplicationUserManager _userManager;
        public ISecureDataFormat<AuthenticationTicket> AccessTokenFormat { get; private set; }

        public AppUsersController()
        {
        }

        public AppUsersController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public AppUsersController(ApplicationUserManager userManager,
            ISecureDataFormat<AuthenticationTicket> accessTokenFormat)
        {
            UserManager = userManager;
            AccessTokenFormat = accessTokenFormat;
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        //public AppUsersController(IUnitOfWork unitOfWork)
        //{
        //    this.unitOfWork = unitOfWork;
        //}

        // GET: api/AppUsers
        //public IQueryable<AppUser> GetAppUser()
        //{
        //    return db.AppUser;
        //}

        [Route("GetUser")]
        public AppUser GetUser(string email)
        {
            AppUser a =  unitOfWork.AppUsers.Find(user => user.Email == email).FirstOrDefault();
            return a;
        }


        [Route("GetAddressInfo")]
        public Address GetAddressInfo(int id)
        {
            Address adresa = unitOfWork.Addresses.Get(id);
            return adresa;
        }

        // GET: api/AppUsers/5
        //[ResponseType(typeof(AppUser))]
        //public IHttpActionResult GetAppUser(string id)
        //{
        //    AppUser appUser = db.AppUser.Find(id);
        //    if (appUser == null)
        //    {
        //        return NotFound();
        //    }

        //    return Ok(appUser);
        //}

        // PUT: api/AppUsers/5
        //public IHttpActionResult PutAppUser(string id, AppUser appUser)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    if (id != appUser.Id)
        //    {
        //        return BadRequest();
        //    }

        //    db.Entry(appUser).State = EntityState.Modified;

        //    try
        //    {
        //        db.SaveChanges();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!AppUserExists(id))
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

        // POST: api/AppUsers
        //[ResponseType(typeof(AppUser))]
        //public IHttpActionResult PostAppUser(AppUser appUser)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    db.AppUser.Add(appUser);

        //    try
        //    {
        //        db.SaveChanges();
        //    }
        //    catch (DbUpdateException)
        //    {
        //        if (AppUserExists(appUser.Id))
        //        {
        //            return Conflict();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return CreatedAtRoute("DefaultApi", new { id = appUser.Id }, appUser);
        //}

        // DELETE: api/AppUsers/5
        //[ResponseType(typeof(AppUser))]
        //public IHttpActionResult DeleteAppUser(string id)
        //{
        //    AppUser appUser = db.AppUser.Find(id);
        //    if (appUser == null)
        //    {
        //        return NotFound();
        //    }

        //    db.AppUser.Remove(appUser);
        //    db.SaveChanges();

        //    return Ok(appUser);
        //}

          
        //[Route("Edit")]        
        //// POST: api/Stations
        ////[ResponseType(typeof(void))]
        //public async Task<IHttpActionResult> EditAppUser(PomAppUser model)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }


        //    AppUser appUser = unitOfWork.AppUsers.Find(x => x.Id == model.Id).FirstOrDefault();
        //    string oldEmail = appUser.Email;            
        //    appUser.LastName = model.LastName;
        //    appUser.Name = model.Name;
        //    appUser.Email = model.Email;
        //    appUser.Birthaday = model.Birthaday;
        //    appUser.Image = AccountController.path ;

        //    Address address = unitOfWork.Addresses.Find(x => x.Id == model.AddressId).FirstOrDefault();
        //    address.Number = model.Number;
        //    address.City = model.City;
        //    address.Street = model.Street;

        //    ApplicationUser applicationUser = _userManager.FindByEmail(oldEmail);
        //    applicationUser.Email = appUser.Email;



        //    unitOfWork.Addresses.Update(address);
        //    unitOfWork.AppUsers.Update(appUser);
        //    //_userManager.Update(applicationUser);

        //    IdentityResult result = await UserManager.Update(applicationUser);

        //    unitOfWork.Complete();

        //    return Ok();
        //}

        [Route("EditPassword")]
        // POST: api/Stations
        //[ResponseType(typeof(void))]
        public IHttpActionResult EditPassword(string id, ChangePasswordBindingModel station)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //unitOfWork.Stations.Update(station);
            unitOfWork.Complete();
            //return Ok(station.Id);
            return Ok();

        }



        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                unitOfWork.Dispose();
            }
            base.Dispose(disposing);
        }

        //private bool AppUserExists(string id)
        //{
        //    return db.AppUser.Count(e => e.Id == id) > 0;
        //}




        private IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (string error in result.Errors)
                    {
                        ModelState.AddModelError("", error);
                    }
                }

                if (ModelState.IsValid)
                {
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }

    }
}