import { FollowRow } from "./FollowRow";
import { Subscribe } from "./Subscribe";
import { Reveal } from "@/components/motion/Reveal";

/** The "Keep up" band before the footer on /tech and /now. */
export function KeepUpBand() {
  return (
    <Reveal as="section" className="keep" id="subscribe" aria-label="Keep up">
      <div className="wrap">
        <div>
          <p className="eyebrow">Keep up</p>
          <h3>A post most weeks, each one measured on my own agents.</h3>
          <p className="small">Pick whichever you already read. The feed and the email carry the same posts, nothing extra.</p>
          <FollowRow items={["rssFeed", "x", "linkedin", "github"]} />
        </div>
        <Subscribe note="One email per post. Unsubscribe is one click, and it works." />
      </div>
    </Reveal>
  );
}
