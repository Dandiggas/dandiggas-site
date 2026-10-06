---
title: "My Test Passed Because the Answer Was in the Test"
date: "2026-10-06"
preview: "An AI feature I was about to ship scored 60% on its first test. The test songs had a metronome in them. Three tests later the real answer was sitting inside the files all along. This is how I check what my agents build."
readTime: "6 min read"
video: "/blog/brim-demo.mp4"
videoPoster: "/blog/brim-demo-poster.jpg"
videoCaption: "Brim in 13 seconds: a made-up delivery called Night Bus goes in, the tempo is typed, and a named Ableton session comes out."
---

My AI feature scored 60% on its first test. Then I found out the test data had the answer in it.

This is the story of that feature, the three tests it took to see it clearly, and the rules I now give the agents that write most of my code.

## What I'm building

Brim is a Mac app for musicians. When someone sends you a song to work on, it usually arrives as a folder of separate audio files, one per instrument (stems). Before you can play a note, you open your music software, make a new project, drag every file in, name the tracks, set the speed and save it. Brim does that part. You drop the folder in, and a ready project comes out in Ableton, Logic, FL Studio or Pro Tools.

![Brim after preparing a made-up delivery called Night Bus: 7 tracks, ready to open in Ableton](/blog/brim-app-prepared.png)

![The session Brim built in Ableton: every file on its own named track, lined up from bar 1](/brim/session-ableton.png)

My agents write most of Brim's code. My job is deciding what counts as proof that it works.

## The feature that looked easy

One step looked made for a model: working out how fast the song is (its tempo, in beats per minute). Brim needs it so the project's grid lines up with the music. Musicians type it in today, and a box that fills itself in felt like an obvious win.

There are good open-source tools that estimate tempo from audio (I used librosa, a Python audio library). I added a trick on top. Files bounced from the same song usually end exactly on a bar line, and only a few tempos make that true, so a rough estimate can be snapped to an exact one.

I tested it on five of my own songs where I knew the right answer. It got three right. 60%, and the right ones were exact. Good enough to build on.

## Why the first test lied

Then I looked at what was actually in those five folders.

![My test songs had a metronome track in every folder. Real deliveries don't.](/blog/tempo-eval-leak.png)

Every one of them came from my own recording sessions, and every folder had a metronome track in it (a click track), plus a track of spoken cues. The detector wasn't finding the beat in the music. It was reading the metronome, which is the answer printed in the input. In machine learning this is called data leakage, and it is the oldest trap in evaluation. I walked straight into it because the test set was whatever I had to hand.

Nobody sends a metronome with their song. So the 60% measured a situation that never happens.

## Test 2: real material

I built a fairer test from 33 of my own projects, 169 audio files in all, taking the true tempo from inside each project file rather than from my memory or a file name. This is the real output:

```
  truth  perstem      mix  snapped  candidates
     89.00    89.10    89.10    90.01  [90.01, 88.86, 91.17]
    127.00   258.40   258.40     none  []
ok  109.00   112.35   107.67   109.00  [109.0, 107.05, 110.95]
    140.00   103.36   107.67   104.88  [104.88, 108.76, 112.65]
ok  140.00   112.35   136.00   140.00  [140.0, 134.17, 128.33]
    ...

=== 33 songs, all Dan's own projects ===
  librosa per stem (median)            3/33  (9%)
  librosa on summed stems              5/33  (15%)
  snapped to whole bars                6/33  (18%)
  truth within 3 candidates            8/33  (24%)
```

"truth" is the real tempo. The next three columns are three ways of guessing it, and "ok" marks a row where the best one got it exactly right. Six out of 33. The feature I nearly shipped was wrong more than four times in five, and some of the misses were not even close (258 for a song at 127).

## Test 3: checking the check

I nearly stopped there with a clean "don't ship it". But a verdict built on a test set deserves the same suspicion as the feature, so I went back and asked whether those 33 songs looked like what Brim will actually receive.

Most of them didn't. 22 of the 33 were cut-down recordings, files that start and stop wherever a recording happened to, rather than full-length bounces of the whole song. My snapping trick needs full-length files, so on those 22 it could never work.

![Three tests of the same feature, each one fairer than the last](/blog/tempo-eval-scores.png)

On the 11 full-length songs the method got 6 right (55%). On the 22 cut-down ones, 0. So "18%, don't ship" was mostly a measurement of material the method was never meant for.

## The answer was in the files all along

While all this was going on I was preparing a real show, and the singer's delivery came in. I looked inside the files themselves. Logic, the software it was made in, had written the tempo into every one of them: "Tempo: 89.0", on all 17 files.

The tempo I had been testing with for that song was 92. It was wrong.

So the best tempo detector for this delivery was not a model at all. It was what the sender's software had already written down. Even that isn't safe to trust blindly: other files I checked carried 120, which is just Logic's default when nobody sets a tempo.

So Brim still asks you to type the tempo, and that was my call after seeing all three tests. A box that fills itself in wrongly most of the time costs more trust than it saves.

## The rules my agents work to

This is the part that carries over to any AI work, and it's how I run every project now.

**1. Reproduce it first, the way a user hits it.** No fix starts from a guess. This morning a folder called "Night Bus stems" made a project called "Night Bus stems" with tracks named "Night Bus - Kick". The agent reproduced it end to end, wrote four tests that failed for the right reason, then fixed it. Only then did the new build go out.

**2. Test on real material.** Brim's rules for working out which file belongs to which song were checked against 2,487 real files from real deliveries, not ones I made up. A test set you invented mostly tests your imagination.

**3. Done means seen.** "Tests pass" is a claim. A project open on screen, in every music app Brim supports, is evidence. A release isn't finished until the check runs on the copy inside the download, not the copy on my machine.

**4. Check the check.** Every number above changed at least once. The tests deserve the same suspicion as the thing they test.

None of this is new. It's what good engineers have always done. What's new is how fast agents produce code, which makes deciding what counts as proof the job.

Brim went to its first outside tester this week. [Here's what it does](/brim).
