import { FollowRow } from "@/components/site/FollowRow";
import { Subscribe } from "@/components/site/Subscribe";

/** The "Keep up" box at the end of every post. */
export function KeepUp() {
  return (
    <section className="keep-box" aria-label="Keep up">
      <div>
        <h3 className="h3">Keep up</h3>
        <p className="small">A post most weeks, each one measured on my own agents.</p>
        <FollowRow items={["rss", "x", "linkedin", "now"]} />
      </div>
      <Subscribe note="One email per post, most weeks. Nothing else, ever." />
    </section>
  );
}
