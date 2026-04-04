import { withAdminPage } from "@/components/admin/auth-hoc";
import { findTweetedTools } from "@/server/admin/tweets/queries";
import { TweetGenerator } from "./_components/tweet-generator";
import { TweetedToolsTable } from "./_components/tweeted-tools-table";

const TweetPage = async () => {
  const tweetedTools = await findTweetedTools({ take: 50 });

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Tweet</h1>
        <p className="text-sm text-muted-foreground">Generate 3 tweet cards ready for scheduling on X/Threads.</p>
      </div>

      <TweetGenerator />

      <TweetedToolsTable tools={tweetedTools} />
    </div>
  );
};

export default withAdminPage(TweetPage);
