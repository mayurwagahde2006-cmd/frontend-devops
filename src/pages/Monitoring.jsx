import { useState, useEffect } from "react";
import api from "../api";

const Monitoring = ({ repoId }) => {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRuns = async () => {
      try {
        const res = await api.get(`/ci-monitor/${repoId}`);
        setRuns(res.data);
      } catch (err) {
        console.error("Error fetching CI status", err);
      } finally {
        setLoading(false);
      }
    };

    if (repoId) {
      fetchRuns();
    }
  }, [repoId]);

  if (loading) {
    return <p className="text-lg">Loading CI/CD Status...</p>;
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">CI/CD Monitoring</h1>

      <div className="bg-[var(--card-bg)] rounded-xl p-6 shadow-custom">
        <h3 className="text-xl font-semibold mb-4">Workflow Runs</h3>

        {runs.length === 0 ? (
          <p>No workflow runs found.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-color)]">
                <th className="p-2">Commit</th>
                <th className="p-2">Branch</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>

            <tbody>
              {runs.map((run, index) => (
                <tr key={index} className="border-b border-[var(--border-color)]">
                  <td className="p-2 font-mono">{run.commit?.slice(0, 7)}</td>

                  <td className="p-2">{run.branch}</td>

                  <td className="p-2">
                    <span
                      className={`px-3 py-1 rounded text-white text-sm ${
                        run.status === "SUCCESS"
                          ? "bg-green-500"
                          : run.status === "FAILED"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {run.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default Monitoring;