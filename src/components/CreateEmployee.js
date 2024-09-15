import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateEmployee() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [designation, setDesignation] = useState('HR');
  const [gender, setGender] = useState('male');
  const [course, setCourse] = useState([]);
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/; // Regex for exactly 10 digits
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate phone number (should be exactly 10 digits)
    if (!validatePhone(phone)) {
      setError('Phone number must be exactly 10 digits.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('designation', designation);
    formData.append('gender', gender);
    formData.append('course', course.join(','));
    formData.append('image', image);

    try {
      const response = await fetch('http://localhost:8009/api/employees/add', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        alert('Employee created successfully');
        navigate('/employees'); // Navigate back to employee list
      } else {
        alert(data.message || 'Error creating employee');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="centered-container">
      <div className="create-employee-container">
        <h1>Create Employee</h1>
        <form onSubmit={handleSubmit} className="create-employee-form">
          <div>
            <label>Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label>Phone:</label>
            <input 
              type="text" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              maxLength={10} // Limit to 10 digits in the input field
            />
          </div>
          <div>
            <label>Designation:</label>
            <select value={designation} onChange={(e) => setDesignation(e.target.value)}>
              <option value="HR">HR</option>
              <option value="Manager">Manager</option>
              <option value="Sales">Sales</option>
            </select>
          </div>
          <div>
            <label>Gender:</label>
            <input type="radio" value="male" checked={gender === 'male'} onChange={() => setGender('male')} /> Male
            <input type="radio" value="female" checked={gender === 'female'} onChange={() => setGender('female')} /> Female
          </div>
          <div>
            <label>Course:</label>
            <input type="checkbox" value="MCA" onChange={(e) => setCourse([...course, e.target.value])} /> MCA
            <input type="checkbox" value="BCA" onChange={(e) => setCourse([...course, e.target.value])} /> BCA
            <input type="checkbox" value="BSC" onChange={(e) => setCourse([...course, e.target.value])} /> BSC
          </div>
          <div>
            <label>Image Upload:</label>
            <input type="file" accept=".jpg,.png" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default CreateEmployee;
