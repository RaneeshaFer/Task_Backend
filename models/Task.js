import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  taskId: {
    type: String,
    required: true,
    unique: true,
  },

  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  dueDate: {
    type: Date,
    required: true,
  },

  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending',
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  }
  
}, {
  timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
