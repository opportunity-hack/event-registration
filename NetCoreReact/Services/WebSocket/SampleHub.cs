using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using NetCoreReact.Helpers;
using NetCoreReact.Services.Business.Interfaces;

namespace NetCoreReact.Services.WebSocket
{
    public class SampleHub : Hub
    {
        private readonly IEventService _eventService;

        public SampleHub(IEventService santaService)
        {
            this._eventService = santaService;
        }

		/**
        public async Task SampleGet()
        {
            try
            {
                var participants = await _eventService.UnauthenticatedSampleGet();
                await Clients.All.SendAsync("SampleGet", participants);
            }
            catch (Exception ex)
            {
                LoggerHelper.Log(ex);
            }
        }
	**/
    }
}