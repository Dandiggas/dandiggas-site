---
title: "What Broke When I Tried to Use My Own Practice App"
date: "2026-06-03"
preview: "The Musician's Practice App is not public yet. This is a build note from getting it ready for early testing by using it like an actual musician, not a feature checklist."
readTime: "5 min read"
---

The Musician's Practice App is not public yet. This is a build note from getting it ready for early testing.

I changed how I want to build it.

Instead of treating it like a list of features, I used it the way I actually would as a keyboard player. I opened the app, tried to run a real practice session, and paid attention to every moment where the product got in the way.

That became the workflow.

I was not writing imaginary user stories. I was trying to practise. When something broke, the bug report was simple:

> I am trying to add a track and it says every field is required.

Or:

> I am trying to move around in a YouTube track and I cannot choose the section I want.

That made the work sharper.

## What broke first

The day started with a repo and deployment shift. The version I was actually using became the main project, got pushed to main, and went up on Railway so I could use the real app online.

Then I started practising with it.

The first problem was session creation. The frontend looked like it was sending a valid request, but production came back with 400 errors saying required fields were missing.

That led to the real issue: the Next.js proxy route between the frontend and Django was not reliably preserving request bodies. JSON writes were getting dropped or malformed before they reached the backend.

We fixed that and added regression tests.

Then the same kind of bug appeared when adding tracks. I filled in the form, but Django still responded as if every field was missing.

This time the payload was multipart FormData, because tracks can include YouTube links and uploaded files. The proxy was handling multipart requests differently, streaming the raw body instead of materialising it before forwarding.

So we fixed that too.

The important question after that was:

> Did we just fix the thing I complained about, or did we protect the whole app?

That pushed the work beyond one bug. We added regression coverage around the frontend write helpers: sessions, tracks, licks, takes, deletes, reorders, JSON payloads, and FormData payloads.

The goal was not just to make Add Track work once. It was to stop the whole category of "the UI sent it but the backend says the fields are missing" bugs from coming back.

## The YouTube problem

The next blocker was YouTube practice.

I added a YouTube track and tried to scrub around to choose a section. It did not work. The timeline stayed stuck at 0:00, the scrubber snapped back, and Set In / Set Out could not capture useful timestamps.

That broke the core workflow.

If I cannot choose a section of music, set in and out points, and loop a lick, then the app is not helping me practise. It is just a UI with good intentions.

The root cause was in the YouTube transport hook. The app was not polling the YouTube iframe after the player became ready, so the internal timeline never moved.

We fixed the transport so polling starts when the player is ready, and seeking updates the UI immediately. Then we added tests for both behaviours.

## Product decisions from actual use

There was also a smaller UI decision that would have been easy to miss from the code alone.

The Add Track button needed to live underneath the Tracks panel. That is where I expected it while using the session screen. It sounds obvious, but it only became obvious when I was actually sitting there trying to practise.

That is the point.

Some product decisions do not reveal themselves in a feature list. They show up when the interface interrupts you.

## The loop I want to keep

This is the workflow I want for the app now:

1. Use the product as a musician.
2. Notice where it blocks the practice session.
3. Fix the blocker.
4. Add regression coverage for the whole category of bug.
5. Deploy it.
6. Try to practise again.

Done does not mean "the code compiles."

Done means:

- the bug is fixed;
- the fix is tested;
- related bugs are covered;
- the build passes;
- CI passes;
- the deployed app is ready to use again.

That is a much better loop than guessing.

## The principle

Use the product as the person it is for, then build from the roadblocks.

For this app, I am not only the developer or the product owner. I am the keyboard player trying to get better.

The app either helps me practise, or it gets in the way.

When it gets in the way, that is the next task.
