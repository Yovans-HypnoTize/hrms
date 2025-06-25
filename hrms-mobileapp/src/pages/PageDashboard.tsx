import React from "react";
import Dashboard from "../components/dashboard/Dashboard";

const PageDashboard: React.FC = () => {

  return (
    <div className="dashboard">
      <div className="mt-2 w-100">
        <Dashboard />
      </div>
    </div>
  );
};

export default PageDashboard;
