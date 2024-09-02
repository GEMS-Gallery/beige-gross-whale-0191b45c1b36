import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { useForm, Controller } from 'react-hook-form';
import { Box, Container, Typography, TextField, Button, List, ListItem, ListItemText, ListItemIcon, ListItemSecondaryAction, IconButton, CircularProgress, Chip, Grid } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, CheckCircle as CheckCircleIcon, Work as WorkIcon, Home as HomeIcon, School as SchoolIcon, ShoppingCart as ShoppingIcon, Favorite as PersonalIcon } from '@mui/icons-material';

interface Task {
  id: bigint;
  description: string;
  categories: string[];
  completed: boolean;
  createdAt: bigint;
}

const categoryIcons: { [key: string]: React.ReactElement } = {
  Work: <WorkIcon />,
  Home: <HomeIcon />,
  School: <SchoolIcon />,
  Shopping: <ShoppingIcon />,
  Personal: <PersonalIcon />,
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { control, handleSubmit, reset } = useForm();

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

  const onSubmit = async (data: { description: string; categories: string }) => {
    try {
      const categories = data.categories.split(',').map(cat => cat.trim()).filter(cat => cat !== '');
      await backend.addTask(data.description, categories);
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

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const filteredTasks = selectedCategories.length > 0
    ? tasks.filter(task => task.categories.some(cat => selectedCategories.includes(cat)))
    : tasks;

  const allCategories = Array.from(new Set(tasks.flatMap(task => task.categories)));

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" sx={{ my: 4, textAlign: 'center', color: 'text.primary' }}>
        Task Manager
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <Typography variant="h6" sx={{ mb: 2 }}>Categories</Typography>
          <List>
            {allCategories.map((category) => (
              <ListItem
                key={category}
                button
                onClick={() => toggleCategory(category)}
                selected={selectedCategories.includes(category)}
              >
                <ListItemIcon>
                  {categoryIcons[category] || <WorkIcon />}
                </ListItemIcon>
                <ListItemText primary={category} />
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={12} md={9}>
          <Box sx={{ display: 'flex', flexDirection: 'column', mb: 4 }}>
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <Controller
                name="description"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="New Task"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                )}
              />
              <Controller
                name="categories"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Categories (comma-separated)"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                )}
              />
              <Button type="submit" variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: 'primary.main', color: 'background.paper' }}>
                Add Task
              </Button>
            </form>
          </Box>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {filteredTasks.map((task) => (
                <ListItem key={Number(task.id)} sx={{ bgcolor: 'background.paper', mb: 2, borderRadius: 1, border: '1px solid', borderColor: 'grey.300' }}>
                  <ListItemIcon>
                    <IconButton onClick={() => completeTask(task.id)}>
                      {task.completed ? <CheckCircleIcon sx={{ color: 'primary.main' }} /> : <CheckCircleIcon sx={{ color: 'grey.500' }} />}
                    </IconButton>
                  </ListItemIcon>
                  <ListItemText
                    primary={task.description}
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        {task.categories.map((category, index) => (
                          <Chip key={index} icon={categoryIcons[category] || <WorkIcon />} label={category} size="small" sx={{ mr: 1, mb: 1 }} />
                        ))}
                      </Box>
                    }
                    sx={{ color: 'text.primary', textDecoration: task.completed ? 'line-through' : 'none' }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" onClick={() => deleteTask(task.id)}>
                      <DeleteIcon sx={{ color: 'error.main' }} />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
