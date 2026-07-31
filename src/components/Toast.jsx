function Toast({ message, type = "success" }) {
    if (!message) return null;

    return (
        <div className={`toast toast-${type}`}>
            <span className="toast-icon">
                {type === "success" && "✔"}
                {type === "error" && "✖"}
                {type === "warning" && "⚠"}
                {type === "info" && "ℹ"}
            </span>

            <span>{message}</span>
        </div>
    );
}

export default Toast;