"use client";

import { PHONE_LABEL, trackAnswer, trackCallClick, trackFb, useCallHref } from "@/app/lib/meals";
import { useEffect, useRef, useState } from "react";

const AGENT = "A"; // avatar initial (header name is in the markup below)
const INTRO = "Free home-delivered meals for Medicaid members in NYC and New Jersey";
const WAIT = "__wait";

type NodeKey = "start" | "unsure" | "area" | "food" | "result" | "noMedicaid" | "noArea";

interface Reply {
  label: string;
  next: NodeKey | "restart";
  value?: string;
}

interface FlowNode {
  say: string[];
  /** Field name and step number the replies are tracked under. */
  name?: string;
  step?: number;
  opts?: Reply[];
  card?: boolean;
}

// Conversation script. Each node: bot messages, then reply options.
const FLOW: Record<NodeKey, FlowNode> = {
  start: {
    say: ["Hi there! 👋 I'm Ana.",
          "I can check in about 30 seconds if you qualify for <b>free meals delivered to your door</b>.",
          "3 meals a day, 7 days a week, at <b>no cost</b> for eligible Medicaid members.",
          "Ready? First question:",
          "Are you currently enrolled in <b>Medicaid</b>? (In New Jersey it's called NJ FamilyCare.)"],
    name: "hasMedicaid",
    step: 1,
    opts: [{ label: "Yes, I have Medicaid", next: "area", value: "yes" }, { label: "No, I don't", next: "noMedicaid", value: "no" }, { label: "I'm not sure", next: "unsure", value: "not sure" }],
  },
  unsure: {
    say: ["No problem. Medicaid is free or low-cost public health insurance. Managed Care plans count too.",
          "If you have a Medicaid or NJ FamilyCare card, or a plan you got through Medicaid, the answer is yes."],
    name: "hasMedicaid",
    step: 1,
    opts: [{ label: "Yes, I have it", next: "area", value: "yes" }, { label: "No, I don't", next: "noMedicaid", value: "no" }],
  },
  area: {
    say: ["Great! 🙌", "Where do you live?"],
    name: "location",
    step: 2,
    opts: [{ label: "New York City (any borough)", next: "food", value: "New York City" }, { label: "New Jersey", next: "food", value: "New Jersey" }, { label: "Somewhere else", next: "noArea", value: "Somewhere else" }],
  },
  food: {
    say: ["Got it, that area is covered.",
          "Last question: in the last 12 months, has it been hard to get enough food?"],
    name: "foodInsecurity",
    step: 3,
    opts: [{ label: "Yes, sometimes or often", next: "result", value: "yes" }, { label: "No, not really", next: "result", value: "no" }],
  },
  result: {
    say: ["Let me check your answers...", WAIT,
          "🎉 Good news, <b>you may qualify!</b>",
          "The last step is a quick free call to confirm your eligibility. A family member can call for you too."],
    card: true,
  },
  noMedicaid: {
    say: ["Thanks for letting me know. This program is only for Medicaid members.",
          'If you can leave home, <a href="https://www.foodhelp.nyc" rel="noopener">FoodHelp NYC</a> lists food pantries and kitchens in all five boroughs. In New Jersey, call <b>211</b>.'],
    opts: [{ label: "Start over", next: "restart" }],
  },
  noArea: {
    say: ["Sorry, this program only serves the five NYC boroughs and New Jersey for now.",
          "Call <b>211</b> to find food assistance near you."],
    opts: [{ label: "Start over", next: "restart" }],
  },
};

interface Row {
  id: number;
  from: "bot" | "me";
  /** Bot messages are the trusted strings from FLOW; "me" rows are plain text. */
  text?: string;
  card?: boolean;
}

const PhoneIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
  </svg>
);

const ChatPage = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [typing, setTyping] = useState(false);
  const [node, setNode] = useState<NodeKey | null>(null); // node whose replies are on screen
  const [showCall, setShowCall] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const fast = useRef(false);
  const runId = useRef(0);
  const rowId = useRef(0);
  const callHref = useCallHref();

  const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, fast.current ? 0 : ms));

  const addRow = (row: Omit<Row, "id">) => setRows((prev) => [...prev, { ...row, id: ++rowId.current }]);

  const run = async (key: NodeKey) => {
    const id = ++runId.current;
    const stale = () => id !== runId.current;
    const current = FLOW[key];
    setNode(null);

    const showTyping = async (ms: number) => {
      setTyping(true);
      await wait(ms);
      if (!stale()) setTyping(false);
    };

    for (const text of current.say) {
      if (text === WAIT) {
        await showTyping(1400);
        if (stale()) return;
        continue;
      }
      const plain = text.replace(/<[^>]+>/g, "");
      await showTyping(Math.min(400 + plain.length * 14, 1300));
      if (stale()) return;
      addRow({ from: "bot", text });
      await wait(150);
      if (stale()) return;
    }

    if (current.card) {
      trackFb("Lead");
      addRow({ from: "bot", card: true });
      addRow({ from: "bot", text: "Tap the button below to call. 👇" });
      // The single CTA lives in the dock so it stays visible however the chat is scrolled
      setShowCall(true);
      return;
    }
    setNode(key);
  };

  const answer = (reply: Reply) => {
    const current = node ? FLOW[node] : null;
    setNode(null);
    if (reply.next === "restart") {
      setRows([]);
      run("start");
      return;
    }
    if (current?.name && current.step && reply.value) trackAnswer(current.name, reply.value, current.step);
    addRow({ from: "me", text: reply.label });
    const next = reply.next;
    wait(250).then(() => run(next));
  };

  useEffect(() => {
    fast.current = matchMedia("(prefers-reduced-motion: reduce)").matches;
    run("start");
    return () => {
      runId.current++;
      setRows([]);
      setTyping(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const log = logRef.current;
    log?.scrollTo({ top: log.scrollHeight, behavior: fast.current ? "auto" : "smooth" });
  }, [rows, typing]);

  // The reply dock changes height (buttons in/out), which shrinks the log: keep it pinned to the latest message
  useEffect(() => {
    const log = logRef.current;
    if (!log || !window.ResizeObserver) return;
    const observer = new ResizeObserver(() => { log.scrollTop = log.scrollHeight; });
    observer.observe(log);
    return () => observer.disconnect();
  }, []);

  const last = rows[rows.length - 1];

  return (
    <div className="app">

      <header className="head">
        <div className="av" aria-hidden="true">A</div>
        <div className="who"><b>Ana</b><span>Meal benefit guide, online</span></div>
        <span className="tag">Free</span>
      </header>

      <div className="log" id="log" aria-live="polite" ref={logRef}>
        <p className="intro">{INTRO}</p>
        {rows.flatMap((row, i) => {
          const prev = rows[i - 1];
          const next = rows[i + 1];
          return [
            prev && prev.from !== row.from ? <div key={`gap-${row.id}`} className="gap"></div> : null,
            <div key={row.id} className={`row ${row.from}`}>
              {/* Consecutive bot bubbles share one avatar, shown on the last bubble of the run */}
              {row.from === "bot" && <span className={`mini${next?.from === "bot" ? " ghost" : ""}`} aria-hidden="true">{AGENT}</span>}
              {row.card ? (
                <div className="cta-card">
                  <div className="facts"><div><b>3</b><span>meals a day</span></div><div><b>7</b><span>days a week</span></div><div><b>$0</b><span>cost to you</span></div></div>
                </div>
              ) : row.from === "bot" ? (
                <div className="msg" dangerouslySetInnerHTML={{ __html: row.text || "" }} />
              ) : (
                <div className="msg">{row.text}</div>
              )}
            </div>,
          ];
        })}
        {typing && last?.from === "me" && <div className="gap"></div>}
        {typing && (
          <div className="row bot typing">
            <span className="mini" aria-hidden="true">{AGENT}</span>
            <div className="msg" aria-label="typing"><i></i><i></i><i></i></div>
          </div>
        )}
      </div>

      <div className="dock">
        <div className="replies" id="replies">
          {node && FLOW[node].opts?.map((reply, i) => (
            <button
              key={`${node}-${reply.label}`}
              className="reply"
              style={{ animationDelay: `${fast.current ? 0 : i * 60}ms` }}
              onClick={() => answer(reply)}
            >
              {reply.label}
            </button>
          ))}
          {showCall && (
            <>
              <a className="call" href={callHref} onClick={trackCallClick}><PhoneIcon />Call now, it&apos;s free</a>
              {PHONE_LABEL && <p className="sub">{PHONE_LABEL}</p>}
            </>
          )}
        </div>
        <p className="legal">Not a government website. Eligibility is confirmed through an individual assessment.</p>
      </div>

    </div>
  );
};

export default ChatPage;
