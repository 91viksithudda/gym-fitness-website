import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 md:p-12 text-white mb-12">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Transform Your Body, Transform Your Life
          </h1>
          <p className="text-xl mb-6">
            Join our community of fitness enthusiasts and achieve your health goals with personalized workout plans and progress tracking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/subscription" className="btn-primary text-center">
              Join Now - It's Free!
            </Link>
            <Link to="/exercises" className="btn-secondary text-center text-white dark:text-gray-800">
              Add Exercises
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">Why Choose GymFitness?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card p-6">
            <div className="text-4xl mb-4">💪</div>
            <h3 className="text-xl font-bold mb-2 dark:text-white">Personalized Workouts</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Create custom workout plans tailored to your fitness level and goals.
            </p>
          </div>
          <div className="card p-6">
            <div className="text-4xl mb-4">⏱️</div>
            <h3 className="text-xl font-bold mb-2 dark:text-white">Timer Integration</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Built-in timers for each exercise to help you track your workout duration.
            </p>
          </div>
          <div className="card p-6">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold mb-2 dark:text-white">Progress Tracking</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Monitor your fitness journey with detailed progress reports and achievements.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-5xl mb-4">1</div>
            <h3 className="text-xl font-bold mb-2 dark:text-white">Sign Up</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Create your free account and set up your profile.
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">2</div>
            <h3 className="text-xl font-bold mb-2 dark:text-white">Add Exercises</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Browse our exercise library and add workouts to your routine.
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">3</div>
            <h3 className="text-xl font-bold mb-2 dark:text-white">Track Progress</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Complete workouts and monitor your improvements over time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;