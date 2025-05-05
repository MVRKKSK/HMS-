import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../config';

const DeleteMedicine = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMedicines = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/medicine/get-medicines`);
      const data = await res.json();
      console.log(data)
      if (!res.ok) throw new Error(data.message || 'Failed to fetch medicines');

      setMedicines(data); // fallback to empty array
    } catch (err) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleDelete = async (medicineID) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        const res = await fetch(`${BASE_URL}/api/admin/medicine/${medicineID}`, {
          method: 'DELETE',
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message || 'Failed to delete medicine');

        toast.success('Medicine deleted successfully');
        setMedicines((prev) => prev.filter(med => med.MedicineID !== medicineID));
      } catch (err) {
        toast.error(err.message || 'An error occurred');
      }
    }
  };

  return (
    <section className="px-5 py-10 xl:px-0">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Medicines List</h2>

        {loading ? (
          <p>Loading medicines...</p>
        ) : medicines.length === 0 ? (
          <p className="text-gray-500">No medicines found.</p>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Medicine Name</th>
                <th className="py-2 px-4 border-b">Company</th>
                <th className="py-2 px-4 border-b">Dosage</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((medicine) => (
                <tr key={medicine.MedicineID}>
                  <td className="py-2 px-4 border-b">{medicine.MedicineName}</td>
                  <td className="py-2 px-4 border-b">{medicine.Company}</td>
                  <td className="py-2 px-4 border-b">{medicine.Dosage}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleDelete(medicine.MedicineID)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default DeleteMedicine;
