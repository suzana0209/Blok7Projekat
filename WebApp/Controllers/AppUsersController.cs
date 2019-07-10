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
        //private ApplicationDbContext db = new ApplicationDbContext();
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

        [Route("EmailAlreadyExists")]
        public IHttpActionResult EmailAlreadyExists(RegisterBindingModel pom)
        {
            try
            {
                //provjera za email da li vec postoji
                AppUser appForEmail = unitOfWork.AppUsers.Find(a => a.Email == pom.Email).FirstOrDefault();
                if (appForEmail != null)
                {
                    return Content(HttpStatusCode.Conflict, $"WARNING Email {pom.Email} already exist in database!");
                }
                return Ok();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Content(HttpStatusCode.Conflict, ex);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }

        }



        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                unitOfWork.Dispose();
            }
            base.Dispose(disposing);
        }

        




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