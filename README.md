# Messenger Todo List - GitHub Pages Version

A standalone frontend-only todo list application using React and localStorage. This version is designed to be deployed to GitHub Pages without requiring a backend server.

## Features

- ✅ Add, edit, and delete todo items
- ✅ Mark todos as complete/incomplete
- ✅ Add descriptions to todos
- ✅ Add sub-action items to todos
- ✅ Data persistence using browser localStorage
- ✅ Messenger Extensions SDK integration
- ✅ Fully responsive design

## Local Development

### Option 1: Using Docker (Recommended for Quick Testing)

**Prerequisites:**
- Docker and Docker Compose

**Quick Start:**
```bash
# Build and start the container
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

Access the app at: **http://localhost:8080**

**Stop the container:**
```bash
docker-compose down
```

### Option 2: Using npm (Development Mode)

**Prerequisites:**
- Node.js (v16 or higher)
- npm or yarn

**Setup:**

1. Clone or navigate to this directory:
   ```bash
   cd messengerProject-GHPages
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Data Storage

This application uses **browser localStorage** to store all data. This means:

- ✅ Data persists across page refreshes
- ✅ No backend server required
- ⚠️ Data is stored locally in your browser
- ⚠️ Data is specific to each browser/device
- ⚠️ Clearing browser data will delete your todos

### Viewing Stored Data

You can inspect the stored data in your browser's developer console:

```javascript
// View all stored data
localStorage.getItem('messenger_todo_app_data')

// Clear all data (if needed)
localStorage.removeItem('messenger_todo_app_data')
```

## Deployment to GitHub Pages

### Option 1: Using GitHub Actions (Recommended)

1. Update `package.json` homepage field with your GitHub Pages URL:
   ```json
   "homepage": "https://yourusername.github.io/messengerProject-GHPages"
   ```

2. Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
         - run: npm install
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./build
   ```

3. Push to GitHub and the action will deploy automatically.

### Option 2: Manual Deployment

1. Build the app:
   ```bash
   npm run build
   ```

2. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

3. Add deploy script to `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

5. In GitHub repository settings:
   - Go to Settings → Pages
   - Select source: `gh-pages` branch
   - Save

### Option 3: Deploy build folder manually

1. Build the app:
   ```bash
   npm run build
   ```

2. Copy contents of `build/` folder

3. Create a new branch called `gh-pages`

4. Push the build folder contents to `gh-pages` branch root

5. Enable GitHub Pages in repository settings

## Docker Commands

```bash
# Build and start
docker-compose up --build

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down

# Rebuild after code changes
docker-compose up -d --build
```

## Project Structure

```
messengerProject-GHPages/
├── public/
│   └── index.html
├── src/
│   ├── services/
│   │   └── storageService.js      # localStorage service
│   ├── pages/
│   │   ├── TodoListPage.js
│   │   ├── TodoDetailPage.js
│   │   └── TodoDetailPage.css
│   ├── components/
│   │   ├── TodoList.js
│   │   ├── TodoItem.js
│   │   ├── TodoForm.js
│   │   └── *.css files
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
└── package.json
```

## Technical Details

- **Routing**: Uses HashRouter (compatible with GitHub Pages)
- **Storage**: localStorage with key `messenger_todo_app_data`
- **ID Generation**: Uses timestamp + random string
- **Framework**: React 18 with React Router v6

## Notes

- This is a standalone version - no backend required
- All data is stored locally in the user's browser
- Messenger Extensions SDK is included for potential Messenger integration
- The app works offline after the first load

## License

MIT

# messengerProject-GHPages
