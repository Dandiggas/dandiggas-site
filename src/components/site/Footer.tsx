import Link from "next/link";
import { LINKS } from "@/lib/links";
import { LinkedInIcon, MailIcon, NowIcon, RssIcon, XIcon } from "./icons";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap cols">
        <div>
          <Link className="brand" href="/">
            Dan Diggas
          </Link>
          <p className="line">
            Keys for the room and the record. Agent systems that have to show their work. London.
          </p>
        </div>
        <div>
          <h4>Tech</h4>
          <ul>
            <li><Link href="/tech">Writing</Link></li>
            <li><Link href="/tech#projects">Projects</Link></li>
            <li><Link href="/brim">Brim</Link></li>
          </ul>
        </div>
        <div>
          <h4>Music</h4>
          <ul>
            <li><Link href="/music#credits">Credits</Link></li>
            <li><Link href="/music#live">Live sets</Link></li>
            <li><Link href="/music#bookings">Bookings</Link></li>
          </ul>
        </div>
        <div>
          <h4>Follow</h4>
          <ul className="follow-list">
            <li><a href={LINKS.rss}><RssIcon />RSS</a></li>
            <li><Link href={LINKS.subscribe}><MailIcon />Email, one per post</Link></li>
            <li><a href={LINKS.x} {...ext}><XIcon />X <span className="h">{LINKS.xHandle}</span></a></li>
            <li><a href={LINKS.linkedin} {...ext}><LinkedInIcon />LinkedIn</a></li>
            <li><Link href={LINKS.now}><NowIcon />Now</Link></li>
          </ul>
        </div>
        <div>
          <h4>Elsewhere</h4>
          <ul>
            <li><a href={LINKS.github} {...ext}>GitHub</a></li>
            <li><a href={LINKS.tiktok} {...ext}>TikTok</a></li>
            <li><a href={LINKS.instagram} {...ext}>Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className="bottom">
        <div className="wrap">
          <span>© {new Date().getFullYear()} Dan Diggas</span>
          <span>Keys open doors</span>
        </div>
      </div>
    </footer>
  );
}
