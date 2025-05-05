import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../config';

const GenerateReport = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [reportDesc, setReportDesc] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/doctors/tests/${user?.UserID}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setTests(data.tests);
      } catch (err) {
        toast.error('Failed to load tests');
      }
    };

    fetchTests();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/api/doctors/generate-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        userId: user?.UserID,
          patientId: selectedTest.PatientID,
          date: selectedTest.Date,
          time: selectedTest.Time,
          description: reportDesc,
          testId: selectedTest.TestID
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      toast.success('Report generated successfully');
      setSelectedTest(null);
      setReportDesc('');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <section className="p-5 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-primaryColor">Generate Report</h2>

      <ul className="mb-6">
        {tests.map(test => (
          <li key={`${test.PatientID}-${test.Date}-${test.Time}`} className="mb-2">
            <button
              onClick={() => setSelectedTest(test)}
              className="text-left w-full px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              Test: {test.TestName} | Patient: {test.PatientID} | {test.Date} {test.Time}
            </button>
          </li>
        ))}
      </ul>

      {selectedTest && (
        <form onSubmit={handleSubmit} className="grid gap-4">
          <textarea
            placeholder="Write report description..."
            value={reportDesc}
            onChange={(e) => setReportDesc(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-primaryColor text-white rounded hover:bg-primaryColorDark transition"
          >
            Submit Report
          </button>
        </form>
      )}
    </section>
  );
};

export default GenerateReport;
