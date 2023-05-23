import { randomUUID } from 'node:crypto';
import { Database } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search,
      } : null);
      
      return res.writeHead(200).end(JSON.stringify(tasks));
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body;

      if(!title){
        return res.writeHead(400).end(JSON.stringify({ message: 'Title is required.' }));
      }

      if(!description){
        return res.writeHead(400).end(JSON.stringify({ message: 'Description is required.' }));
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
  
      const insertedTask = database.insert('tasks', task)
  
      return res.writeHead(201).end(JSON.stringify(insertedTask));
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const { title, description } = req.body

      if(!title){
        return res.writeHead(400).end(JSON.stringify({ message: 'Title is required.' }));
      }

      if(!description){
        return res.writeHead(400).end(JSON.stringify({ message: 'Description is required.' }));
      }

      const updatedTask = database.update('tasks', id, { 
          title, 
          description, 
          updated_at: new Date().toISOString(), 
        })

      if(!updatedTask){
        return res.writeHead(404).end(JSON.stringify({ message: 'Register not found.' }));
      } 
      
      return res.writeHead(201).end(JSON.stringify(updatedTask));
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const completedTask = database.patch('tasks', id, { completed_at: new Date().toISOString() })

      if(!completedTask){
        return res.writeHead(404).end(JSON.stringify({ message: 'Register not found.' }));
      } 

      return res.writeHead(201).end(JSON.stringify(completedTask));
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const deletedTask = database.delete('tasks', id)

      if(!deletedTask){
        return res.writeHead(404).end(JSON.stringify({ message: 'Register not found.' }));
      }

      return res.writeHead(200).end(JSON.stringify(deletedTask));
    }
  }
]