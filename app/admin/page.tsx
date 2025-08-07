import { AnalyticsCard } from "./_components/analytics-card";
import { StatsCard } from "./_components/stats-card";
import { SubscribersCard } from "./_components/subscribers-card";
import { UsersCard } from "./_components/users-card";
// import { withAdminPage } from "@/components/admin/auth-hoc";
import { H3 } from "@/components/ui/heading";

const DashboardPage = () => {
  return (
    <>
      <H3>Dashboard</H3>

      <div className="grid gap-4 items-start lg:grid-cols-5">
        <div className="grid gap-4 lg:col-span-3">
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <StatsCard />
          </div>
          
        </div>

        <div className="grid gap-4 lg:col-span-2">
          <AnalyticsCard />
          <SubscribersCard />
          <UsersCard />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
// export default withAdminPage(DashboardPage);
