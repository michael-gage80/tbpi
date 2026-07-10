import { PageHeading } from "@/components/staff/ui/page-heading";
import { WebsiteCard, SearchCard, GithubCard, LinkedInCard } from "@/components/staff/analytics/cards";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function AnalyticsPage() {
  return (
    <div>
      <PageHeading title="Analytics" subtitle="Headline org metrics — website, search, code and social." />
      <div className="grid gap-5 md:grid-cols-2">
        <WebsiteCard />
        <SearchCard />
        <GithubCard />
        <LinkedInCard />
      </div>
    </div>
  );
}
