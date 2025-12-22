import { useNavigate } from "react-router-dom";

function PageNotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-4">
            <h1 className="text-7xl font-bold text-secondary mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-primary mb-2">
                Page Not Found
            </h2>
            <p className="text-muted mb-6">
                Sorry, the page you’re looking for doesn’t exist.
            </p>

            <button
                onClick={() => navigate("/")}
                className="bg-secondary text-white px-6 py-3 rounded-xl font-semibold hover:bg-accent transition"
            >
                Go back Home
            </button>
        </div>
    );
}

export default PageNotFound;
