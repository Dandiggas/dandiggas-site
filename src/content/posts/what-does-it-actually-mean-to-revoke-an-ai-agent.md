---
title: "What Does It Actually Mean to Revoke an AI Agent?"
date: "2026-10-29"
preview: "A talk at AI Security Night London asked how you revoke an AI agent. On the way home I kept asking: revoke what? The process, the keys, the work already running, or the damage already done?"
readTime: "7 min read"
---

Last night I went to AI Security Night at Snyk's London office. Hammed Ajibade, Lead Software Engineer at Pulse, gave a talk called "How Do You Revoke an AI Agent?"

One slide stuck with me. It was called "The same-user problem". You sign in as HAMMED@WORK. Your agent signs in as HAMMED@WORK. One user, to every system it touches. You can't narrow it, stop it or audit it without doing the same to you.

![Hammed Ajibade's "Your agent is you" slide at AI Security Night London.](/blog/agent-revocation/your-agent-is-you.jpg)

His talk got me thinking. On the way home I kept pulling at one word: revoke. What exactly are you revoking?

I build agent systems, and I wanted to check whether my own picture of this held up. Most of it did. Two parts didn't, and those are the parts worth writing about.

## An agent is still software

Take the word "agent" away and you usually have a program running a loop. Call the model, read the answer, call a tool, repeat.

That program runs somewhere. It signs in as someone. It holds keys. It starts work that other systems carry out.

So "revoke the agent" could point at any of those: the running program, its identity, its keys, or the work it has already started. Those are different problems with different answers.

## Stopping the program

My first answer was the plain one. If the agent is a Linux process, it has a process ID. You can send it SIGTERM, which asks it to stop and gives it a chance to clean up. Or you can send SIGKILL, which ends it. A process cannot catch, block or ignore SIGKILL ([Linux signal manual](https://man7.org/linux/man-pages/man7/signal.7.html)).

That is a real stop. But it stops one process, and an agent is not always one process. It might be an async task inside a bigger service, a step in a workflow engine, or several workers sharing a queue. Killing one process can leave the rest of the agent running.

## Kubernetes might bring it back

This was the first thing I hadn't accounted for.

If the agent runs on Kubernetes (the system that keeps containers running across a cluster of machines), a controller usually manages it. A Deployment, through a ReplicaSet, exists to keep a set number of copies running ([Kubernetes docs](https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/)).

Kill the process and the container may restart. Delete the pod and the controller may create a near-identical replacement, with the same name and a new ID ([pod lifecycle](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/)).

Whether that happens depends on how the workload is set up: its restart policy, the type of controller, whether it is a one-off Job. But the point holds. Killing the container does not mean the agent stays stopped. The system you built for reliability is doing its job, and right now its job is to undo your kill.

Scaling the Deployment to zero stops every copy. That works if one agent is one Deployment. It is a blunt tool when many agent runs share the same workers.

## Revoking the keys

The next answer is to take its access away. Revoke the API key or the token, and the next authenticated request fails.

That is closer to what "revoke" should mean. It stops future work even if the program restarts. It still has gaps. Revocation is not always instant. A short-lived token that was already issued may keep working until it expires. Some services cache an authorization decision for a while.

This is where Hammed's slide comes back. If the agent signs in as you, revoking its credential revokes yours. You can't cut the agent off without cutting yourself off. The agent needs its own identity before revoking it means anything.

## The request that already went through

This was the second thing I hadn't accounted for, and it bothered me most.

Say the agent sends a request to delete 10,000 records. The server checks the key, accepts the request and starts working. One second later, you revoke the key.

The key was valid when it mattered. The server already authorized the job. Revoking the key stops the next request, not this one. Killing the agent doesn't help either: closing the connection does not mean the server stops.

My first reaction was simple: you're cooked. Whether you actually are depends on the system that received the request.

## Cancelling work in progress

For internal tools, you can design for this. A long job can work in batches and check a cancel flag between each one. An orchestrator can refuse to start new work. The batches already committed stay committed, but the damage has a ceiling.

For external APIs, you depend on the provider. Some offer a way to cancel a long operation. Many don't. If there is no cancel on their side, nothing you do on your side reaches it.

## Rolling back what already happened

My next instinct was backups and rollback. For internal data, that often works: restore from a backup, wrap the change in a transaction, or run a job that reverses it.

But plenty of effects don't roll back. A sent email stays sent. Data that leaked is out. A payment may need a refund, which is a new action, not an undo.

So the strongest protection comes earlier. Give the agent the least access it needs. Limit how much one call can do. Ask for approval before big actions. Do risky work in stages, so a mistake hits a small batch first.

## Where does the supervisor live?

One idea in the talk was a supervisor agent that can revoke another agent. This part raised more questions for me than any other.

Where does the supervisor run? If it runs on the same cluster, with the same identity, then whatever can go wrong with the worker can go wrong with the supervisor.

What can it actually do? When it decides "revoke", something still has to carry that out: change a status in a database, revoke a token, scale a workload, call a cancel endpoint. The decision is not the enforcement.

And who governs the supervisor? It is an agent too. It can be wrong, confused, or tricked by something it reads. If it has the power to revoke everything, it is now the most powerful part of the system. Something has to be able to stop it as well, and that something should not be another agent with the same powers.

My answer: the supervisor can ask for a revoke, and trusted code carries it out. The supervisor's own permissions stay narrow. It can mark a run as revoked, and nothing more. That rule lives in code at the boundary, not in its prompt. A prompt tells a model what you would like. Code decides what the system allows.

## What I'd build

Every agent run gets its own ID and its own identity. One trusted store holds the state of each run: active, cancelled or revoked. Then each layer checks that state.

1. The scheduler checks it before it starts or resumes a run, so a restarted container can't pick the work back up.
2. The tool gateway (the single place every tool call goes through) checks it before each call, and rejects a revoked run.
3. Long jobs check it between batches.
4. Credentials are issued per run and expire quickly, so revoking the run also cuts off its keys.
5. Every decision and every call is logged against the run ID, so afterwards you can see what ran, what was stopped and what got through.

The gateway check is a few lines:

```python
def call_tool(run_id, tool, args):
    if run_store.state(run_id) != "active":
        raise RunRevoked(run_id)
    audit_log.record(run_id, tool.name, args)
    return tool.execute(args, credential=credentials.for_run(run_id))
```

This still doesn't stop the request that was already accepted. A check before a call cannot cancel a call that is already running. That gap is covered by cancellation and recovery, or it isn't covered at all.

## Four jobs, not one

Where I ended up: "revoke" is four jobs.

1. **Stop:** end the program, task or workflow (termination).
2. **Revoke:** take away its authority to do more work, including after a restart (revocation).
3. **Cancel:** stop work already scheduled or in progress, where the other system allows it (cancellation).
4. **Repair:** restore or reduce what already happened (recovery).

None of them gives you the others. A supervisor agent can ask for any of them. Trusted software and infrastructure have to carry them out.

Thanks to [Hammed Ajibade](https://www.linkedin.com/in/hammed-ajibade-010bb2116/) for a talk that kept me thinking long after I left, and to the AI Security Engineers London community and Snyk for hosting.

The interesting question isn't whether an agent can be told to stop. It's what guarantees the system can provide when it doesn't.
