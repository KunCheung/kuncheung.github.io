# The Core of Agent Safety Is Constraining Uncertain Decision Systems

Consider a personal assistant agent with access to email, calendars, cloud storage, and a browser. The user asks: "Help me arrange my business trip to Tokyo next week." The agent will read emails to confirm the itinerary, check the calendar for openings, search for hotels, consult maps, and perhaps prepare a booking.

An error may never appear in its reply. It might treat marketing copy on a webpage as a task instruction, read private emails it does not need, or proceed with a booking before the budget is confirmed. Each step may seem reasonable on its own, yet together they can lead to an outcome the user did not want.

## 1. From Answering Questions to Making Decisions

For the past few years, much of the discussion about large language model safety has focused on outputs: jailbreaks, hallucinations, and privacy leaks. These have been central concerns. With OpenClaw, Claude Code, and agents integrated into mobile operating systems entering practical use, agents now read their environment, call tools, and perform tasks across applications. Checking the final answer no longer covers the risks of these systems.

As an agent works, it interprets the environment, updates its state, and makes judgments with incomplete information. Through tool calls, those judgments become data access, state changes, and sometimes irreversible actions. Open environments mix information from different sources, while longer task sequences give errors more opportunities to accumulate and amplify.

Several familiar risks occur along this same decision chain. Prompt injection lets a low-trust source influence high-privilege decisions. Excessive memory retrieval gives the system access to information it should not use. Tool misuse turns a probabilistic judgment directly into deterministic execution. Behavioral drift allows the original goal and constraints to fade over a long task.

Agent safety is therefore first a decision-systems engineering problem. We need to constrain a system that keeps making judgments and taking actions in an open environment, without any guarantee that it will always be right.

## 2. Deterministic Anchors Outside the Model

Improving the model's judgment remains essential. Weak understanding, reasoning, or task following leaves downstream safety mechanisms reacting to problems the model creates.

There are already many approaches: post-training methods such as SFT, RLHF, and DPO; reasoning and prompting methods such as chain-of-thought, ReAct, and task decomposition; role and context constraints through system prompts, personas, and task templates; external capabilities such as retrieval, tool use, and search; and reflection and feedback at runtime. All aim to make model behavior more consistent and better suited to the task.

But improving the distribution of model behavior does not establish which data the system must never access, which tools it must never call, or which external text it must never treat as a high-priority instruction.

A customer support agent trained with SFT and preference optimization, for example, may follow service scripts and respond correctly to most tickets. Once it can issue refunds, change prices, and inspect order details, another set of questions arises. Will it use a capability it should not use when the request is ambiguous, the context is confusing, or someone is deliberately misleading it? Have the conditions for a high-risk action actually been met? Alignment in language does not automatically provide hard constraints on execution.

Uncertainty in the model cannot be eliminated, so the system needs boundaries that hold when its judgment is wrong. Here, "deterministic anchors" refers to external supports established by the system, independent of the model's reasoning in the moment. What cannot be done, which actions must stop, and which decisions need additional confirmation should be constrained outside the model.

In practice, this often takes the form of a harness around the model. It does not think for the model; it organizes context, constrains calls, manages state and permissions, and adds checks, rollback, and auditing at critical points. The anchors fall into two broad groups. Human anchors handle a small number of high-value judgments; rule anchors enforce frequent restrictions and provide routine safeguards. Both are useful, and both can be misused.

### Human Anchors: Reserve Attention for Important Decisions

For irreversible, costly, or sensitive actions, a person's final review can be indispensable. A confirmation click, however, is not the same as effective oversight.

A common example is an office agent that asks for approval every time it sends an email, shares a document, changes a meeting, or downloads an attachment. Users may read carefully at first, then start clicking "Allow" without checking. Repeated prompts consume attention, and decision fatigue turns review into mechanical approval. The human remains in the loop, but meaningful supervision has disappeared.

People are better able to make complex value judgments, but their attention, patience, and judgment have limits. Designing human anchors means deciding where to involve a person so that limited attention goes to the decisions that most need it.

### Rule Anchors: Enforce Routine Restrictions Consistently

Frequent, stable restrictions that can be automated are better handled by rules. People get tired and distracted. Well-designed rules can run repeatedly without requiring a fresh judgment each time.

These rules include permission limits, data access controls, tool-call conditions, state-transition constraints, identity and role binding, lifecycle limits, task-level least privilege, source trust layering, risk classification, and auditing. They extend well beyond a few if-else statements. Their purpose is to limit the agent's actions so that a mistaken judgment does not immediately take the system beyond its safety boundaries.

Return to the travel-booking agent. It can search for flights, book hotels, arrange rides, and submit reimbursement requests. The system should establish constraints in advance: no booking before budget confirmation, no access to travel identity documents before identity verification, no sharing itineraries across platforms without user confirmation, and automatic revocation of temporary access when the task ends. The system needs to enforce these restrictions rather than rely on the model's restraint.

Two mechanisms illustrate how this can work.

Taint tracking can label text from webpages, emails, or third-party tools as low-trust input. When the model attempts to pass information carrying those labels to a high-privilege execution module, such as email sending, file export, or payment, the execution engine blocks the operation through its rule layer.

Ephemeral credentials limit the scope and duration of access. More mature agent safety architectures will likely issue temporary tokens for individual tasks instead of giving models broad, long-lived permissions. A token might grant access to one calendar, allow reading but not writing, and expire as soon as the task ends.

## 3. Prompt Injection and Execution Boundaries

Agents need external information to complete tasks, yet that information is untrusted. Prompt injection exploits this tension. OWASP continues to list it among the core risks for GenAI applications.

A well-written system prompt and clear source labels do not mean the model can reliably separate instructions from data. The model interprets external text in the same reasoning process as the rest of its context. The resulting confusion between data and control is difficult to eliminate at the architectural level.

Defenses therefore need to account for a model that has already been influenced. An "assume compromise" or "zero trust" approach focuses on preventing the damage that could follow. Recent Microsoft security guidance also treats indirect injection, tool use beyond authorized boundaries, and high-impact mistaken actions as execution risks requiring system-level controls.

Rule anchors have a direct role here. Prevent outbound tool calls while the agent reads unfamiliar emails, issue read-only temporary tokens, and revoke permissions when the task ends. These restrictions can contain the consequences after an injection occurs.

Permissions can also be reduced dynamically according to context. When the agent processes an unfamiliar webpage, an external email, or a third-party document, the system can automatically remove high-risk capabilities such as sending email, editing calendars, and making payments. Permissions return only after the context is cleared, the task is reconfirmed, or a human anchor performs a rigorous check.

In this design, even if an injection succeeds and the model issues a dangerous instruction, the system refuses to execute it. Prompt injection shows that untrusted environments will keep influencing the model's probabilistic judgments. Safety cannot depend mainly on the model distinguishing instructions from data on its own. Deterministic structures outside the model must constrain its actions.

## 4. Questions That Remain

Adding an injection detector, a tool-call blacklist, a memory filter, or another confirmation prompt can all help. But patching vulnerabilities one at a time can leave the system fragmented, without explaining why similar problems keep recurring.

The whole path from input to execution needs to be considered together: how the model interprets input, how the system distinguishes sources, which information can inform decisions, how decisions become actions, who limits those actions, and how to contain consequences, retain audit trails, and correct errors. I prefer to think of this as governance because it concerns how the agent operates throughout a task.

Three questions deserve further work.

First, how can human confirmation produce reusable preferences and rules? Avoiding mechanical approval is only part of the problem. A meaningful human judgment should also help with later tasks, without requiring the same question every time.

Second, how can we build a trust and permission model across information sources? System messages, user instructions, webpages, documents, emails, and tool outputs all take the form of text, but differ in trust and authority. Modeling trust and permissions at the input stage reaches beyond prompt injection defense alone.

Third, how can safety mechanisms cover long tasks? Multi-step plans, state updates, and tool calls allow risks to accumulate and amplify. Static defenses struggle to cover the whole process. Constraints need to remain effective as the task progresses.

These questions share a goal: accept that models make mistakes while keeping the overall system reliable. Source trust levels, least privilege, human or rule-based intervention for high-risk actions, and limits on the consequences of errors all need to be part of how the agent runs.
