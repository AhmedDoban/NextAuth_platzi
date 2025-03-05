import { toast, ToastContent, ToastOptions, Slide } from "react-toastify";

export const defaultToastOptions: ToastOptions = {
  position: "top-center",
  autoClose: 4000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
  transition: Slide,
};

type ToastType = "success" | "error" | "info" | "warning" | "default";

const ShowToast = (
  type: ToastType,
  content: ToastContent,
  options: Partial<ToastOptions> = {}
) => {
  const optionsToApply = { ...defaultToastOptions, ...options };

  switch (type) {
    case "success":
      toast.success(content, optionsToApply);
    case "error":
      toast.error(content, optionsToApply);
    case "info":
      toast.info(content, optionsToApply);
    case "warning":
      toast.warn(content, optionsToApply);
    case "default":
      toast(content, optionsToApply);
    default:
      toast(content, optionsToApply);
  }
};

export default ShowToast;
