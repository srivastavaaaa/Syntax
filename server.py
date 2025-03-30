from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

print("Flask server is starting...")

app = Flask(__name__)
# Configure CORS to allow all origins during development
CORS(app, resources={r"/*": {"origins": "*"}})

# Database initialization
def init_db():
    try:
        conn = sqlite3.connect('todos.db')
        c = conn.cursor()
        c.execute('''
            CREATE TABLE IF NOT EXISTS todos
            (id INTEGER PRIMARY KEY AUTOINCREMENT,
             text TEXT NOT NULL,
             completed BOOLEAN NOT NULL DEFAULT 0,
             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
        ''')
        conn.commit()
        conn.close()
        print("Database initialized successfully")
    except Exception as e:
        print(f"Error initializing database: {e}")

# Initialize database when the app starts
init_db()

@app.route('/')
def home():
    return "Hello, Flask is working!"

@app.route('/api/health', methods=['GET'])
def health_check():
    logger.debug("Health check endpoint called")
    return jsonify({'status': 'healthy'}), 200

@app.route('/api/todos', methods=['GET'])
def get_todos():
    logger.debug("GET /api/todos called")
    try:
        conn = sqlite3.connect('todos.db')
        c = conn.cursor()
        c.execute('SELECT * FROM todos ORDER BY created_at DESC')
        todos = [{'id': row[0], 'text': row[1], 'completed': bool(row[2])} for row in c.fetchall()]
        conn.close()
        logger.debug(f"Retrieved {len(todos)} todos")
        return jsonify(todos)
    except Exception as e:
        logger.error(f"Error in get_todos: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/todos', methods=['POST'])
def add_todo():
    logger.debug("POST /api/todos called")
    try:
        data = request.json
        logger.debug(f"Received data: {data}")
        if not data or 'text' not in data:
            return jsonify({'error': 'Text is required'}), 400
        
        conn = sqlite3.connect('todos.db')
        c = conn.cursor()
        c.execute('INSERT INTO todos (text, completed) VALUES (?, ?)',
                  (data['text'], data.get('completed', False)))
        conn.commit()
        todo_id = c.lastrowid
        conn.close()
        
        logger.debug(f"Created new todo with ID: {todo_id}")
        return jsonify({
            'id': todo_id,
            'text': data['text'],
            'completed': data.get('completed', False)
        }), 201
    except Exception as e:
        logger.error(f"Error in add_todo: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/todos/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    logger.debug(f"PUT /api/todos/{todo_id} called")
    try:
        data = request.json
        logger.debug(f"Received data: {data}")
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        conn = sqlite3.connect('todos.db')
        c = conn.cursor()
        
        # Check if todo exists
        c.execute('SELECT * FROM todos WHERE id = ?', (todo_id,))
        if not c.fetchone():
            conn.close()
            return jsonify({'error': 'Todo not found'}), 404
        
        # Update todo
        c.execute('''
            UPDATE todos 
            SET text = ?, completed = ?
            WHERE id = ?
        ''', (data.get('text'), data.get('completed'), todo_id))
        
        conn.commit()
        conn.close()
        
        logger.debug(f"Updated todo with ID: {todo_id}")
        return jsonify({'message': 'Todo updated successfully'})
    except Exception as e:
        logger.error(f"Error in update_todo: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    logger.debug(f"DELETE /api/todos/{todo_id} called")
    try:
        conn = sqlite3.connect('todos.db')
        c = conn.cursor()
        
        # Check if todo exists
        c.execute('SELECT * FROM todos WHERE id = ?', (todo_id,))
        if not c.fetchone():
            conn.close()
            return jsonify({'error': 'Todo not found'}), 404
        
        # Delete todo
        c.execute('DELETE FROM todos WHERE id = ?', (todo_id,))
        conn.commit()
        conn.close()
        
        logger.debug(f"Deleted todo with ID: {todo_id}")
        return jsonify({'message': 'Todo deleted successfully'})
    except Exception as e:
        logger.error(f"Error in delete_todo: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("Starting server on http://localhost:5000")
    app.run(debug=True, port=5000, host='0.0.0.0') 