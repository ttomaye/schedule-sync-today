
import React from 'react';
import DailyPlanner from '../components/DailyPlanner';

const Index = () => {
  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 bg-gray-50">
      <div className="container mx-auto">
        <DailyPlanner />
      </div>
    </div>
  );
};

export default Index;
