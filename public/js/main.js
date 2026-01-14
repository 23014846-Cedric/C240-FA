// Task Management Client-Side JavaScript

/* =========================
   UPLOAD FORM HANDLER
========================= */
document.getElementById('uploadForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData();
  const fileInput = document.getElementById('excelFile');
  const file = fileInput.files[0];
  
  if (!file) {
    alert('Please select a file');
    return;
  }
  
  formData.append('excelFile', file);
  
  try {
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData
    });
    
    if (response.ok) {
      // Reload the page to show updated tasks
      window.location.reload();
    } else {
      alert('Error uploading file');
    }
  } catch (error) {
    console.error('Upload error:', error);
    alert('Error uploading file: ' + error.message);
  }
});

/* =========================
   ADD TASK FORM HANDLER
========================= */
document.getElementById('addTaskForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const taskData = {
    task: formData.get('task'),
    priority: formData.get('priority'),
    deadline: formData.get('deadline')
  };
  
  try {
    const response = await fetch('/add-task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Reload the page to show updated tasks
      window.location.reload();
    } else {
      alert(result.error || 'Error adding task');
    }
  } catch (error) {
    console.error('Add task error:', error);
    alert('Error adding task: ' + error.message);
  }
});

/* =========================
   DELETE TASK FUNCTION
========================= */
async function deleteTask(taskName, deadline) {
  if (!confirm(`Are you sure you want to delete "${taskName}"?`)) {
    return;
  }
  
  try {
    const response = await fetch('/delete-task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        taskName: taskName,
        deadline: deadline
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Reload the page to show updated tasks
      window.location.reload();
    } else {
      alert(result.error || 'Error deleting task');
    }
  } catch (error) {
    console.error('Delete error:', error);
    alert('Error deleting task: ' + error.message);
  }
}

/* =========================
   DOWNLOAD EXCEL FUNCTION
========================= */
async function downloadExcel() {
  try {
    const response = await fetch('/download');
    
    if (!response.ok) {
      const result = await response.json();
      alert(result.error || 'Error downloading file');
      return;
    }
    
    // Create a blob from the response
    const blob = await response.blob();
    
    // Create a temporary URL for the blob
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary anchor element and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.xlsx';
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Download error:', error);
    alert('Error downloading file: ' + error.message);
  }
}

// Make functions globally available
window.deleteTask = deleteTask;
window.downloadExcel = downloadExcel;