import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Signup successful!');
        navigate('/login');
      } else {
        alert(data.msg || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Create an Account</h2>
        <form className="space-y-4" onSubmit={handleSignup}>
          <div>
            <label className="block text-gray-700">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Your Name" className="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" className="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
