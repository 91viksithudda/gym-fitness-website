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
            <Link to="/register" className="btn-primary text-center">
              Join Now - It's Free!
            </Link>
            <Link to="/exercises" className="btn-secondary text-center text-white dark:text-gray-800">
              View Exercises
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
              Get customized exercise plans based on your fitness level and goals.
            </p>
          </div>
          
          <div className="card p-6">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold mb-2 dark:text-white">Reward System</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Earn coins for completing exercises and climb the leaderboard.
            </p>
          </div>
          
          <div className="card p-6">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2 dark:text-white">Track Progress</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Monitor your improvements with detailed statistics and analytics.
            </p>
          </div>
        </div>
      </section>

      {/* Motivation Section */}
      <section className="bg-gray-200 dark:bg-gray-800 rounded-2xl p-8 text-center">
        <h2 className="text-3xl font-bold mb-4 dark:text-white">Ready to Start Your Fitness Journey?</h2>
        <p className="text-xl mb-6 text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          "The only bad workout is the one that didn't happen." - Unknown
        </p>
        <Link to="/register" className="btn-primary inline-block">
          Get Started Today
        </Link>
      </section>
    </div>
  );
};

export default Home;