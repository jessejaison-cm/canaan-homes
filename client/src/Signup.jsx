function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Create an Account</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <input type="text" placeholder="Your Name" className="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input type="email" placeholder="you@example.com" className="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input type="password" placeholder="Password" className="w-full mt-1 px-4 py-2 border rounded-md" />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
