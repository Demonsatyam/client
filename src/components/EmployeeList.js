import React, { useState, useEffect } from 'react';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [globalEmployeeList, setGlobalEmployeeList] = useState([]); // For search
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editEmployeeData, setEditEmployeeData] = useState(null);

  const fetchEmployees = async (page) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8009/api/employees/getall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page, limit: 10 })
      });
      const data = await response.json();
      setEmployees(data.employees);
      setGlobalEmployeeList(data.employees); // Store the original data
      setTotalPages(data.totalpages);
      setTotalCount(data.totalCount);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees(page);
  }, [page]);

  // Real-time search effect based on search term
  useEffect(() => {
    const filteredEmployees = globalEmployeeList.filter(employee =>
      employee._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setEmployees(filteredEmployees);
  }, [searchTerm, globalEmployeeList]);

  // Function to convert absolute path to a relative URL
  const formatImagePath = (path) => {
    // Check if the path contains backslashes (Windows-style paths)
    if (path.includes('\\')) {
      // Replace backslashes with forward slashes
      path = path.replace(/\\/g, '/');
    }

    // Strip the absolute part of the path and return only the relative part for `/uploads/`
    const uploadIndex = path.indexOf('/uploads');
    if (uploadIndex !== -1) {
      return `http://localhost:8009${path.substring(uploadIndex)}`; // Serve from the uploads folder
    }
    
    return ''; // Fallback in case no valid path is found
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8009/api/employees/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (response.ok) {
        alert('Employee deleted successfully');
        fetchEmployees(1); // Reload the employee list
      } else {
        alert('Error deleting employee');
      }
    } catch (err) {
      console.error('Error deleting employee:', err);
    }
  };

  // Handle edit click
  const handleEdit = (employee) => {
    setIsEditing(true);
    setEditEmployeeData(employee); // Set the employee data for editing
  };

  // Handle edit submit
  const handleEditSubmit = async (updatedEmployee) => {
    try {
      const updatedData = { ...updatedEmployee, id: updatedEmployee._id }; // Map _id to id
      delete updatedData._id; // Remove _id from the object

      const response = await fetch('http://localhost:8009/api/employees/edit', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        alert('Employee updated successfully');
        setIsEditing(false); // Close the edit modal or form
        fetchEmployees(1); // Reload the employee list
      } else {
        alert('Error updating employee');
      }
    } catch (err) {
      console.error('Error updating employee:', err);
    }
  };

  return (
    <div className="centered-container">
      <div className="employee-list-container">
        <div className="employee-header">
          <h1>Employee List</h1>
          <button onClick={() => window.location.href = '/create-employee'}>Create Employee</button>
        </div>
        <div>
          <span>Total Count: {totalCount}</span>
          <input
            type="text"
            className="employee-search"
            placeholder="Enter Search Keyword"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term dynamically
          />
        </div>
        <table className="employee-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile No</th>
              <th>Designation</th>
              <th>Gender</th>
              <th>Course</th>
              <th>Created At</th>
              <th>Actions</th> {/* Add actions column */}
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id}>
                <td>{employee._id}</td>
                <td>
                  <img 
                    src={formatImagePath(employee.imagepath)} // Use the function to correctly format the image path
                    alt={employee.name} 
                    width="50" 
                    height="50"
                  />
                </td>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.phone}</td>
                <td>{employee.designation}</td>
                <td>{employee.gender}</td>
                <td>{employee.course}</td>
                <td>{new Date(employee.createdAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleEdit(employee)}>Edit</button>
                  <button onClick={() => handleDelete(employee._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div>Loading...</div>}
      </div>

      {/* Conditionally render the edit form */}
      {isEditing && (
        <div className="edit-modal">
          <h2>Edit Employee</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleEditSubmit(editEmployeeData); // Pass edited data to submit handler
          }}>
            <label>Name</label>
            <input
              type="text"
              value={editEmployeeData.name}
              onChange={(e) => setEditEmployeeData({ ...editEmployeeData, name: e.target.value })}
            />
            <label>Email</label>
            <input
              type="email"
              value={editEmployeeData.email}
              onChange={(e) => setEditEmployeeData({ ...editEmployeeData, email: e.target.value })}
            />
            <label>Phone</label>
            <input
              type="text"
              value={editEmployeeData.phone}
              onChange={(e) => setEditEmployeeData({ ...editEmployeeData, phone: e.target.value })}
            />
            <label>Designation</label>
            <input
              type="text"
              value={editEmployeeData.designation}
              onChange={(e) => setEditEmployeeData({ ...editEmployeeData, designation: e.target.value })}
            />
            <label>Gender</label>
            <select
              value={editEmployeeData.gender}
              onChange={(e) => setEditEmployeeData({ ...editEmployeeData, gender: e.target.value })}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <label>Course</label>
            <input
              type="text"
              value={editEmployeeData.course}
              onChange={(e) => setEditEmployeeData({ ...editEmployeeData, course: e.target.value })}
            />
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default EmployeeList;
