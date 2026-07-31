export const showToast = (
    setToast,
    message,
    type = "success"
) => {
    setToast({ message, type });

    setTimeout(() => {
        setToast({
            message: "",
            type: "success",
        });
    }, 2000);
};