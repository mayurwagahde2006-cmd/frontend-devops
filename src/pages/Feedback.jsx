import { useState } from "react";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";


const Feedback = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);

    try {
      await emailjs.send(
        "service_ybz31bw",
        "template_hq4y71x",
        {
          name: form.name,
          email: form.email,
          message: form.message,
          time: new Date().toLocaleString(),
        },
        "6zrZ8-Pl5r_z7k9i6"
      );

      toast.success(" Feedback sent successfully!");
      setForm({ name: "", email: "", message: "" });

    } catch (error) {
      console.error("Email error:", error);
      toast.error("Failed to send feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-header mb-8">
        <h1 className="page-title text-3xl font-bold bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-color-light)] bg-clip-text text-transparent">
          Feedback
        </h1>
      </div>

      <div className="max-w-2xl">
        <div className="bg-[var(--card-bg)] rounded-xl p-6 shadow-custom border border-[var(--border-color)]">

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="text-sm text-[var(--text-secondary)] mb-1 block">
                Your Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="w-full p-3 bg-[var(--secondary-bg)] rounded-lg border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
              />
            </div>

            <div>
              <label className="text-sm text-[var(--text-secondary)] mb-1 block">
                Your Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="w-full p-3 bg-[var(--secondary-bg)] rounded-lg border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
              />
            </div>

            <div>
              <label className="text-sm text-[var(--text-secondary)] mb-1 block">
                Feedback Message
              </label>
              <textarea
                rows="5"
                placeholder="Write your feedback..."
                value={form.message}
                onChange={(e) =>
                  setForm({ ...form, message: e.target.value })
                }
                className="w-full p-3 bg-[var(--secondary-bg)] rounded-lg border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--accent-color)] text-white py-3 rounded-lg font-semibold hover:bg-[var(--accent-color-dark)] transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner animate-spin"></i>
                  Sending...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i>
                  Submit Feedback
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </>
  );
};

export default Feedback;