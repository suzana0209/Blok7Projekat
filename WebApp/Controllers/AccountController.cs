using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using WebApp.Models;
using WebApp.Models.Entities;
using WebApp.Providers;
using WebApp.Results;
using WebApp.Persistence.UnitOfWork;
using System.Linq;
using System.Net;
using System.IO;
using System.Drawing;
using System.Text;
using WebApp.Models.PomModels;
using System.Net.Mail;

namespace WebApp.Controllers
{
    [Authorize]
    [RoutePrefix("api/Account")]
    public class AccountController : ApiController
    {
        public static string path = "";

        private const string LocalLoginProvider = "Local";
        private ApplicationUserManager _userManager;
        private readonly IUnitOfWork _unitOfWork;
        public ISecureDataFormat<AuthenticationTicket> AccessTokenFormat { get; private set; }

        #region Constructors
        public AccountController(){}

        public AccountController(IUnitOfWork unitOfWork ){ _unitOfWork = unitOfWork; }

        public AccountController(ApplicationUserManager userManager, ISecureDataFormat<AuthenticationTicket> accessTokenFormat)
        {
            UserManager = userManager;
            AccessTokenFormat = accessTokenFormat;
        }

        #endregion 

        public ApplicationUserManager UserManager
        {
            get{ return _userManager ?? Request.GetOwinContext().GetUserManager<ApplicationUserManager>(); }
            private set{ _userManager = value; }
        }


        #region UserInfo_ManageInfo
        // GET api/Account/UserInfo
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [Route("UserInfo")]
        public UserInfoViewModel GetUserInfo()
        {
            ExternalLoginData externalLogin = ExternalLoginData.FromIdentity(User.Identity as ClaimsIdentity);

            return new UserInfoViewModel
            {
                Email = User.Identity.GetUserName(),
                HasRegistered = externalLogin == null,
                LoginProvider = externalLogin?.LoginProvider
            };
        }

        [Route("ManageInfo")]
        public async Task<ManageInfoViewModel> GetManageInfo(string returnUrl, bool generateState = false)
        {
            IdentityUser user = await UserManager.FindByIdAsync(User.Identity.GetUserId());

            if (user == null)
            {
                return null;
            }

            List<UserLoginInfoViewModel> logins = new List<UserLoginInfoViewModel>();

            foreach (IdentityUserLogin linkedAccount in user.Logins)
            {
                logins.Add(new UserLoginInfoViewModel
                {
                    LoginProvider = linkedAccount.LoginProvider,
                    ProviderKey = linkedAccount.ProviderKey
                });
            }

            if (user.PasswordHash != null)
            {
                logins.Add(new UserLoginInfoViewModel
                {
                    LoginProvider = LocalLoginProvider,
                    ProviderKey = user.UserName,
                });
            }

            return new ManageInfoViewModel
            {
                LocalLoginProvider = LocalLoginProvider,
                Email = user.UserName,
                Logins = logins,
                ExternalLoginProviders = GetExternalLogins(returnUrl, generateState)
            };
        }
        #endregion

        // POST api/Account/Logout
        [Route("Logout")]
        public IHttpActionResult Logout()
        {
            Authentication.SignOut(CookieAuthenticationDefaults.AuthenticationType);
            return Ok();
        }

        // GET api/Account/ManageInfo?returnUrl=%2F&generateState=true

        #region EditRegion
        [Route("Edit")]
        public async Task<IHttpActionResult> EditAppUser(PomAppUser model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            AppUser appUser = _unitOfWork.AppUsers.Find(x => x.Id == model.Id).FirstOrDefault();
            string oldEmail = appUser.Email;

            appUser.LastName = model.LastName;
            appUser.Name = model.Name;
            appUser.Email = model.Email;
            appUser.Birthaday = model.Birthaday;
            appUser.Image = path;

            path = "";

            Address address = _unitOfWork.Addresses.Find(x => x.Id == model.AddressId).FirstOrDefault();
            address.Number = model.Number;
            address.City = model.City;
            address.Street = model.Street;


            _unitOfWork.Addresses.Update(address);
            _unitOfWork.AppUsers.Update(appUser);
            _unitOfWork.Complete();


            //ApplicationUser applicationUser = _userManager.FindById(appUser.Id);
            //applicationUser.Email = appUser.Email;

            IdentityResult result = await UserManager.SetEmailAsync(appUser.Id, appUser.Email);
            ApplicationUser result1 =  UserManager.FindById(appUser.Id);
            result1.UserName = result1.Email;

            //dodato za provjeru
            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }


            // IdentityResult result = await UserManager.UpdateAsync(applicationUser);
            //IdentityResult result2 = await _userManager.UpdateAsync(result1);

            UserManager.Update(result1);



            return Ok();
        }

        [Route("CheckPasswordForChange")]
        public string CheckPasswordForChange(ChangePasswordBindingModel pom)
        {
            //ovo nije zavrseno
            return "Yes";
        }
        

        [Route("EmailExistForProfile")]
        public string EmailExistForProfile(PomAppUser model)
        {
            AppUser app = _unitOfWork.AppUsers.Find(a => a.Email == model.Email).FirstOrDefault();

            string s = (app != null) ? "Yes" : "No";

            if (app != null && app.Id == model.Id)
                s = "No";

            

            return s;

        }

        #endregion

        #region PasswordRegion
        // POST api/Account/ChangePassword
        [Route("ChangePassword")]
        public async Task<IHttpActionResult> ChangePassword(ChangePasswordBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IdentityResult result = await UserManager.ChangePasswordAsync(User.Identity.GetUserId(), model.OldPassword,
                model.NewPassword);
            
            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok();
        }

        // POST api/Account/SetPassword
        [Route("SetPassword")]
        public async Task<IHttpActionResult> SetPassword(SetPasswordBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IdentityResult result = await UserManager.AddPasswordAsync(User.Identity.GetUserId(), model.NewPassword);

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok();
        }

        #endregion
        
        #region LoginRegion
        // POST api/Account/AddExternalLogin
        [Route("AddExternalLogin")]
        public async Task<IHttpActionResult> AddExternalLogin(AddExternalLoginBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Authentication.SignOut(DefaultAuthenticationTypes.ExternalCookie);

            AuthenticationTicket ticket = AccessTokenFormat.Unprotect(model.ExternalAccessToken);

            if (ticket == null || ticket.Identity == null || (ticket.Properties != null
                && ticket.Properties.ExpiresUtc.HasValue
                && ticket.Properties.ExpiresUtc.Value < DateTimeOffset.UtcNow))
            {
                return BadRequest("External login failure.");
            }

            ExternalLoginData externalData = ExternalLoginData.FromIdentity(ticket.Identity);

            if (externalData == null)
            {
                return BadRequest("The external login is already associated with an account.");
            }

            IdentityResult result = await UserManager.AddLoginAsync(User.Identity.GetUserId(),
                new UserLoginInfo(externalData.LoginProvider, externalData.ProviderKey));

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok();
        }

        // POST api/Account/RemoveLogin
        [Route("RemoveLogin")]
        public async Task<IHttpActionResult> RemoveLogin(RemoveLoginBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IdentityResult result;

            if (model.LoginProvider == LocalLoginProvider)
            {
                result = await UserManager.RemovePasswordAsync(User.Identity.GetUserId());
            }
            else
            {
                result = await UserManager.RemoveLoginAsync(User.Identity.GetUserId(),
                    new UserLoginInfo(model.LoginProvider, model.ProviderKey));
            }

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok();
        }

        // GET api/Account/ExternalLogin
        [OverrideAuthentication]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalCookie)]
        [AllowAnonymous]
        [Route("ExternalLogin", Name = "ExternalLogin")]
        public async Task<IHttpActionResult> GetExternalLogin(string provider, string error = null)
        {
            if (error != null)
            {
                return Redirect(Url.Content("~/") + "#error=" + Uri.EscapeDataString(error));
            }

            if (!User.Identity.IsAuthenticated)
            {
                return new ChallengeResult(provider, this);
            }

            ExternalLoginData externalLogin = ExternalLoginData.FromIdentity(User.Identity as ClaimsIdentity);

            if (externalLogin == null)
            {
                return InternalServerError();
            }

            if (externalLogin.LoginProvider != provider)
            {
                Authentication.SignOut(DefaultAuthenticationTypes.ExternalCookie);
                return new ChallengeResult(provider, this);
            }

            ApplicationUser user = await UserManager.FindAsync(new UserLoginInfo(externalLogin.LoginProvider,
                externalLogin.ProviderKey));

            bool hasRegistered = user != null;

            if (hasRegistered)
            {
                Authentication.SignOut(DefaultAuthenticationTypes.ExternalCookie);
                
                 ClaimsIdentity oAuthIdentity = await user.GenerateUserIdentityAsync(UserManager,
                    OAuthDefaults.AuthenticationType);
                ClaimsIdentity cookieIdentity = await user.GenerateUserIdentityAsync(UserManager,
                    CookieAuthenticationDefaults.AuthenticationType);

                AuthenticationProperties properties = ApplicationOAuthProvider.CreateProperties(user.UserName);
                Authentication.SignIn(properties, oAuthIdentity, cookieIdentity);
            }
            else
            {
                IEnumerable<Claim> claims = externalLogin.GetClaims();
                ClaimsIdentity identity = new ClaimsIdentity(claims, OAuthDefaults.AuthenticationType);
                Authentication.SignIn(identity);
            }

            return Ok();
        }

        // GET api/Account/ExternalLogins?returnUrl=%2F&generateState=true
        [AllowAnonymous]
        [Route("ExternalLogins")]
        public IEnumerable<ExternalLoginViewModel> GetExternalLogins(string returnUrl, bool generateState = false)
        {
            IEnumerable<AuthenticationDescription> descriptions = Authentication.GetExternalAuthenticationTypes();
            List<ExternalLoginViewModel> logins = new List<ExternalLoginViewModel>();

            string state;

            if (generateState)
            {
                const int strengthInBits = 256;
                state = RandomOAuthStateGenerator.Generate(strengthInBits);
            }
            else
            {
                state = null;
            }

            foreach (AuthenticationDescription description in descriptions)
            {
                ExternalLoginViewModel login = new ExternalLoginViewModel
                {
                    Name = description.Caption,
                    Url = Url.Route("ExternalLogin", new
                    {
                        provider = description.AuthenticationType,
                        response_type = "token",
                        client_id = Startup.PublicClientId,
                        redirect_uri = new Uri(Request.RequestUri, returnUrl).AbsoluteUri,
                        state = state
                    }),
                    State = state
                };
                logins.Add(login);
            }

            return logins;
        }

        #endregion

        #region RegisterRegion
        // POST api/Account/Register
        [AllowAnonymous]
        [Route("Register")]
        public async Task<IHttpActionResult> Register(RegisterBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            

            AppUser appUser = new AppUser();
            appUser.Email = model.Email;
            appUser.Activated = false;
            appUser.Deny = false;
            appUser.Name = model.Name;
            appUser.LastName = model.LastName;
            appUser.Address = new Address();
            appUser.Address.City = model.City;
            appUser.Address.Street = model.Street;
            appUser.Address.Number = model.Number;
            appUser.Birthaday = model.Birthaday;
            appUser.Image = path;

            var getAllUserTypes = _unitOfWork.UserTypes.GetAll();
            foreach (var item in getAllUserTypes)
            {
                if (item.Name == model.UserType)
                {
                    appUser.UserTypeId = item.Id;
                    break;
                }
            }

            if (model.PassangerType != null)
            {
                appUser.Activated = false;
                var getAllPassangerTypes = _unitOfWork.PassangerTypes.GetAll();
                foreach (var item in getAllPassangerTypes)
                {
                    if(model.PassangerType == "Default")
                    {
                        appUser.Activated = true;
                    }

                    if (item.Name == model.PassangerType)
                    {
                        appUser.PassangerTypeId = item.Id;
                        break;
                    }
                }

                //var getAllCoefficients = _unitOfWork.RoleCoefficients.GetAll();
                //foreach (var item in getAllCoefficients)
                //{
                //    if (item.PassangerType.Name == model.PassangerType)
                //    {
                //        appUser.RoleCoefficientId = item.Id;
                //        break;
                //    }
                //}
            }
            

            var user = new ApplicationUser() { UserName = model.Email, Email = model.Email,
                PasswordHash = ApplicationUser.HashPassword(model.Password), AppUser = appUser };

            appUser.Id = user.Id;
            user.AppUser = appUser;
            appUser = user.AppUser;
            user.AppUserId = user.Id;           

            IdentityResult result = await UserManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            UserManager.AddToRole(user.Id, model.UserType);

            return Ok();
        }

        //[Route("EmailAlreadyExists")]
        //public IHttpActionResult EmailAlreadyExists(RegisterBindingModel model)
        //{
        //    //provjera za email da li vec postoji
        //    AppUser appForEmail = _unitOfWork.AppUsers.Find(a => a.Email == model.Email).FirstOrDefault();
        //    if (appForEmail != null)
        //    {
        //        return Content(HttpStatusCode.Conflict, $"WARNING Email {model.Email} already exist in database!");
        //    }
        //    return Ok();
        //}

        // POST api/Account/RegisterExternal
        [OverrideAuthentication]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [Route("RegisterExternal")]
        public async Task<IHttpActionResult> RegisterExternal(RegisterExternalBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var info = await Authentication.GetExternalLoginInfoAsync();
            if (info == null)
            {
                return InternalServerError();
            }

            var user = new ApplicationUser() { UserName = model.Email, Email = model.Email };

            IdentityResult result = await UserManager.CreateAsync(user);
            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            result = await UserManager.AddLoginAsync(user.Id, info.Login);
            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }
            return Ok();
        }
        #endregion

        #region ImageRegion
        [AllowAnonymous]
        [Route("PostImage")]
        public async Task<HttpResponseMessage> PostImage()
        {

            Dictionary<string, object> dict = new Dictionary<string, object>();
            try
            {
                var httpRequest = HttpContext.Current.Request;

                foreach (string file in httpRequest.Files)
                {
                    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created);

                    var postedFile = httpRequest.Files[file];
                    if (postedFile != null && postedFile.ContentLength > 0)
                    {

                        int MaxContentLength = 1024 * 1024 * 1; //Size = 1 MB  

                        IList<string> AllowedFileExtensions = new List<string> { ".jpg", ".gif", ".png", ".img", ".jpeg" };
                        var ext = postedFile.FileName.Substring(postedFile.FileName.LastIndexOf('.'));
                        var extension = ext.ToLower();
                        if (!AllowedFileExtensions.Contains(extension))
                        {

                            var message = string.Format("Please Upload image of type .jpg,.gif,.png,.img,.jpeg.");

                            return Request.CreateResponse(HttpStatusCode.BadRequest, message);
                        }
                        else if (postedFile.ContentLength > MaxContentLength)
                        {
                            var message = string.Format("Please Upload a file upto 1 mb.");

                            return Request.CreateResponse(HttpStatusCode.BadRequest, message);
                        }
                        else
                        {
                            if (!Directory.Exists(HttpContext.Current.Server.MapPath("/Content/Images")))
                                Directory.CreateDirectory(HttpContext.Current.Server.MapPath("/Content/Images"));

                            var filePath = HttpContext.Current.Server.MapPath("/Content/Images/" + postedFile.FileName);
                            //postedFile as .SaveAs(filePath);

                            Bitmap bmp = new Bitmap(postedFile.InputStream);
                            Image img = (Image)bmp;
                            byte[] imagebytes = ImageToByteArray(img);
                            byte[] cryptedBytes = EncryptBytes(imagebytes, "password", "asdasd");
                            File.WriteAllBytes(filePath, cryptedBytes);

                            path = "/Content/Images/" + postedFile.FileName;
                            var message = string.Format("/Content/Images/" + postedFile.FileName);
                        }
                    }

                    var message1 = string.Format("Image Updated Successfully.");
                    //return Request.CreateErrorResponse(HttpStatusCode.Created, message1);
                }

                var res = string.Format("Please Upload a image.");
                //return Request.CreateResponse(HttpStatusCode.NotFound, res);
            }
            catch (Exception)
            {
                var res = string.Format("some Message");
                dict.Add("error", res);
                return Request.CreateResponse(HttpStatusCode.NotFound, dict);
            }


            return Request.CreateResponse(HttpStatusCode.OK);
        }

        public byte[] ImageToByteArray(Image imageIn)
        {
            using (var ms = new MemoryStream())
            {
                imageIn.Save(ms, imageIn.RawFormat);
                return ms.ToArray();
            }
        }

        public static byte[] EncryptBytes(byte[] inputBytes, string passPhrase, string saltValue)
        {
            RijndaelManaged RijndaelCipher = new RijndaelManaged();

            RijndaelCipher.Mode = CipherMode.CBC;
            byte[] salt = Encoding.ASCII.GetBytes(saltValue);
            PasswordDeriveBytes password = new PasswordDeriveBytes(passPhrase, salt, "SHA1", 2);

            ICryptoTransform Encryptor = RijndaelCipher.CreateEncryptor(password.GetBytes(32), password.GetBytes(16));

            MemoryStream memoryStream = new MemoryStream();
            CryptoStream cryptoStream = new CryptoStream(memoryStream, Encryptor, CryptoStreamMode.Write);
            cryptoStream.Write(inputBytes, 0, inputBytes.Length);
            cryptoStream.FlushFinalBlock();
            byte[] CipherBytes = memoryStream.ToArray();

            memoryStream.Close();
            cryptoStream.Close();

            return CipherBytes;
        }

        public static byte[] DecryptBytes(byte[] encryptedBytes, string passPhrase, string saltValue)
        {
            RijndaelManaged RijndaelCipher = new RijndaelManaged();

            RijndaelCipher.Mode = CipherMode.CBC;
            byte[] salt = Encoding.ASCII.GetBytes(saltValue);
            PasswordDeriveBytes password = new PasswordDeriveBytes(passPhrase, salt, "SHA1", 2);

            ICryptoTransform Decryptor = RijndaelCipher.CreateDecryptor(password.GetBytes(32), password.GetBytes(16));

            MemoryStream memoryStream = new MemoryStream(encryptedBytes);
            CryptoStream cryptoStream = new CryptoStream(memoryStream, Decryptor, CryptoStreamMode.Read);
            byte[] plainBytes = new byte[encryptedBytes.Length];

            int DecryptedCount = cryptoStream.Read(plainBytes, 0, plainBytes.Length);

            memoryStream.Close();
            cryptoStream.Close();

            return plainBytes;
        }
        [HttpPost]
        [AllowAnonymous]
        [Route("GetUserImage")]
        public async Task<byte[]> GetUserImage(PomModelForAuthorization email)
        {
            //int userId = _unitOfWork.AppUserRepository.Find(u => u.Email == email).FirstOrDefault()
            AppUser uid = _unitOfWork.AppUsers.Find(u => u.Email == email.Id).FirstOrDefault();

            var filePath = HttpContext.Current.Server.MapPath(uid.Image);

            if (File.Exists(filePath))
            {
                byte[] bytes = File.ReadAllBytes(filePath);
                byte[] decryptedBytes = DecryptBytes(bytes, "password", "asdasd");
                return decryptedBytes;
            }

            return null;
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("GetUserImages")]
        public async Task<List<byte[]>> PostUserImage(List<AppUser> list)
        {
            List<byte[]> returnList = new List<byte[]>();
            foreach (var uid in list)
            {
                var filePath = HttpContext.Current.Server.MapPath(uid.Image);

                if (File.Exists(filePath))
                {
                    byte[] bytes = File.ReadAllBytes(filePath);
                    byte[] decryptedBytes = DecryptBytes(bytes, "password", "asdasd");
                    returnList.Add(decryptedBytes);
                }
            }

            return returnList;
        }

        [AllowAnonymous]
        [Route("PostUserImages")]
        public async Task<List<byte[]>> PostUserImages(List<AppUser> list)
        {
            List<byte[]> returnList = new List<byte[]>();
            foreach (var uid in list)
            {
                var filePath = HttpContext.Current.Server.MapPath("/Content/Images/Users/" + uid.Email.ToString() + "/profilePic.jpg" /*+ postedFile.FileName.Split('.').LastOrDefault()*/);

                if (File.Exists(filePath))
                {
                    byte[] bytes = File.ReadAllBytes(filePath);
                    byte[] decryptedBytes = DecryptBytes(bytes, "password", "asdasd");
                    returnList.Add(decryptedBytes);
                }
            }

            return returnList;
        }

        #endregion

        #region Authorization
        [Authorize(Roles = "Admin")]
        [Route("GetAwaitingAdmins")]
        public List<AppUser> GetAwaitingAdmins()
        {
            int userTypeId = _unitOfWork.UserTypes.Find(c => c.Name == "Admin").FirstOrDefault().Id;
            return _unitOfWork.AppUsers.Find(x => (!x.Activated && x.UserTypeId == userTypeId && !x.Deny)).ToList();
        }

        [Authorize(Roles = "Admin")]
        [Route("GetDenyUsers")]
        public List<AppUser> GetDenyUsers()
        {
            List<AppUser> deniedUsers = _unitOfWork.AppUsers.GetAll().Where(a => a.Deny).ToList();

            return deniedUsers;
        }

        [Authorize(Roles = "Admin")]
        [Route("GetAwaitingAControllers")]
        public List<AppUser> GetAwaitingControllers()
        {
            int userTypeId = _unitOfWork.UserTypes.Find(c => c.Name == "Controller").FirstOrDefault().Id;
            return _unitOfWork.AppUsers.Find(x => (!x.Activated && x.UserTypeId == userTypeId && !x.Deny)).ToList();
        }

        [Authorize(Roles = "Admin")]
        [Route("GetAwaitingAppUsers")]
        public List<AppUser> GetAwaitingAppUsers()
        {
            int passangerIdStudent = _unitOfWork.PassangerTypes.Find(c => c.Name == "Student").FirstOrDefault().Id;
            int passangerIdPensioner = _unitOfWork.PassangerTypes.Find(c => c.Name == "Pensioner").FirstOrDefault().Id;

            return _unitOfWork.AppUsers.Find(x => (!x.Activated && (x.PassangerTypeId == passangerIdStudent || 
            x.PassangerTypeId == passangerIdPensioner) && x.Image.Length != 0 && !x.Deny)).ToList();
        }


        [Authorize(Roles = "Admin")]
        [Route("AuthorizeAdmin")]
        public string AuthorizeAdmin([FromBody]PomModelForAuthorization pomModel)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState).ToString();
            }
            //Get user data, and update activated to true
            //ApplicationUser current = UserManager.FindById(Id.Id);
            AppUser current = _unitOfWork.AppUsers.Get(pomModel.Id);
            current.Activated = true;


            _unitOfWork.AppUsers.Update(current);
            _unitOfWork.Complete();


            string subject = "Admin approved";
            string desc = $"Dear {current.Name}, You have been approved as admin.";
            var adminEmail = current.Email;
            
            NotifyViaEmail(adminEmail, subject, desc);

            return "Ok";

        }


        [Authorize(Roles = "Admin")]
        [Route("AuthorizeController")]
        public string AuthorizeControll([FromBody]PomModelForAuthorization pom)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState).ToString();
            }
            //Get user data, and update activated to true
            //ApplicationUser current = UserManager.FindById(pom.Id);

            AppUser current = _unitOfWork.AppUsers.Get(pom.Id);
            current.Activated = true;
            _unitOfWork.AppUsers.Update(current);
            _unitOfWork.Complete();
            
            string subject = "Controller approved";
            string desc = $"Dear {current.Name}, You have been approved as controller.";
            var controllerEmail = current.Email;
            NotifyViaEmail(controllerEmail, subject, desc);

            return "Ok";
        }

        [Authorize(Roles = "Admin")]
        [Route("AuthorizeAppUser")]
        public string AuthorizeAppUser([FromBody]PomModelForAuthorization pom)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState).ToString();
            }

            AppUser current = _unitOfWork.AppUsers.Get(pom.Id);

            if(current.Image == "")
            {
                return "NotOk";
            }

            if (current.Deny)
            {
                return "NotOkDeny";
            }

            current.Activated = true;
            _unitOfWork.AppUsers.Update(current);
            _unitOfWork.Complete();

            string passTypeName = _unitOfWork.PassangerTypes.Find(x => x.Id == current.PassangerTypeId).FirstOrDefault().Name;

            string subject = "AppUser approved";
            string desc = $"Dear {current.Name}, You have been approved as {passTypeName}." ;
            var controllerEmail = current.Email;
            NotifyViaEmail(controllerEmail, subject, desc);

            return "Ok";
        }

        [Authorize(Roles = "Admin")]
        [Route("AuthorizeDeniedUser")]
        public string AuthorizeDeniedUser([FromBody]PomModelForAuthorization pomModel)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState).ToString();
            }
            //Get user data, and update activated to true
            //ApplicationUser current = UserManager.FindById(Id.Id);
            AppUser current = _unitOfWork.AppUsers.Get(pomModel.Id);
            current.Activated = true;
            current.Deny = false;

            string userTypee = _unitOfWork.UserTypes.Find(a => a.Id == current.UserTypeId).FirstOrDefault().Name;
            string passType = "";

            if (userTypee == "AppUser")
            {
                passType = _unitOfWork.PassangerTypes.Find(a => a.Id == current.PassangerTypeId).FirstOrDefault().Name;
            }



            _unitOfWork.AppUsers.Update(current);
            _unitOfWork.Complete();


            //string subject = $"{(userTypee == "AppUser") ? passType : userTypee} approved";
            string subject = (userTypee == "AppUser") ? passType : userTypee + " approved";
            string desc = $"Dear {current.Name}, You have been approved as ";
            desc += (userTypee == "AppUser") ? passType : userTypee + ".";
            var adminEmail = current.Email;

            NotifyViaEmail(adminEmail, subject, desc);

            return "Ok";

        }

        [Authorize(Roles = "Admin")]
        [Route("DenyAppUser")]
        public string DenyAppUser([FromBody]PomModelForAuthorization pom)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState).ToString();
            }

            AppUser current = _unitOfWork.AppUsers.Get(pom.Id);

            if (current.Image == "")
            {
                return "NotOk";
            }

            current.Activated = false;
            current.Deny = true;

            _unitOfWork.AppUsers.Update(current);
            _unitOfWork.Complete();

            string passTypeName = _unitOfWork.PassangerTypes.Find(x => x.Id == current.PassangerTypeId).FirstOrDefault().Name;

            string subject = "AppUser denied";
            string desc = $"Dear {current.Name}, You have been denied as {passTypeName}.";
            var controllerEmail = current.Email;
            NotifyViaEmail(controllerEmail, subject, desc);

            return "Ok";
        }



        [Authorize(Roles = "Admin")]
        [Route("DenyControll")]
        public string DenyControll([FromBody]PomModelForAuthorization pom)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState).ToString();
            }
            //Get user data, and update activated to true
            //ApplicationUser current = UserManager.FindById(pom.Id);

            AppUser current = _unitOfWork.AppUsers.Get(pom.Id);
            current.Activated = false;
            current.Deny = true;
            _unitOfWork.AppUsers.Update(current);
            _unitOfWork.Complete();

            string subject = "Controller denied";
            string desc = $"Dear {current.Name}, You have been denied as controller.";
            var controllerEmail = current.Email;
            NotifyViaEmail(controllerEmail, subject, desc);

            return "Ok";
        }


        [Authorize(Roles = "Admin")]
        [Route("DenyAdmin")]
        public string DenyAdmin([FromBody]PomModelForAuthorization pomModel)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState).ToString();
            }
            //Get user data, and update activated to true
            //ApplicationUser current = UserManager.FindById(Id.Id);
            AppUser current = _unitOfWork.AppUsers.Get(pomModel.Id);
            current.Activated = false;
            current.Deny = true;


            _unitOfWork.AppUsers.Update(current);
            _unitOfWork.Complete();


            string subject = "Admin denied";
            string desc = $"Dear {current.Name}, You have been denied as admin.";
            var adminEmail = current.Email;

            NotifyViaEmail(adminEmail, subject, desc);

            return "Ok";

        }


        public bool NotifyViaEmail(string targetEmail, string subject, string body)
        {
            
            var client = new SmtpClient("smtp.gmail.com", 587)
            {
                Credentials = new NetworkCredential("pusgs2018.19projekat@gmail.com", "pusgs2019"),
                EnableSsl = true
            };

            client.Send("pusgs2018.19projekat@gmail.com", targetEmail, subject, body);
            return true;
        }

        #endregion

        #region Helpers

        private IAuthenticationManager Authentication
        {
            get { return Request.GetOwinContext().Authentication; }
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

        private class ExternalLoginData
        {
            public string LoginProvider { get; set; }
            public string ProviderKey { get; set; }
            public string UserName { get; set; }

            public IList<Claim> GetClaims()
            {
                IList<Claim> claims = new List<Claim>();
                claims.Add(new Claim(ClaimTypes.NameIdentifier, ProviderKey, null, LoginProvider));

                if (UserName != null)
                {
                    claims.Add(new Claim(ClaimTypes.Name, UserName, null, LoginProvider));
                }

                return claims;
            }

            public static ExternalLoginData FromIdentity(ClaimsIdentity identity)
            {
                if (identity == null)
                {
                    return null;
                }

                Claim providerKeyClaim = identity.FindFirst(ClaimTypes.NameIdentifier);

                if (providerKeyClaim == null || String.IsNullOrEmpty(providerKeyClaim.Issuer)
                    || String.IsNullOrEmpty(providerKeyClaim.Value))
                {
                    return null;
                }

                if (providerKeyClaim.Issuer == ClaimsIdentity.DefaultIssuer)
                {
                    return null;
                }

                return new ExternalLoginData
                {
                    LoginProvider = providerKeyClaim.Issuer,
                    ProviderKey = providerKeyClaim.Value,
                    UserName = identity.FindFirstValue(ClaimTypes.Name)
                };
            }
        }

        private static class RandomOAuthStateGenerator
        {
            private static RandomNumberGenerator _random = new RNGCryptoServiceProvider();

            public static string Generate(int strengthInBits)
            {
                const int bitsPerByte = 8;

                if (strengthInBits % bitsPerByte != 0)
                {
                    throw new ArgumentException("strengthInBits must be evenly divisible by 8.", "strengthInBits");
                }

                int strengthInBytes = strengthInBits / bitsPerByte;

                byte[] data = new byte[strengthInBytes];
                _random.GetBytes(data);
                return HttpServerUtility.UrlTokenEncode(data);
            }
        }

        #endregion

        protected override void Dispose(bool disposing)
        {
            if (disposing && _userManager != null)
            {
                _userManager.Dispose();
                _userManager = null;
            }

            base.Dispose(disposing);
        }

    }
}
