import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { useForm } from 'react-hook-form';
import { Box, Container, Typography, TextField, Button, List, ListItem, ListItemText, ListItemIcon, ListItemSecondaryAction, IconButton, CircularProgress } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';

interface Task {
  id: bigint;
  description: string;
  completed: boolean;
  createdAt: bigint;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const fetchedTasks = await backend.getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
    setLoading(false);
  };

  const onSubmit = async (data: { description: string }) => {
    try {
      await backend.addTask(data.description);
      reset();
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const completeTask = async (id: bigint) => {
    try {
      await backend.completeTask(id);
      fetchTasks();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const deleteTask = async (id: bigint) => {
    try {
      await backend.deleteTask(id);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box className="app-header" sx={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
        <Typography variant="h2" component="h1" sx={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
          Task Manager
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', mb: 4 }}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', width: '100%' }}>
          <TextField
            {...register('description', { required: true })}
            label="New Task"
            variant="outlined"
            fullWidth
            sx={{ mr: 2 }}
          />
          <Button type="submit" variant="contained" startIcon={<AddIcon />}>
            Add
          </Button>
        </form>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <List>
          {tasks.map((task) => (
            <ListItem key={Number(task.id)} sx={{ bgcolor: 'background.paper', mb: 2, borderRadius: 1 }}>
              <ListItemIcon>
                <i data-feather={task.completed ? 'check-circle' : 'circle'} onClick={() => completeTask(task.id)} style={{ cursor: 'pointer' }} />
              </ListItemIcon>
              <ListItemText
                primary={task.description}
                sx={{ textDecoration: task.completed ? 'line-through' : 'none' }}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={() => deleteTask(task.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
}

export default App;
