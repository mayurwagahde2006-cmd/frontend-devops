import { useState, useEffect } from "react";
import api from "../api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const Monitoring = () => {
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [runs, setRuns] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load repos
  useEffect(() => {
    api.get("/repos/imported")
      .then(res => setRepos(res.data))
      .catch(err => console.error(err));
  }, []);

  //  Load monitoring data
  const loadMonitoring = async (repo) => {
  setSelectedRepo(repo);
  setLoading(true);

  try {
    const res = await api.get(`/ci-monitor/${repo.githubRepoId}`);

    const data = [...res.data.workflowRuns].reverse();
    setRuns(data);

    //  GRAPH DATA PROCESSING
    const grouped = {};
    data.forEach(run => {
      if (!run.date) return;

      const date = new Date(run.date).toLocaleDateString();

      if (!grouped[date]) grouped[date] = { date, success: 0, failed: 0 };

      if (run.status === "SUCCESS") grouped[date].success++;
      else grouped[date].failed++;
    });

    setChartData(Object.values(grouped));

  } catch (err) {
    console.error("Error fetching monitoring", err);
  } finally {
    setLoading(false);
  }
};

  //  CALCULATIONS
  const totalRuns = runs.length;
  const success = runs.filter(r => r.status === "SUCCESS").length;
  const failed = runs.filter(r => r.status === "FAILED").length;

  const successRate = totalRuns
    ? ((success / totalRuns) * 100).toFixed(1)
    : 0;

  //  HEALTH STATUS
  let health = "Healthy";
  let healthColor = "text-green-500";

  if (successRate < 60) {
    health = "Critical";
    healthColor = "text-red-500";
  } else if (successRate < 90) {
    health = "Unstable";
    healthColor = "text-yellow-500";
  }

  //  LAST BUILD
  const lastBuild = runs[0];

  //  FAILURE ALERT
  const last3 = runs.slice(0, 3);
  const showAlert =
    last3.length === 3 && last3.every(r => r.status === "FAILED");

  //  BRANCH STATS
  const branchStats = {};
  runs.forEach(r => {
    if (!branchStats[r.branch]) {
      branchStats[r.branch] = { success: 0, failed: 0 };
    }

    if (r.status === "SUCCESS") branchStats[r.branch].success++;
    else branchStats[r.branch].failed++;
  });

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Monitoring</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/*  LEFT: PROJECT LIST */}
        <div className="bg-[var(--card-bg)] p-5 rounded-xl shadow-custom">
          <h2 className="font-semibold mb-4">Projects</h2>

          {repos.map(repo => (
            <button
              key={repo.id}
              onClick={() => loadMonitoring(repo)}
              className={`block w-full text-left px-3 py-2 rounded mb-2 transition ${
                selectedRepo?.id === repo.id
                  ? "bg-[var(--accent-color)] text-white"
                  : "hover:bg-[var(--secondary-bg)]"
              }`}
            >
              {repo.repoName}
            </button>
          ))}
        </div>

        {/*  RIGHT: DASHBOARD */}
        <div className="md:col-span-2 space-y-6">

          {!selectedRepo ? (
            <div className="bg-[var(--card-bg)] p-6 rounded-xl text-center">
              Select a project to view monitoring 
            </div>
          ) : loading ? (
            <div className="bg-[var(--card-bg)] p-6 rounded-xl text-center">
              Loading monitoring...
            </div>
          ) : (
            <>
              {/*  STATS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                <div className="bg-[var(--card-bg)] p-4 rounded-xl">
                  <p className="text-sm text-[var(--text-secondary)]">Total Runs</p>
                  <p className="text-2xl font-bold">{totalRuns}</p>
                </div>

                <div className="bg-[var(--card-bg)] p-4 rounded-xl">
                  <p className="text-sm text-[var(--text-secondary)]">Success</p>
                  <p className="text-2xl font-bold text-green-500">{success}</p>
                </div>

                <div className="bg-[var(--card-bg)] p-4 rounded-xl">
                  <p className="text-sm text-[var(--text-secondary)]">Failed</p>
                  <p className="text-2xl font-bold text-red-500">{failed}</p>
                </div>

                <div className="bg-[var(--card-bg)] p-4 rounded-xl">
                  <p className="text-sm text-[var(--text-secondary)]">Success Rate</p>
                  <p className="text-2xl font-bold">{successRate}%</p>
                </div>

              </div>

              {/*  HEALTH + LAST BUILD */}
              <div className="bg-[var(--card-bg)] p-5 rounded-xl flex justify-between items-center">
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">Health</p>
                  <p className={`text-xl font-bold ${healthColor}`}>
                    {health}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-[var(--text-secondary)]">Last Build</p>
                  <p className={`font-semibold ${
                    lastBuild?.status === "SUCCESS"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}>
                    {lastBuild?.status || "N/A"}
                  </p>
                </div>
              </div>

              {/*  ALERT */}
              {showAlert && (
                <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-xl">
                  ⚠ Warning: Last 3 builds failed
                </div>
              )}

              {/*  GRAPH */}
              <div className="bg-[var(--card-bg)] p-5 rounded-xl">
                <h3 className="font-semibold mb-4">Build Trend</h3>

                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="success" stroke="#10b981" />
                    <Line type="monotone" dataKey="failed" stroke="#ef4444" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/*  BRANCH STATS */}
              <div className="bg-[var(--card-bg)] p-5 rounded-xl">
                <h3 className="font-semibold mb-3">Branch Stats</h3>

                {Object.entries(branchStats).map(([branch, stats]) => (
                  <div key={branch} className="flex justify-between py-2 border-b border-[var(--border-color)]">
                    <span>{branch}</span>
                    <span className="text-green-500">{stats.success} ✔</span>
                    <span className="text-red-500">{stats.failed} ✖</span>
                  </div>
                ))}
              </div>

              {/*  RECENT RUNS */}
              <div className="bg-[var(--card-bg)] p-5 rounded-xl">
                <h3 className="font-semibold mb-3">Recent Runs</h3>

                {runs.slice(0, 5).map((run, i) => (
                  <div key={i} className="flex justify-between py-2 border-b border-[var(--border-color)]">
                    <span className="font-mono">{run.commit.slice(0, 7)}</span>
                    <span>{run.branch}</span>
                    <span className={
                      run.status === "SUCCESS"
                        ? "text-green-500"
                        : "text-red-500"
                    }>
                      {run.status}
                    </span>
                  </div>
                ))}
              </div>

            </>
          )}

        </div>
      </div>
    </>
  );
};

export default Monitoring;