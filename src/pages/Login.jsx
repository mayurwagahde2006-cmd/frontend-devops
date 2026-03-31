const Login = () => {
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/login/oauth2/authorization/github`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--primary-bg)]">
      <div className="bg-[var(--card-bg)] p-10 rounded-2xl shadow-custom text-center max-w-md">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-color-light)] rounded-2xl flex items-center justify-center text-4xl mb-6 animate-pulse-slow">
          <i className="fas fa-robot text-white"></i>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-color-light)] bg-clip-text text-transparent mb-2">OPERA</h1>
        <p className="text-[var(--text-secondary)] mb-8">DevOps Assistant – Automate your CI/CD pipelines with ease.</p>
        <button
          onClick={handleLogin}
          className="w-full bg-[var(--accent-color)] text-white py-3 rounded-xl font-semibold hover:bg-[var(--accent-color-dark)] transition-colors flex items-center justify-center gap-2"
        >
          <i className="fab fa-github"></i> Login with GitHub
        </button>
      </div>
    </div>
  );
};

export default Login;