using Microsoft.AspNetCore.Mvc;

namespace SimpleWebApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HomeController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { 
                message = "Chào mừng đến với Simple Web App!", 
                timestamp = DateTime.Now,
                status = "Running"
            });
        }

        [HttpGet("info")]
        public IActionResult GetInfo()
        {
            return Ok(new { 
                appName = "Simple Web App",
                version = "1.0.0",
                environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production",
                machineName = Environment.MachineName
            });
        }
    }
}
