import { redirect } from "next/navigation";

function notFound() {
  return redirect(`/en`);
}
export default notFound;
