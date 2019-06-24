using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Timers;
using System.Web;
using WebApp.Models.Entities;

namespace WebApp.Hubs
{
    [HubName("notificationBus")]
    public class CvlHub : Hub
    {
        private static IHubContext hubContext = GlobalHost.ConnectionManager.GetHubContext<CvlHub>();

        private static List<Station> listOfStations = new List<Station>();

        private static Timer timer = new Timer();
        private static int cnt = 0;

        public CvlHub()
        {
        }

        public void TimeServerUpdates()
        {
            if (!timer.Enabled)
            {
                timer.Interval = 5000;
                timer.Start();
                timer.Elapsed += OnTimedEvent;
            }
        }

        private void OnTimedEvent(object source, ElapsedEventArgs e)
        {
            GetTime();
        }

        public void GetTime()
        {
            if (listOfStations.Count > 0)
            {
                if (cnt >= listOfStations.Count)
                {
                    cnt = 0;
                }
                double[] niz = { listOfStations[cnt].Latitude, listOfStations[cnt].Longitude };
                Clients.All.setRealTime(niz);
                cnt++;
            }
        }

        public void StopTimeServerUpdates()
        {
            timer.Stop();
        }

        public void AddStations(List<Station> stationsBM)
        {
            listOfStations = stationsBM;
        }


    }
}