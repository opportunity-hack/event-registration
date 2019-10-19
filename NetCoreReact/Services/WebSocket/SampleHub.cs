using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using NetCoreReact.Helpers;
using NetCoreReact.Services.Business.Interfaces;

namespace NetCoreReact.Services.WebSocket
{
    public class SampleHub : Hub
    {
        private readonly ISampleService _sampleService;

        public SampleHub(ISampleService santaService)
        {
            this._sampleService = santaService;
        }

        public async Task SampleGet()
        {
            try
            {
                var participants = await _sampleService.UnauthenticatedSampleGet();
                await Clients.All.SendAsync("SampleGet", participants);
            }
            catch (Exception ex)
            {
                LoggerHelper.Log(ex);
            }
        }
    }
}