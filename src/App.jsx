import React from "react";
import EmployeeForm from "./components/EmployeeForm/EmployeeForm";

const App = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">
      Employee Management System
    </h1>
    <EmployeeForm />
  </div>
);

export default App;
