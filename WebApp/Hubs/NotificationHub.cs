using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace WebApp.Hubs
{
    [HubName("notifications")]
    public class NotificationHub : Hub
    {
        private static IHubContext hubContext = GlobalHost.ConnectionManager.GetHubContext<NotificationHub>();

        public void NotifyAdmin()
        {
            hubContext.Clients.Group("Admins").sendNotification("New user created.");
        }
        public void NotifyController()
        {
            hubContext.Clients.Group("Controllers").sendNotification("One user uploaded document, waiting for evaluation.");
        }

        public void NotifyAdminService()
        {
            hubContext.Clients.Group("Admins").sendNotification("New service created, waiting for evaluation.");
        }

        public override Task OnConnected()
        {
            var identityName = Context.User.Identity.Name;
            Groups.Add(Context.ConnectionId, "Admins");
            Groups.Add(Context.ConnectionId, "Controllers");
            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            Groups.Remove(Context.ConnectionId, "Admins");
            Groups.Remove(Context.ConnectionId, "Controllers");
            return base.OnDisconnected(stopCalled);
        }
    }
}