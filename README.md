# Task Management System with Flowise AI Integration

A modern web application for managing tasks from Excel files with AI-powered assistance from your custom Flowise assistant.

## Features

✨ **Key Features:**
- 📤 Upload Excel files with tasks, priorities, and deadlines
- 📊 Automatic sorting by closest deadline, then by priority
- 🤖 Integration with your Railway-hosted Flowise assistant
- 💬 Chat interface to interact with the AI assistant
- 📱 Responsive design for desktop and mobile devices
- 🎨 Beautiful UI with gradient backgrounds and smooth animations

## Requirements

- Node.js (v14 or higher)
- npm or yarn
- An Excel file with columns: `Task`, `Priority`, `Deadline`
- (Optional) A Flowise assistant hosted on Railway

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```
   FLOWISE_API_URL=https://your-railway-hosted-flowise-url/api/v1/prediction/your-flow-id
   FLOWISE_API_KEY=your_api_key_if_needed
   PORT=3000
   ```

   Replace `your-railway-hosted-flowise-url` and `your-flow-id` with your actual Flowise instance details.

3. **Start the server:**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:3000`

## Excel File Format

Your Excel file should have the following columns:
- **Task** - Description of the task
- **Priority** - One of: `High`, `Medium`, `Low`
- **Deadline** - Date in format: `YYYY-MM-DD` or `MM/DD/YYYY`

### Example Excel Data:
| Task | Priority | Deadline |
|------|----------|----------|
| Complete project report | High | 2026-01-15 |
| Review documentation | Medium | 2026-01-20 |
| Update database | Low | 2026-02-01 |

## Flowise Integration

### Setting up Flowise:

1. If you don't have Flowise running, deploy it to Railway:
   - Create a Railway account at [railway.app](https://railway.app)
   - Deploy Flowise application
   - Note your Railway URL

2. Create a custom flow in Flowise that will handle task-related queries

3. Get your Flow ID from the Flowise UI

4. Update the `.env` file with:
   ```
   FLOWISE_API_URL=https://your-flowise-railway-url/api/v1/prediction/your-flow-id
   ```

### Making Chat Requests:

The application automatically sends messages to your Flowise assistant. You can ask questions about:
- Task priority suggestions
- Deadline planning
- Workload management
- Task organization tips

## Project Structure

```
.
├── public/
│   ├── css/
│   │   └── style.css          # Styling
│   └── js/
│       └── main.js             # Client-side JavaScript
├── views/
│   └── index.ejs               # HTML template
├── uploads/                    # Temporary Excel file storage
├── server.js                   # Main server file
├── package.json                # Dependencies
└── .env                        # Environment variables
```

## API Endpoints

### GET /
Home page with upload form and task list

### POST /upload
Upload an Excel file
- **Form Data:** `excelFile` (multipart/form-data)
- **Returns:** Rendered page with parsed and sorted tasks

### POST /chat
Send a message to the Flowise assistant
- **Body:** `{ "message": "Your message here" }`
- **Returns:** `{ "reply": "Assistant response" }` or `{ "error": "Error message" }`

## Sorting Logic

Tasks are sorted by:
1. **Deadline** - Closest deadline comes first
2. **Priority** - High → Medium → Low

This ensures urgent tasks with nearby deadlines appear at the top.

## Browser Compatibility

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### File Upload Issues
- Ensure the Excel file is in `.xlsx` or `.xls` format
- Check that column headers match exactly: `Task`, `Priority`, `Deadline`
- Verify file is not corrupted

### Flowise Connection Issues
- Check that the `FLOWISE_API_URL` is correct
- Verify your Railway instance is running
- Check network connectivity
- Look at server console for detailed error messages

### Port Already in Use
If port 3000 is already in use, set the PORT in `.env`:
```
PORT=3001
```

## Development

To run in development mode with auto-reload:
```bash
npm run dev
```

This uses `nodemon` to automatically restart the server when files change.

## Technologies Used

- **Backend:** Node.js, Express.js
- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Templating:** EJS
- **File Handling:** multer, xlsx
- **API Communication:** axios
- **Environment:** dotenv

## License

MIT

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the console output for error messages
3. Ensure all dependencies are installed with `npm install`

---

**Happy task managing! 🚀**
