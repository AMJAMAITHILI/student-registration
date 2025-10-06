// App.js - React Form
import React, { useState } from 'react';
import './App.css';

function App() {
  const [form, setForm] = useState({
    name: '', 
    rollNo: '', 
    gender: '', 
    department: '', 
    section: '', 
    skills: []
  });
  const [message, setMessage] = useState(null);
  
  const API = process.env.REACT_APP_API_URL || 'http://localhost:4000';

  // Handlers for inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handler for skills checkboxes
  const handleSkills = (e) => {
    const { value, checked } = e.target;
    setForm(prev => ({
      ...prev,
      skills: checked 
        ? [...prev.skills, value] 
        : prev.skills.filter(s => s !== value)
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    
    try {
      const res = await fetch(`${API}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Save failed');
      
      setMessage('✅ Student saved successfully!');
      setForm({ 
        name:'', 
        rollNo:'', 
        gender:'', 
        department:'', 
        section:'', 
        skills:[] 
      });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage('❌ ' + err.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Student Registration</h2>
      
      {message && <p className="msg">{message}</p>}
      
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input 
          type="text"
          name="name" 
          value={form.name} 
          onChange={handleChange} 
          required 
        />
        
        <label>Roll No</label>
        <input 
          type="text"
          name="rollNo" 
          value={form.rollNo} 
          onChange={handleChange} 
          required 
        />
        
        <label>Gender</label>
        <div className="radio-group">
          <label>
            <input 
              type="radio" 
              name="gender" 
              value="Male" 
              checked={form.gender === 'Male'} 
              onChange={handleChange} 
            />
            Male
          </label>
          <label>
            <input 
              type="radio" 
              name="gender" 
              value="Female" 
              checked={form.gender === 'Female'} 
              onChange={handleChange}
            />
            Female
          </label>
        </div>
        
        <label>Department</label>
        <select 
          name="department" 
          value={form.department} 
          onChange={handleChange} 
          required
        >
          <option value="">--Select--</option>
          <option>IT</option>
          <option>CSE</option>
          <option>AIDS</option>
          <option>CET</option>
        </select>
        
        <label>Section</label>
        <select 
          name="section" 
          value={form.section} 
          onChange={handleChange} 
          required
        >
          <option value="">--Select--</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
        
        <label>Skills</label>
        <div className="checkbox-group">
          {['C','C++','Java','JS','Ruby'].map(s => (
            <label key={s}>
              <input 
                type="checkbox" 
                value={s} 
                checked={form.skills.includes(s)}
                onChange={handleSkills} 
              />
              {s}
            </label>
          ))}
        </div>
        
        <button type="submit">Save Student</button>
      </form>
    </div>
  );
}

export default App;