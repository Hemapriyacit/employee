import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const departments = ["HR", "Engineering", "Marketing"];

const employeeSchema = z.object({
  employeeId: z.string().min(1, "EmployeeId must not be empty").max(10, "Max 10 characters").regex(/^\d{2}[A-Z]{2}\d{1,6}$/, "Invalid Format"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().regex(/^\d{10}$/, "Must be 10 digits"),
  department: z.string().min(1, "Department is required"),
  dateOfJoining: z.string().refine(
    (date) => new Date(date) <= new Date(),
    "Cannot be a future date"
  ),
  role: z.string().min(1, "Role is required"),
});

const EmployeeForm = () => {
  const [date, setDate] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(employeeSchema) });

  const onSubmit = async (formData) => {
    try {
      const response = await axios.post('http://localhost:3000/api/addemployees', formData);
      console.log('Response:', response);
    } catch (error) {
      console.error('Error during API call:', error);
      if (error.response && error.response.data) {
        const errors = error.response.data.errors;
        if (errors) {
          console.log('Errors:', errors);
          console.log(response.data.message);
        } else {
          console.log('No specific errors returned from the server.');
        }
      } else {
        console.error('Error response or error data is not available.');
      }
    }
  };

  const handleDateChange = (date) => {
    setDate(date);
    setValue("dateOfJoining", date.toISOString().split("T")[0]);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl mx-auto p-4 bg-white shadow-md rounded-md">
      <div className="mb-4">
        <input
          {...register("employeeId")}
          placeholder="Employee ID"
          className={`border p-2 w-full rounded ${errors.employeeId ? 'border-red-500' : ''}`}
        />
        {errors.employeeId && <p className="text-red-500 text-sm">{errors.employeeId.message}</p>}
      </div>

      <div className="mb-4">
        <input
          {...register("name")}
          placeholder="Name"
          className={`border p-2 w-full rounded ${errors.name ? 'border-red-500' : ''}`}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div className="mb-4">
        <input
          {...register("email")}
          placeholder="Email"
          className={`border p-2 w-full rounded ${errors.email ? 'border-red-500' : ''}`}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div className="mb-4">
        <input
          {...register("phone")}
          placeholder="Phone"
          className={`border p-2 w-full rounded ${errors.phone ? 'border-red-500' : ''}`}
        />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
      </div>

      <div className="mb-4">
        <select
          {...register("department")}
          className={`border p-2 w-full rounded ${errors.department ? 'border-red-500' : ''}`}
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
        {errors.department && <p className="text-red-500 text-sm">{errors.department.message}</p>}
      </div>

      <div className="mb-4">
        <DatePicker
          selected={date}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
          maxDate={new Date()}
          placeholderText="Select Date"
          className={`border p-2 w-full rounded ${errors.dateOfJoining ? 'border-red-500' : ''}`}
        />
        {errors.dateOfJoining && <p className="text-red-500 text-sm">{errors.dateOfJoining.message}</p>}
      </div>

      <div className="mb-4">
        <input
          {...register("role")}
          placeholder="Role"
          className={`border p-2 w-full rounded ${errors.role ? 'border-red-500' : ''}`}
        />
        {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
      </div>

      <div className="mb-4 flex gap-4">
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Submit</button>
        <button
          type="button"
          onClick={() => {
            reset();
            setDate(null);
          }}
          className="bg-gray-500 text-white p-2 rounded w-full"
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
