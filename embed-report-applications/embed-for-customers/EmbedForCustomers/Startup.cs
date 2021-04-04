using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using QuebecPowerBI_Connector.Models;
using QuebecPowerBI_Connector.Services;

namespace QuebecPowerBI_Connector
{
    public class Startup
    {
        private readonly string DevClientAppAccess = "_devClientAppAccess";

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy(name: DevClientAppAccess,
                    builder =>
                    {
                        builder.WithOrigins("http://localhost:3000")
                        .AllowAnyHeader()
                        .AllowAnyMethod(); ;
                    });
            });

            // Register AadService and PbiEmbedService for dependency injection
            services.AddScoped(typeof(AadService))
                    .AddScoped(typeof(PbiEmbedService));

            services.AddControllers();

            // Loading appsettings.json in C# Model classes
            services.Configure<AzureAd>(Configuration.GetSection("AzureAd"))
                    .Configure<PowerBI>(Configuration.GetSection("PowerBI"));

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseCors(DevClientAppAccess);
            }

            app.UseHttpsRedirection();
            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseRouting();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                // To display react as startup page.
                endpoints.MapFallbackToController("Index", "Fallback");
            });
        }
    }
}
