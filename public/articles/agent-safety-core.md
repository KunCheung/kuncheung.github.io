# The Core of Agent Safety Is Constraining Uncertain Decision Systems

When people talk about large model safety, the first instinct is often to look at outputs: will the model jailbreak, hallucinate, or leak private information?

For the past few years, those have indeed been central concerns. But as OpenClaw, Claude Code, and system-level mobile agents move into real environments, agents have moved beyond simply answering questions. They now help users do things: read the environment, call tools, execute operations, and even complete tasks across applications.

Once the object of discussion changes from a passive conversational model to a decision-making entity that can read context, call tools, and take actions, the center of gravity in safety also changes.

The most important question is no longer only what the model says at the end. It is how the agent understands the environment, what it uses as the basis for judgment, and how those probabilistic judgments are converted into real actions that may be hard to reverse.

In other words, agent safety is first a decision-systems engineering problem, and only second a content-filtering problem.

This is the core claim of this essay: **the safety challenge of agents is not primarily what content they generate, but what real actions they take in open and uncertain environments.**

If we accept that models are inherently imperfect and cannot be made fully reliable, then the central question in safety research is no longer how to tune a model until it is always correct. It is: **how do we pair an uncertain probabilistic decision engine with external deterministic structures that can keep it bounded?**

---

## 1. Redefining the Problem: The Core Risk of Agents Is Decision Risk

Consider a concrete scenario.

A personal assistant agent that can access email, calendars, cloud storage, and the browser receives a request: "Help me arrange my business trip to Tokyo next week." From that moment on, the risk is no longer just what the agent will say. The risk is what it will do. It may read emails to confirm the itinerary, inspect calendars for open slots, search for hotels, use maps, and perhaps even prepare a booking.

The real problem may not appear as an obviously dangerous sentence. It may appear as the agent mistaking marketing copy on a webpage for task instructions, reading private email that was not needed, defaulting to a booking without confirming the budget, or gradually pushing a task toward an outcome the user did not actually want through a sequence of locally plausible steps.

This example is enough to show that the core risk of agents is not content generation. The core risk is that they keep making judgments under incomplete information, and those judgments flow through a chain of reading information, calling tools, changing state, and taking action.

For that reason, a more realistic starting point for agent safety is this: an agent is no longer merely a model that answers questions. It is a decision-making system that continuously interprets the environment, updates state, calls tools, and executes tasks.

Open environments amplify the problem. Information sources are mixed, task chains are longer, and errors begin to have real consequences. The problem is no longer just lower answer quality. It can become over-reading data, abusing permissions, calling tools incorrectly, or triggering irreversible high-risk operations.

So agent safety in open environments is fundamentally about one question: **how do we constrain an uncertain decision system?**

Once we view agents as decision systems operating in open environments, many familiar risks can be understood more naturally. Prompt injection becomes a low-trust source influencing high-privilege decisions. Over-retrieval from memory becomes the system accessing information that should not have been used. Tool misuse becomes a probabilistic judgment being converted directly into deterministic execution. Behavioral drift becomes the gradual loss of the original goal and constraints across a long task chain.

These risks occur in different modules, but they share the same root problem: **a system based on probabilistic inference is taking on decision responsibilities that require stronger deterministic support.**

> In the past, people tried to prevent the model from saying one wrong thing. In the agent era, we need to prevent the model from following a wrong path all the way into action.

---

## 2. A Systemic Answer: Deterministic Anchors for Uncertain Decision Systems

If the core risk of agents is that they make uncertain decisions based on incomplete understanding, then the most natural and important direction is to improve the model itself.

This is not optional. It is a necessary line of work. Without stronger understanding, more stable reasoning, and better task following, many downstream safety designs become reactive and brittle. Model improvement is part of agent safety.

Existing methods already cover a broad range of approaches: post-training such as SFT, RLHF, and DPO; reasoning and prompt optimization such as chain-of-thought, ReAct, and task decomposition; role mapping and contextual constraints such as system prompts, personas, and task templates; external capabilities such as retrieval, tool use, and search; and runtime self-correction through reflection and feedback.

These methods differ in form, but their goal is similar: make the model more stable, consistent, and aligned with expectations in a given task. At the root, they try to solve the question: **how do we make the model do the right thing more often?**

But safety is not only about doing the right thing more often. It is also about not crossing boundaries when the model is wrong. Model optimization improves the behavior distribution, but it does not directly answer another class of questions: when must the model never access certain data, never call a certain tool, or never treat external text as high-priority instruction?

A practical example is a customer support agent that has been fine-tuned and preference-optimized. It may follow service scripts well and respond correctly in most tickets. But if it also has the ability to issue refunds, change prices, or inspect order details, the key question is no longer only whether it answers well. The key question is whether, under ambiguous user descriptions, messy context, or malicious guidance, it will call capabilities it should not call or execute high-risk actions before the right conditions are met.

In other words, a model can be linguistically aligned while still lacking hard execution-level constraints. This is the practical version of the claim that model optimization matters, but does not equal system safety.

If the first path tries to reduce uncertainty, the second path starts from a more realistic premise: **uncertainty will not disappear, so the system must remain reliable even while uncertainty exists.**

That is the purpose of deterministic anchors. They are not meant to eliminate uncertainty inside the model. They are meant to prevent that uncertainty from leaking outward, accumulating, and becoming real risk.

In engineering terms, this external support often becomes a harness around the model. The harness does not think for the model. Instead, it organizes context, constrains calls, manages state, tightens permissions, and inserts checks, rollback, and audit mechanisms at critical points.

Deterministic anchors are external supports that do not depend on the model's free-form, in-the-moment inference. The model tries to understand the world. The anchors tell the model what still cannot be done if that understanding is wrong, which actions must stop, and which decisions require additional confirmation.

These anchors can be divided into two broad types. One type is the **human anchor**, which handles high-value, low-frequency judgments. The other is the **rule anchor**, which handles high-frequency guardrails and fallback constraints. Both are valuable, and both are easy to misuse.

### 1. The Human Anchor

Among external anchors, the human is the most intuitive. When the model is about to make a high-risk decision, the safest response seems to be to let a person review it. In many real settings, that intuition is correct. For irreversible, costly, or highly sensitive actions, human involvement can be indispensable.

But involving a human is not the same as effective oversight. Many systems introduce human-in-the-loop controls and assume that if a user clicks a confirmation button, safety has improved. This is too optimistic. Human attention, patience, and judgment quality are limited.

If the system asks for confirmation too frequently, decision fatigue appears. Users move from careful review to mechanical approval. Human-in-the-loop then degrades from effective oversight into a formal ritual.

A common workplace example is an agent that asks for confirmation every time it sends an email, shares a document, changes a meeting, or downloads an attachment. At first, these prompts look like additional safety. But users quickly develop a reflex: approve without reading. The system keeps the appearance of human oversight, while the real oversight has turned into decoration.

> Humans can handle complex value judgments better than models, but humans are not infinite, stable, high-quality supervision machines.

The key is not whether a human is present. The key is when the human appears. The important research question for human-in-the-loop systems is not how to involve humans more often, but how to reserve human attention for the moments where it matters most.

### 2. The Rule Anchor

If human anchors are best suited for a small number of high-value decisions, rule anchors are better suited for frequent, stable, automatable restrictions. People get tired, distracted, and worn down by interaction costs. Rules, if designed well, can execute consistently and repeatedly.

Here, "rules" does not mean only simple if-else logic. It refers to any mechanism that can be reliably enforced by the system to constrain the action space: permission limits, data access controls, tool-call conditions, state-transition constraints, identity and role binding, lifecycle limits, task-level least privilege, source trust layering, risk classification, and audit mechanisms.

The core value of rules is not that they improve the model's average judgment. Their value is that when the model is wrong, the system does not immediately escape its safe operating range. Rules do not answer whether the model is smart enough. They answer whether the consequences remain controlled when the model makes a mistake.

Consider a travel-booking agent. It can search flights, book hotels, order rides, and submit reimbursement requests. A mature system should not merely expect the model to know when to be careful. It should explicitly enforce constraints: no booking without budget confirmation, no access to travel documents without identity verification, no cross-platform itinerary sharing without user confirmation, and automatic revocation of temporary access when the task ends. These are not acts of model benevolence. They are system-level constraints written in advance.

Two mechanisms become especially important in an engineering implementation.

The first is **taint tracking**. Text from webpages, emails, or third-party tools can be labeled as low-trust input inside the system. If the model attempts to pass that information into a high-privilege execution module, such as sending email, exporting files, or calling a payment tool, the rule layer can block it directly.

The second is **ephemeral credentials**. More mature agent safety architectures will likely avoid giving models broad, long-lived permissions. Instead, they will issue temporary tokens according to the task: access only a specific calendar, read but not write, expire immediately after task completion.

Both mechanisms reinforce the same point: rules do not replace model decision-making. They ensure that when model decisions are wrong, the system still does not easily leave a reasonable safety boundary.

---

## 3. Prompt Injection Revisited: From Cleaning the Mind to Constraining the Hands

Prompt injection is dangerous not only because a model can be tricked by a malicious prompt. It is dangerous because it reveals a deeper fact about agent systems: the system must read external information to complete tasks, and that external information is itself untrusted. OWASP continues to list prompt injection as one of the core risks for GenAI applications.

The most important point is that we should not remain overly optimistic about prompt injection. It is tempting to believe that if the system prompt is strong enough, or if sources are labeled clearly enough, the model will reliably separate instructions from data. Reality is not so simple. Once external text enters the context window of a modern language model, it is processed in the same semantic reasoning stream. In other words, the confusion between data and control is not an occasional bug. It is a structural difficulty in the model architecture.

Once we accept this, the defensive strategy must change. The question is no longer how to ensure that the model is never influenced. The question is how the system avoids real damage after the model has been influenced. This is why a better principle for prompt injection is not "assume interception succeeds," but "assume compromise." Recent security guidance from Microsoft makes a similar point: indirect injection, out-of-bound tool use, and high-impact mistaken operations should be treated as execution risks that require system-level controls.

This brings us back to rule anchors. For injection, instead of placing all hope in text filtering, the system should directly control the blast radius: do not allow external email reading contexts to call outbound messaging tools; issue read-only temporary tokens; revoke permissions after the task ends. A more advanced implementation could dynamically downgrade permissions based on context. When an agent is processing an unfamiliar webpage, external email, or third-party document, the system can remove high-risk capabilities such as sending email, editing calendars, or making payments. Those permissions return only after the context is cleared, the task is reconfirmed, or a strong human check is completed.

In this design, even if prompt injection succeeds and the model produces a dangerous instruction, the system layer refuses to execute it. What is protected is not the model's thoughts, but the system's capacity to act.

Prompt injection therefore proves something deeper than "models are not smart enough." It shows that if a model's probabilistic judgment is inevitably influenced by untrusted environments, safety cannot mainly rely on the model's internal ability to distinguish trusted from untrusted input. It must rely on deterministic structures outside the model. Prompt injection is not an isolated vulnerability. It is the clearest example of the broader argument: when an uncertain decision system enters an open environment, what saves the system is not hoping the model will never be manipulated, but ensuring that even when it is manipulated, it does not have enough authority to cause serious harm.

---

## 4. From Vulnerability Patching to System Governance

The previous sections have discussed several points: why agent safety can no longer be understood only as content safety; why improving the model alone is not a safety guarantee; why deterministic anchors must be added outside the model; why human anchors matter but cannot be relied on infinitely; why rule anchors are better suited for high-frequency constraints; and why prompt injection is a concentrated example of external anchors failing in open environments.

If these points were merely placed side by side, they would still look like related but scattered topics. What matters is that they can be pulled into a single higher-level framework.

Prompt injection, over-retrieval from memory, tool misuse, behavioral drift, and the failure modes of human-in-the-loop systems appear in different modules. But they all point to the same structural tension: **a system based on probabilistic inference is taking on decision responsibilities that require deterministic support.**

Unifying these problems is not only conceptually cleaner. It changes how we design and study safety mechanisms.

If we treat agent safety as a set of scattered vulnerabilities, the natural response is to patch each phenomenon separately: add a detector for injection attacks, add a blacklist for tool calls, add a filter for memory access, add another confirmation prompt for human approval. These patches can be valuable, but they easily make the system fragmented. They also do not answer the deeper question: why do these problems keep reappearing?

Once we place them in the same framework, the real object of concern is no longer any single phenomenon. It is the whole risk chain: how the model understands input, how the system distinguishes information sources, which information may enter decision-making, how decisions become execution, who tightens the action range, how consequences are limited after errors, and how audit trails support correction.

This is why I prefer to understand agent safety as governance rather than defense. It is not facing one single vulnerability. It is shaping an entire operating order.

If we compress the future agenda into a few fundamental engineering challenges, at least three stand out.

First, move from human confirmation to preference sedimentation. The key is not only when to trigger human-in-the-loop, but how to prevent it from degrading into mechanical clicking, and how to turn one meaningful human judgment into reusable future rules and preferences.

Second, build a trust and permission model across information sources. System messages, user instructions, webpages, documents, emails, and tool outputs may all look like text, but they do not have the same trust level or control authority. Taken seriously, this is not merely prompt injection defense. It is trust and permission modeling on the input side.

Third, make safety mechanisms cover long-chain tasks. Many agent risks do not happen in a single step. They accumulate and amplify across multi-step plans, state updates, and tool calls. Mature agent safety should therefore not be only static defense. It needs process governance.

> The goal of safety is not to turn the model into an error-free rational actor. The goal is to acknowledge uncertainty and design a world in which that uncertainty does not easily spiral out of control.

Looking back at the full essay, the central question has stayed the same: why has the safety of large models and agents become so much more complex than traditional content safety? The answer is that the model's role has changed. It is no longer only a text-generation tool. It increasingly resembles a decision-making entity that continuously understands, judges, and acts in an open environment.

Therefore, the core of agent safety is not to keep patching around one specific attack, nor to pursue a model that never makes mistakes. It is to accept a reality: models will not be absolutely reliable, but systems still must be reliable.

The work worth doing is not only to improve model accuracy. It is to design an operating world for probabilistic intelligence: information sources are layered, permissions are minimized and tightened, high-risk actions are checked by humans or rules, and errors do not easily grow into irreversible consequences.
