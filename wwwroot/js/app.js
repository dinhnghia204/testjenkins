const API_URL = '/api/todo';

// Load todos khi trang load
document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    
    // Thêm todo khi nhấn Enter
    document.getElementById('todoInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
});

// Load danh sách todos
async function loadTodos() {
    try {
        const response = await fetch(API_URL);
        const todos = await response.json();
        renderTodos(todos);
        updateStats(todos);
    } catch (error) {
        console.error('Lỗi khi load todos:', error);
    }
}

// Render todos lên UI
function renderTodos(todos) {
    const todoList = document.getElementById('todoList');
    
    if (todos.length === 0) {
        todoList.innerHTML = '<div class="empty-state">Chưa có công việc nào. Hãy thêm mới!</div>';
        return;
    }
    
    todoList.innerHTML = todos.map(todo => `
        <li class="todo-item ${todo.isCompleted ? 'completed' : ''}">
            <input 
                type="checkbox" 
                class="todo-checkbox" 
                ${todo.isCompleted ? 'checked' : ''} 
                onchange="toggleTodo(${todo.id}, ${!todo.isCompleted})"
            />
            <span class="todo-text">${escapeHtml(todo.title)}</span>
            <span class="todo-date">${formatDate(todo.createdAt)}</span>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">Xóa</button>
        </li>
    `).join('');
}

// Thêm todo mới
async function addTodo() {
    const input = document.getElementById('todoInput');
    const title = input.value.trim();
    
    if (!title) {
        alert('Vui lòng nhập nội dung công việc!');
        return;
    }
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                isCompleted: false
            })
        });
        
        if (response.ok) {
            input.value = '';
            loadTodos();
        }
    } catch (error) {
        console.error('Lỗi khi thêm todo:', error);
    }
}

// Toggle trạng thái hoàn thành
async function toggleTodo(id, isCompleted) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const todo = await response.json();
        
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...todo,
                isCompleted: isCompleted
            })
        });
        
        loadTodos();
    } catch (error) {
        console.error('Lỗi khi cập nhật todo:', error);
    }
}

// Xóa todo
async function deleteTodo(id) {
    if (!confirm('Bạn có chắc muốn xóa công việc này?')) {
        return;
    }
    
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        loadTodos();
    } catch (error) {
        console.error('Lỗi khi xóa todo:', error);
    }
}

// Cập nhật thống kê
function updateStats(todos) {
    const total = todos.length;
    const completed = todos.filter(t => t.isCompleted).length;
    const pending = total - completed;
    
    document.getElementById('totalCount').textContent = total;
    document.getElementById('completedCount').textContent = completed;
    document.getElementById('pendingCount').textContent = pending;
}

// Format ngày giờ
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} giờ trước`;
    
    return date.toLocaleDateString('vi-VN');
}

// Escape HTML để tránh XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
