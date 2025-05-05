import { useState, useEffect } from 'react';
import { BASE_URL } from '../../config';
import { toast } from 'react-toastify';

const DoctorSearchAndSchedule = () => {
  const [doctors, setDoctors] = useState([]); // All doctors data
  const [filteredDoctors, setFilteredDoctors] = useState([]); // Filtered doctors data
  const [filters, setFilters] = useState({
    name: '',
    department: '',
    specialization: '',
    position: '',
  });
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    description: '',
  });

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Fetch all doctors when the component loads
    fetchDoctors();
  }, []);

  // Fetch all doctors from the backend
  const fetchDoctors = () => {
    fetch(`${BASE_URL}/api/doctors`)
      .then(res => res.json())
      .then(data => {
        setDoctors(data); // Set all doctors in the state
        setFilteredDoctors(data); // Initially, display all doctors
      })
      .catch(err => {
        toast.error('Failed to load doctors');
      });
  };

  // Handle changes in the filter fields
  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(prev => {
      const updatedFilters = { ...prev, [name]: value };
      // Apply filtering when filter changes
      applyFilters(updatedFilters);
      return updatedFilters;
    });
  };

  // Apply filters based on the entered filter values
  const applyFilters = updatedFilters => {
    const { name, department, specialization, position } = updatedFilters;

    const filtered = doctors.filter(doc => {
      return (
        doc.Name.toLowerCase().includes(name.toLowerCase()) &&
        doc.Department.toLowerCase().includes(department.toLowerCase()) &&
        (specialization ? doc.Specialization.toLowerCase().includes(specialization.toLowerCase()) : true) &&
        (position ? doc.Position.toLowerCase().includes(position.toLowerCase()) : true)
      );
    });

    setFilteredDoctors(filtered);
  };

  // Handle form input changes for appointment scheduling
  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle appointment submission
  const handleAppointmentSubmit = (e, doctor) => {
    e.preventDefault();
    fetch(`${BASE_URL}/api/users/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        UserID: user.UserID,
        DoctorID: doctor.DoctorID,
        Date: formData.date,
        Time: formData.time,
        Description: formData.description,
      }),
    })
      .then(res => res.json())
      .then(result => {
        if (!result.ok) throw new Error(result.message);
        toast.success('Appointment scheduled!');
        setSelectedDoctorId(null);
        setFormData({ date: '', time: '', description: '' });
      })
      .catch(err => {
        toast.error(err.message);
      });
  };

  return (
    <section className="px-5 xl:px-0 py-10">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-md">

        {/* Header */}
        <div className="bg-blue-100 border border-blue-300 text-blue-700 px-4 py-3 rounded-md mb-6 text-center">
          <h2 className="text-xl font-semibold tracking-wide">🔍 Search & Schedule Doctor Appointments</h2>
        </div>

        {/* Filter Inputs */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <input
            type="text"
            name="name"
            placeholder="Doctor name..."
            className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-primaryColor"
            value={filters.name}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="department"
            placeholder="Department..."
            className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-primaryColor"
            value={filters.department}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="specialization"
            placeholder="Specialization..."
            className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-primaryColor"
            value={filters.specialization}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="position"
            placeholder="Position..."
            className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-primaryColor"
            value={filters.position}
            onChange={handleFilterChange}
          />
        </div>

        {/* Doctor Cards */}
        <div className="grid gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.DoctorID}
              className="p-5 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{doc.Name}</h3>
              <p className="text-sm text-gray-600"><strong>Department:</strong> {doc.Department}</p>
              <p className="text-sm text-gray-600"><strong>Cabin:</strong> {doc.Cabin}</p>
              <p className="text-sm text-gray-600"><strong>Specialization:</strong> {doc.Specialization || 'N/A'}</p>
              <p className="text-sm text-gray-600"><strong>Position:</strong> {doc.Position || 'N/A'}</p>

              {selectedDoctorId !== doc.DoctorID ? (
                <button
                  className="mt-4 px-6 py-2 bg-primaryColor text-white rounded hover:bg-blue-600 transition-all"
                  onClick={() => setSelectedDoctorId(doc.DoctorID)}
                >
                  Schedule Appointment
                </button>
              ) : (
                <div className="mt-6 p-4 border border-gray-300 rounded-xl bg-gray-50 shadow-inner">
                  <h3 className="text-lg font-bold text-primaryColor mb-4">
                    Schedule with Dr. {doc.Name}
                  </h3>
                  <form onSubmit={(e) => handleAppointmentSubmit(e, doc)} className="grid gap-5">
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-primaryColor"
                    />
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                      className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-primaryColor"
                    />
                    <textarea
                      name="description"
                      placeholder="Describe the issue"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-primaryColor"
                    />
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-primaryColor text-white rounded font-semibold hover:bg-blue-600 transition-all"
                      >
                        Confirm Appointment
                      </button>
                      <button
                        type="button"
                        className="px-6 py-3 border border-gray-400 rounded font-semibold hover:bg-gray-100 transition-all"
                        onClick={() => setSelectedDoctorId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DoctorSearchAndSchedule;
