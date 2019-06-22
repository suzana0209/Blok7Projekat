using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using WebApp.Models.Entities;
using WebApp.Persistence.UnitOfWork;

namespace WebApp.Controllers
{
    [RoutePrefix("api/File")]
    public class FileController : ApiController
    {
        
        private readonly IUnitOfWork _unitOfWork;

        public FileController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public FileController()
        {
        }

        

    }
}
