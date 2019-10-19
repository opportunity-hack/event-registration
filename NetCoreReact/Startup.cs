using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.ML;
using NetCoreReact.Models.ML;
using NetCoreReact.Services.Business;
using NetCoreReact.Services.Data;
using NetCoreReact.Services.WebSocket;
using System.Text;
using NetCoreReact.Services.ML;
using NetCoreReact.Services.ML.Interfaces;
using Microsoft.ML;
using Microsoft.ML.Data;
using NetCoreReact.Attributes;
using Newtonsoft.Json;
using NetCoreReact.Services.Data.Interfaces;
using NetCoreReact.Services.Business.Interfaces;
using NetCoreReact.Models.Documents;
using NetCoreReact.Models.DTO;

namespace NetCoreReact
{
	public class Startup
	{
		public Startup(IWebHostEnvironment env)
		{
			var builder = new ConfigurationBuilder()
				.SetBasePath(env.ContentRootPath)
				.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
				.AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
				.AddEnvironmentVariables();
			Configuration = builder.Build();
			CurrentEnvironment = env;
		}

		public IConfiguration Configuration { get; }
		private IWebHostEnvironment CurrentEnvironment { get; set; }

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
			services.AddCors(options =>
			{
				options.AddDefaultPolicy(
					policy =>
					{
						policy.AllowAnyHeader();
						policy.AllowAnyMethod();
						policy.SetIsOriginAllowed((host) => true);
						policy.AllowCredentials();
					});
			});

            services.AddControllersWithViews(options =>
            {
                options.Filters.Add(typeof(ValidateModelStateAttribute));
            }).AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            });

            services.AddAuthentication()
				.AddJwtBearer(cfg =>
				{
					cfg.RequireHttpsMetadata = false;
					cfg.SaveToken = true;

					cfg.TokenValidationParameters = new TokenValidationParameters()
					{
						ValidIssuer = Configuration["AppSettings:AppDomain"],
						ValidAudiences = new[] { Configuration["AppSettings:AppAudience"] },
						IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["AppSettings:JwtSecret"])),
						ValidateIssuer = true,
						ValidateAudience = true,
						ValidateIssuerSigningKey = true
					};
				});

			services.Configure<CookiePolicyOptions>(options =>
			{
				options.CheckConsentNeeded = context => true;
				options.MinimumSameSitePolicy = SameSiteMode.None;
			});

			services.AddSignalR();
			services.AddPredictionEnginePool<PredictionInput, PredictionOutput>()
				.FromFile(modelName: "MLModel", filePath: Configuration["MLModels:SentimentMLModelFilePath"], watchForChanges: true);

			// Change development environment here (connection string to db or anything else necessary):
			if (CurrentEnvironment.IsDevelopment())
			{
				services.AddSingleton<IDAO<Event, DataResponse<Event>>>(service => new EventDAO(
					Configuration["ConnectionStrings:HerokuMongoDBConnection"],
					Configuration["ConnectionStrings:HerokuMongoDBDatabase"],
					Configuration["ConnectionStrings:HerokuMongoDBCollection"]));
			}
			else
			{
				services.AddSingleton<IDAO<Event, DataResponse<Event>>>(service => new EventDAO(
					Configuration["ConnectionStrings:HerokuMongoDBConnection"],
					Configuration["ConnectionStrings:HerokuMongoDBDatabase"],
					Configuration["ConnectionStrings:HerokuMongoDBCollection"]));
			}

			// Inject dependencies here:
			services.AddSingleton<IEmailService>(service => new EmailService(Configuration["APIKeys:SendGridAPIKey"]));
			services.AddSingleton<IEventService, EventService>();
			services.AddSingleton<IAuthenticationService, AuthenticationService>();
			services.AddSingleton<IPredictionService, PredictionService>();
			services.AddSingleton<MLContext>();
			services.AddSingleton<ITransformer, TransformerChain<ITransformer>>((context) =>
			{
				DataViewSchema predictionPipelineSchema;
				return (TransformerChain<ITransformer>)context
					.GetRequiredService<MLContext>()
					.Model.Load(Configuration["MLModels:SentimentMLModelFilePath"], out predictionPipelineSchema);
			});

			// In production, the React files will be served from this directory:
			services.AddSpaStaticFiles(configuration =>
			{
				configuration.RootPath = "ClientApp/build";
			});
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
			}
			else
			{
				app.UseExceptionHandler("/Error");
				// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
				app.UseHsts();
			}

			app.UseHttpsRedirection();
			app.UseStaticFiles();
			app.UseSpaStaticFiles();
			app.UseCors();
			app.UseRouting();
			app.UseAuthentication();
			app.UseAuthorization();
			app.UseCookiePolicy();

			app.UseEndpoints(endpoints =>
			{
				endpoints.MapControllerRoute(
					name: "default",
					pattern: "{controller}/{action=Index}/{id?}");
				// Map the SignalR Hub here (don't forget to change the route):
				endpoints.MapHub<SampleHub>("/SampleHub");
			});

			app.UseSpa(spa =>
			{
				spa.Options.SourcePath = "ClientApp";

				if (env.IsDevelopment())
				{
					spa.UseReactDevelopmentServer(npmScript: "start");
				}
			});
		}
	}
}
