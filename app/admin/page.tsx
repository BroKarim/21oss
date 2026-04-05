import { redirect } from "next/navigation";

const DashboardPage = () => {
  redirect("/admin/tools");
};

export default DashboardPage;
