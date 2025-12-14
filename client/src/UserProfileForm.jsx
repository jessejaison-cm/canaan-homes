import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function UserProfileForm() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [photo, setPhoto] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [preview, setPreview] = useState("");

  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setPhone(data.phone || "");
          setAddress(data.address || "");
          setPhoto(data.photo || "");
          setPreview(data.photo || "");
        }
      } catch (err) {
        console.error('Could not fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('phone', phone);
      formData.append('address', address);
      if (photoFile) {
        formData.append('photo', photoFile);
      } else if (photo) {
        formData.append('photo', photo);
      }

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Profile updated!");
        navigate("/");
      } else {
        alert(data.msg || "Profile update failed");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Complete Your Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-md"
              required
            />
          </div>
          <div>
              <label className="block">Profile Photo (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setPhotoFile(file || null);
                  if (file) {
                    setPreview(URL.createObjectURL(file));
                  }
                }}
                className="w-full"
              />
              {preview && (
                <img src={preview} alt="preview" className="w-24 h-24 object-cover rounded mt-2" />
              )}
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
          >
            Save Profile
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full mt-2 bg-gray-300 text-black py-2 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserProfileForm;
