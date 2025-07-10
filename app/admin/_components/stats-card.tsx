import Link from "next/link";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { H2 } from "@/components/ui/heading";

export const StatsCard = () => {
  const stats = [
    { label: "Tools", href: "/admin/tools", count: 1247 },
    { label: "Alternatives", href: "/admin/alternatives", count: 892 },
    { label: "Categories", href: "/admin/categories", count: 56 },
    { label: "Users", href: "/admin/users", count: 12453 },
  ] as const;

  return (
    <>
      {stats.map((stat) => (
        <Card key={stat.label} asChild>
          <Link href={stat.href}>
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <H2>{stat.count.toLocaleString()}</H2>
            </CardHeader>
          </Link>
        </Card>
      ))}
    </>
  );
};
