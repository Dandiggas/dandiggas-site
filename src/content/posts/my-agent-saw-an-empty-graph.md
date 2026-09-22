---
title: "My Agent Saw an Empty Graph. The Parser Was Wrong."
date: "2026-09-22"
preview: "A schema came back in a format the client did not recognise, and the parser turned that into an empty list. No exception, no HTTP error. For an agent reading the graph through MCP tools, 'I can't read this' became 'there is nothing here'."
readTime: "4 min read"
---

*This came from a real issue at work. I've changed the names and details for confidentiality.*

I recently reproduced a schema-discovery failure that looked much more innocent than an exception. A consumer received a schema in a format it did not understand and returned empty lists. The request path could succeed while the information disappeared at the parsing boundary.

This was particularly interesting because the consumer exposed graph information through MCP tools. An agent asking which labels exist depends on the tool’s answer to decide what it can query. An empty inventory can send it in entirely the wrong direction, even when the database has plenty to say.

Here is a simplified books-and-authors example. The old consumer expects a field called ‘types’. The new provider returns ‘labels’, containing Book and Author. The parser looks up ‘types’, finds nothing, and uses an empty list as its default. There is no malformed JSON. There may be no HTTP error. The application has converted ‘I do not recognise this response’ into ‘there are no types’.

These field names are deliberately simplified. The failure is about the meaning of absence at a boundary. A default is a decision about what missing information means. For an optional list of user preferences, an empty default might be sensible. For the primary field that tells you whether you understand an upstream schema, it can conceal the exact problem you need to report.

The useful first step was to make the incompatibility reproducible with a small fixture. Give the parser a schema that visibly contains a label. Inspect the returned inventory. If the label disappears, I have a concrete consumer bug to investigate. I do not need to speculate that the graph import failed, the database is empty, or the model misunderstood a prompt.

A fixture is deliberately limited evidence. It proves the parser’s behaviour for that input. It does not establish which version is deployed or whether a live service is affected. Keeping those claims separate made the investigation more useful: I could fix and test the demonstrated incompatibility without inventing an outage story around it.

For a compatibility layer, I want recognised formats to be explicit. If supporting both an old and a new response is intentional, identify each shape and translate it deliberately. If neither matches, return a clear unsupported-format error. Checking a single top-level key is only the beginning; the nested structures and the types of their contents also matter.

I would keep at least three outcomes distinct: a recognised schema with no labels, a schema that is not ready to use, and a response the client cannot interpret. Those outcomes lead to different next actions. An agent might report an empty dataset, wait for computation, or surface an integration failure. Flattening them into the same empty list throws away that choice.

The tools themselves benefit from different levels of detail. An inventory can list labels. A detail tool can describe one selected label and its relationships. A broader overview can provide context when the task requires it. In a books-and-authors graph, an agent looking for books by an author should not have to consume every property of every unrelated node before starting.

But a compact answer must still be faithful. If a response is bounded or truncated, say so. If metadata is unavailable, distinguish unavailable from absent. Reducing the response size is useful only while the caller can still interpret what it received.

After the local checks, I exercised the tools through a separate MCP process against a real backend. That added evidence about process startup, authentication, transport, and the tool responses together. It was stronger than calling a helper function directly. It still did not amount to verifying a deployed service, and I would not describe it that way.

For the books-and-authors example, the acceptance sequence is straightforward: the inventory contains Book and Author; Book detail describes the expected properties; the relationship information preserves the direction between authors and books; and a small read-only query works through the same boundary. A malformed schema should produce an intelligible error instead of an apparently valid empty result.

The important part of the fix was preserving meaning across the boundary. An empty graph is a statement about data. An unrecognised schema is a statement about the client. Returning the same answer for both leaves the agent unable to tell which problem it actually has.
