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

        private static List<Station> stations = new List<Station>();

        private static Timer timer = new Timer();
        private static int cnt = 0;

        public CvlHub()
        {
        }

        public void TimeServerUpdates()
        {
            if(timer.Interval != 4000)
            {
                timer.Interval = 4000;
                timer.Elapsed += OnTimedEvent;

                
            }
            timer.Enabled = true;

        }

        private void OnTimedEvent(object source, ElapsedEventArgs e)
        {
            //GetTime();
        #if DEBUG
                (source as Timer).Enabled = false;
        #endif
            if(stations  != null)
            {
                
                if (cnt >= stations.Count)  
                {
                    cnt = 0;
                }
               
                double[] niz = { stations[cnt].Latitude, stations[cnt].Longitude };
                Clients.All.setRealTime(niz);
                cnt++;
                 
            }
            else
            {
                double[] nizz = { 0, 0 };
            }
            //do your work
            
        #if DEBUG
            (source as Timer).Enabled = true;
        #endif
        }

        public void GetTime()
        {
            if (stations.Count > 0)
            {
                if (cnt >= stations.Count)
                {
                    cnt = 0;
                }
                double[] niz = { stations[cnt].Latitude, stations[cnt].Longitude };
                //Clients.All.setRealTime(niz);
                cnt++;
            }
        }

        public void StopTimeServerUpdates()
        {
            timer.Stop();
            stations = null;
        }

        public void AddStations(List<Station> stationsBM)
        {
            stations = new List<Station>();
            stations = stationsBM;
        }


    }
}