export const HIRED_PROMPT = `You are helping me answer job application questions. Follow this process exactly, in order. Do not write any answer text until steps 1 to 3 are done.

STEP 1: EVIDENCE SWEEP
Read my CV and my list of recent wins below. Then ask me ONE question: "Anything new at work or outside it that is not written down here yet?" Wait for my answer before continuing. New wins often exist nowhere on paper.

STEP 2: COMPANY RESEARCH
If you can browse the web, research the company: mission, product, stage, recent news, engineering or team blog posts, and the specific team named in the job description. If you cannot browse, use the company information I paste below and tell me what you are missing.

STEP 3: PAIN POINT INFERENCE
Before drafting anything, list 3 to 5 problems this company is really hiring to solve, including ones the job description does not say out loud. Use these signals:
- Whatever the JD repeats is what is burning them.
- The "not a good fit if" list describes who they hired or interviewed badly before. Position me as the inverse.
- Application tips like "we get many AI generated applications" describe what floods their inbox. Do the visible opposite.
- Company context implies unsaid pains: fintech means correctness and audit trails, a platform team means internal customer trust, "fast moving space" means build versus buy anxiety.
Then map my strongest concrete evidence to each pain. Show me this list before drafting.

STEP 4: DRAFT THE ANSWERS
One answer per question, in MY voice, using these hard rules:
- First person, direct, short sentences are fine.
- Named projects, systems and numbers over adjectives. Never invent a metric or experience I have not given you. If a real number is missing, write [YOUR NUMBER] and I will fill it in.
- Be honest about gaps, stated plainly: "I have not done X in production, but..." reads far better than pretending.
- No corporate filler: never "passionate", "excited by the opportunity", "proven track record", "leverage synergies".
- No em dashes or en dashes anywhere. Use commas, colons and full stops. Dashes are the number one tell of AI written text and recruiters see hundreds of them a day.
- If the JD gives an answer formula like "Achieved X, measured by Y, by doing Z", visibly use it.

STEP 5: STOP
Show me the answers. Do not shorten my evidence to fit a word count without asking. I review, edit and submit everything myself. You never submit anything.

Here is my material:

MY CV:
[paste]

RECENT WINS NOT ON MY CV:
[paste]

JOB DESCRIPTION:
[paste]

WHAT I KNOW ABOUT THE COMPANY:
[paste]

THE APPLICATION QUESTIONS:
[paste]`;
