# ClearDay

ClearDay is a task management web application built with React and Firebase. Organize your tasks, set priorities, track progress, and boost your productivity with this clean and intuitive interface.

## Features

- **Task Management**: Create, update, and delete tasks with ease
- **Priority Levels**: Set priority levels (low, medium, high) for your tasks
- **Status Tracking**: Track task status (pending, in progress, completed)
- **Due Date Management**: Set and monitor task deadlines
- **Filtering & Search**: Filter tasks by status, priority, due date, or search by keywords
- **Responsive Design**: Works great on desktop and mobile devices
- **Real-time Updates**: Changes are reflected instantly with Firebase integration

## Live Demo

Visit the live application: [ClearDay App](https://clearday.netlify.app)

## Technologies Used

- React.js
- Firebase/Firestore
- Tailwind CSS
- Netlify (Hosting)

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm or yarn
- A Firebase account

### Installation

1. Clone this repository
```bash
git clone https://github.com/poppycalifornia56/task-manager.git
cd task-manager
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Environment Setup
   - Copy the `.env.example` file to create a new `.env` file
   ```bash
   cp .env.example .env
   ```
   - Update the `.env` file with your Firebase project credentials

4. Start the development server
```bash
npm start
# or
yarn start
```

5. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser

## Environment Setup

This project requires Firebase configuration. Follow these steps to set up your environment:

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Firestore database in your Firebase project
3. Copy your Firebase configuration from your project settings
4. Update your `.env` file with your Firebase configuration:

```
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=1:your_app_id_here
REACT_APP_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.


---

Created with ❤️ by [poppycalifornia56](https://github.com/poppycalifornia56)