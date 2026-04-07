import { useEffect, useState } from "react";
import Gantt from "frappe-gantt";
import "frappe-gantt/dist/frappe-gantt.css";
import toast from "react-hot-toast";

import {
  getProjects,
  createProject as createProjectAPI,
  addMember as addMemberAPI,
  addTask as addTaskAPI,
} from "../services/planningService";

import planningApi from "../api/planningApi";

const Planning = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const [projectName, setProjectName] = useState("");
  const [member, setMember] = useState({ name: "", role: "" });
  const [task, setTask] = useState({
    title: "",
    startDate: "",
    endDate: "",
    memberId: "",
  });

  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // LOAD PROJECTS
  const refresh = async () => {
    setLoading(true);
    try {
      const res = await getProjects();
      setProjects(res.data);
      console.log("Projects loaded:", res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  // SELECT PROJECT
  const loadProject = (project) => {
    console.log("Selected project:", project);
    setSelectedProject(project);
  };

  // GANTT CHART
  useEffect(() => {
    if (!selectedProject) return;

    const container = document.getElementById("gantt");
    if (!container) return;

    container.innerHTML = "";

    const tasks = (selectedProject.tasks || []).map((t) => ({
      id: t.id,
      name: t.title,
      start: t.startDate,
      end: t.endDate,
      progress: t.status === "Done" ? 100 : 40,
    }));

    if (tasks.length > 0) {
      const gantt = new Gantt("#gantt", tasks);
      return () => {
        // Optional: cleanup if needed
        container.innerHTML = "";
      };
    }
  }, [selectedProject]);

  // CREATE PROJECT
  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      toast.error("Enter project name");
      return;
    }

    try {
      await createProjectAPI({ name: projectName });
      setProjectName("");
      await refresh();
      toast.success("Project created");
    } catch (err) {
      console.error("Create error:", err);
      toast.error("Failed to create project");
    }
  };

  // DELETE PROJECT
  const deleteProject = async (id) => {
    if (!window.confirm("Delete project?")) return;

    try {
      await planningApi.delete(`/api/planning/project/${id}`);
      setSelectedProject(null);
      await refresh();
      toast.success("Project deleted");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete project");
    }
  };

  // ADD MEMBER
  const handleAddMember = async () => {
    const name = member.name.trim();
    const role = member.role.trim();

    if (!name || !role) {
      toast.error("Enter member name and role");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await addMemberAPI(selectedProject.id, { name, role });
      setMember({ name: "", role: "" });

      const res = await getProjects();
      setProjects(res.data);

      const updated = res.data.find((p) => p.id === selectedProject.id);
      setSelectedProject(updated);

      toast.success("Member added");
    } catch (err) {
      console.error("Add member error:", err);
      toast.error("Failed to add member");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ADD TASK
  const handleAddTask = async () => {
    if (!selectedProject) return;

    if (!task.title.trim()) {
      toast.error("Enter task title");
      return;
    }

    if (!task.startDate || !task.endDate) {
      toast.error("Select start and end date");
      return;
    }

    if (!task.memberId) {
      toast.error("Select a member");
      return;
    }

    try {
      await addTaskAPI(selectedProject.id, {
        title: task.title.trim(),
        startDate: task.startDate,
        endDate: task.endDate,
        memberId: Number(task.memberId),
      });

      toast.success("Task added successfully");

      setTask({
        title: "",
        startDate: "",
        endDate: "",
        memberId: "",
      });

      const res = await getProjects();
      setProjects(res.data);

      const updated = res.data.find((p) => p.id === selectedProject.id);
      setSelectedProject(updated);
    } catch (err) {
      console.error("Add task error:", err);
      toast.error("Failed to add task");
    }
  };

  // STATS
  const totalTasks = selectedProject?.tasks?.length || 0;
  const totalMembers = selectedProject?.members?.length || 0;
  const completed =
    selectedProject?.tasks?.filter((t) => t.status === "Done").length || 0;
  const progress = totalTasks ? Math.round((completed / totalTasks) * 100) : 0;

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Planning</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT PANEL */}
        <div className="bg-[var(--card-bg)] p-5 rounded-xl shadow-custom">
          <h2 className="font-semibold mb-4">Projects</h2>

          <div className="flex gap-2 mb-4">
            <input
              placeholder="New Project"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="p-2 flex-1 bg-[var(--secondary-bg)] rounded border border-[var(--border-color)]"
            />
            <button
              type="button"
              onClick={handleCreateProject}
              className="bg-[var(--accent-color)] px-3 rounded text-white"
            >
              +
            </button>
          </div>

          {loading ? (
            <div className="text-center p-2">Loading projects...</div>
          ) : (
            projects.map((p) => (
              <div key={p.id} className="flex items-center justify-between mb-2">
                <button
                  onClick={() => loadProject(p)}
                  className={`flex-1 text-left px-3 py-2 rounded transition ${
                    selectedProject?.id === p.id
                      ? "bg-[var(--accent-color)] text-white"
                      : "hover:bg-[var(--secondary-bg)]"
                  }`}
                >
                  {p.name}
                </button>

                <button
                  className="ml-2 text-red-400 hover:text-red-600"
                  onClick={() => deleteProject(p.id)}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="md:col-span-2 space-y-6">
          {!selectedProject ? (
            <div className="bg-[var(--card-bg)] p-6 rounded-xl text-center">
              Select a project to manage planning
            </div>
          ) : (
            <>
              {/* STATS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[var(--card-bg)] p-4 rounded-xl">
                  <p className="text-sm text-[var(--text-secondary)]">Tasks</p>
                  <p className="text-2xl font-bold">{totalTasks}</p>
                </div>

                <div className="bg-[var(--card-bg)] p-4 rounded-xl">
                  <p className="text-sm text-[var(--text-secondary)]">Members</p>
                  <p className="text-2xl font-bold">{totalMembers}</p>
                </div>

                <div className="bg-[var(--card-bg)] p-4 rounded-xl">
                  <p className="text-sm text-[var(--text-secondary)]">Completed</p>
                  <p className="text-2xl font-bold text-green-500">{completed}</p>
                </div>

                <div className="bg-[var(--card-bg)] p-4 rounded-xl">
                  <p className="text-sm text-[var(--text-secondary)]">Progress</p>
                  <p className="text-2xl font-bold">{progress}%</p>
                </div>
              </div>

              {/* DELETE BUTTON */}
              <div className="flex justify-end">
                <button
                  className="bg-red-500 px-4 py-2 rounded text-white"
                  onClick={() => deleteProject(selectedProject.id)}
                >
                  Delete Project
                </button>
              </div>

              {/* ADD MEMBER */}
              <div className="bg-[var(--card-bg)] p-5 rounded-xl">
                <h3 className="font-semibold mb-3">Add Member</h3>
                <div className="flex gap-2">
                  <input
                    placeholder="Name"
                    className="p-2 bg-[var(--secondary-bg)] rounded"
                    value={member.name}
                    onChange={(e) => setMember({ ...member, name: e.target.value })}
                  />
                  <input
                    placeholder="Role"
                    className="p-2 bg-[var(--secondary-bg)] rounded"
                    value={member.role}
                    onChange={(e) => setMember({ ...member, role: e.target.value })}
                  />
                  <button
                    onClick={handleAddMember}
                    className="bg-green-500 px-3 rounded text-white"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* ADD TASK */}
              <div className="bg-[var(--card-bg)] p-5 rounded-xl">
                <h3 className="font-semibold mb-3">Add Task</h3>
                <div className="flex gap-2 flex-wrap">
                  <input
                    placeholder="Title"
                    className="p-2 bg-[var(--secondary-bg)] rounded"
                    value={task.title}
                    onChange={(e) => setTask({ ...task, title: e.target.value })}
                  />
                  <input
                    type="date"
                    className="p-2 bg-[var(--secondary-bg)] rounded"
                    value={task.startDate}
                    onChange={(e) => setTask({ ...task, startDate: e.target.value })}
                  />
                  <input
                    type="date"
                    className="p-2 bg-[var(--secondary-bg)] rounded"
                    value={task.endDate}
                    onChange={(e) => setTask({ ...task, endDate: e.target.value })}
                  />
                  <select
                    className="p-2 bg-[var(--secondary-bg)] rounded"
                    value={task.memberId}
                    onChange={(e) => setTask({ ...task, memberId: Number(e.target.value) })}
                  >
                    <option value="">Select Member</option>
                    {selectedProject.members?.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAddTask}
                    className="bg-purple-500 px-3 rounded text-white"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* GANTT */}
              <div className="bg-[var(--card-bg)] p-5 rounded-xl overflow-x-auto">
                <h3 className="font-semibold mb-3">Timeline</h3>
                <div id="gantt" className="min-w-[600px]"></div>
              </div>

              {/* MEMBERS */}
              <div className="bg-[var(--card-bg)] p-5 rounded-xl">
                <h3 className="font-semibold mb-3">Members</h3>
                {selectedProject.members?.map((m) => (
                  <div key={m.id} className="flex justify-between py-2 border-b">
                    <span>{m.name}</span>
                    <span>{m.role}</span>
                  </div>
                ))}
              </div>

              {/* TASKS */}
              <div className="bg-[var(--card-bg)] p-5 rounded-xl">
                <h3 className="font-semibold mb-3">Tasks</h3>
                {selectedProject.tasks?.map((t) => (
                  <div key={t.id} className="flex justify-between py-2 border-b">
                    <span>{t.title}</span>
                    <span>{t.status}</span>
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

export default Planning;