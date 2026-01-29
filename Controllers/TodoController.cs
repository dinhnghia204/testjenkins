using Microsoft.AspNetCore.Mvc;
using SimpleWebApp.Models;
using SimpleWebApp.Services;

namespace SimpleWebApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TodoController : ControllerBase
    {
        private readonly TodoService _todoService;

        public TodoController(TodoService todoService)
        {
            _todoService = todoService;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_todoService.GetAll());
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var todo = _todoService.GetById(id);
            if (todo == null)
                return NotFound();

            return Ok(todo);
        }

        [HttpPost]
        public IActionResult Create([FromBody] TodoItem todo)
        {
            if (string.IsNullOrWhiteSpace(todo.Title))
                return BadRequest("Title is required");

            var created = _todoService.Create(todo);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] TodoItem todo)
        {
            var updated = _todoService.Update(id, todo);
            if (updated == null)
                return NotFound();

            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            if (!_todoService.Delete(id))
                return NotFound();

            return NoContent();
        }
    }
}
