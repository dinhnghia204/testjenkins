using SimpleWebApp.Models;

namespace SimpleWebApp.Services
{
    public class TodoService
    {
        private readonly List<TodoItem> _todos = new List<TodoItem>();
        private int _nextId = 1;

        public List<TodoItem> GetAll()
        {
            return _todos.OrderByDescending(t => t.CreatedAt).ToList();
        }

        public TodoItem? GetById(int id)
        {
            return _todos.FirstOrDefault(t => t.Id == id);
        }

        public TodoItem Create(TodoItem todo)
        {
            todo.Id = _nextId++;
            todo.CreatedAt = DateTime.Now;
            _todos.Add(todo);
            return todo;
        }

        public TodoItem? Update(int id, TodoItem updatedTodo)
        {
            var todo = GetById(id);
            if (todo == null) return null;

            todo.Title = updatedTodo.Title;
            todo.IsCompleted = updatedTodo.IsCompleted;
            return todo;
        }

        public bool Delete(int id)
        {
            var todo = GetById(id);
            if (todo == null) return false;

            _todos.Remove(todo);
            return true;
        }
    }
}
