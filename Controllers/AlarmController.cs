using Microsoft.AspNetCore.Mvc;
using SimpleWebApp.Models;
using SimpleWebApp.Services;

namespace SimpleWebApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AlarmController : ControllerBase
    {
        private readonly AlarmService _alarmService;

        public AlarmController(AlarmService alarmService)
        {
            _alarmService = alarmService;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_alarmService.GetAll());
        }

        [HttpGet("active")]
        public IActionResult GetActive()
        {
            return Ok(_alarmService.GetActiveAlarms());
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var alarm = _alarmService.GetById(id);
            if (alarm == null)
                return NotFound();

            return Ok(alarm);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Alarm alarm)
        {
            if (string.IsNullOrWhiteSpace(alarm.Name))
                return BadRequest("Name is required");

            var created = _alarmService.Create(alarm);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Alarm alarm)
        {
            var updated = _alarmService.Update(id, alarm);
            if (updated == null)
                return NotFound();

            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            if (!_alarmService.Delete(id))
                return NotFound();

            return NoContent();
        }
    }
}
