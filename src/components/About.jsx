import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-blue-600 mb-6">
              About Clearday
            </h1>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
              <p className="text-gray-700 mb-4">
                Clearday is designed to help you organize your tasks efficiently
                and stay productive. We believe in creating simple, intuitive
                tools that make your life easier and help you achieve your
                goals.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Features</h2>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li>Create, edit, and delete tasks with ease</li>
                <li>Prioritize tasks (high, medium, low)</li>
                <li>Set due dates and track progress</li>
                <li>Filter tasks by status, priority, and date</li>
                <li>Search functionality to quickly find specific tasks</li>
                <li>Responsive design - works on desktop and mobile</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Technology</h2>
              <p className="text-gray-700 mb-4">
                Clearday is built using modern web technologies:
              </p>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li>React for the frontend user interface</li>
                <li>Firebase for real-time database and backend services</li>
                <li>Tailwind CSS for styling and responsive design</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Contact</h2>
              <p className="text-gray-700">
                Have questions or suggestions? Feel free to reach out to us at{" "}
                <a
                  href="mailto:contact@clearday.app"
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  johannnhandoko@gmail.com
                </a>{" "}
                or visit our{" "}
                <a
                  href="https://github.com/poppycalifornia56/task-manager"
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub repository
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer githubUsername="poppycalifornia56" />
    </div>
  );
};

export default About;
