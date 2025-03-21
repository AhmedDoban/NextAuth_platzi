import { toast, ToastContent, ToastOptions } from "react-toastify";

export const defaultToastOptions: ToastOptions = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
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
      break;
    case "error":
      toast.error(content, optionsToApply);
      break;
    case "info":
      toast.info(content, optionsToApply);
      break;
    case "warning":
      toast.warn(content, optionsToApply);
      break;
    case "default":
      toast(content, optionsToApply);
      break;
    default:
      toast(content, optionsToApply);
      break;
  }
};

export default ShowToast;
