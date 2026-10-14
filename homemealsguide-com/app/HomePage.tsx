"use client";

import { PHONE_LABEL, trackAnswer, trackCallClick, trackFb, useCallHref } from "@/app/lib/meals";
import { useRef, useState } from "react";

type StepId = "1" | "2" | "3" | "ok" | "no-medicaid" | "no-area";

interface Option {
  label: string;
  value: string;
  next: StepId;
}

interface Question {
  step: "1" | "2" | "3";
  name: string;
  title: string;
  options: Option[];
  hint: React.ReactNode;
}

const QUESTIONS: Question[] = [
  {
    step: "1",
    name: "hasMedicaid",
    title: "Are you currently enrolled in Medicaid?",
    options: [
      { label: "Yes, I have Medicaid", value: "yes", next: "2" },
      { label: "No, I don't", value: "no", next: "no-medicaid" },
    ],
    hint: (
      <>
        <b>Not sure?</b>{" Medicaid is free or low-cost public health insurance. In New Jersey it's called NJ FamilyCare. Managed Care plans count too."}
      </>
    ),
  },
  {
    step: "2",
    name: "location",
    title: "Where do you live?",
    options: [
      { label: "New York City (any borough)", value: "New York City", next: "3" },
      { label: "New Jersey", value: "New Jersey", next: "3" },
      { label: "Somewhere else", value: "Somewhere else", next: "no-area" },
    ],
    hint: (
      <>
        We serve <b>Manhattan, Queens, Brooklyn, Staten Island, the Bronx</b> and <b>New Jersey</b>.
      </>
    ),
  },
  {
    step: "3",
    name: "foodInsecurity",
    title: "In the last 12 months, has it been hard to get enough food?",
    options: [
      { label: "Yes, sometimes or often", value: "yes", next: "ok" },
      { label: "No, not really", value: "no", next: "ok" },
    ],
    hint: <>Asking for a parent or loved one? Answer for them. A family member can call on their behalf.</>,
  },
];

/* Icons: Feather/Lucide glyph paths (ISC), inlined to avoid a library download */
const CheckIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
  </svg>
);

const QUALIFIES = [
  "Lives in NYC (any borough) or New Jersey",
  "Enrolled in Medicaid",
  "Has trouble getting enough food",
  "Can live safely at home",
];

const HomePage = () => {
  const [step, setStep] = useState<StepId>("1");
  // Chosen option per question; stays highlighted when the visitor starts over
  const [selected, setSelected] = useState<Record<string, number>>({});
  const quizRef = useRef<HTMLDivElement>(null);
  const callHref = useCallHref();

  const go = (id: StepId) => {
    setStep(id);
    const quiz = quizRef.current;
    if (quiz && quiz.getBoundingClientRect().top < 0) quiz.scrollIntoView({ behavior: "smooth", block: "start" });
    if (id === "ok") trackFb("Lead");
  };

  const choose = (question: Question, index: number) => {
    const option = question.options[index];
    setSelected((prev) => ({ ...prev, [question.step]: index }));
    trackAnswer(question.name, option.value, Number(question.step));
    setTimeout(() => go(option.next), 220);
  };

  return (
    <>
      <header className="top">
        <div className="wrap">
          <div className="bar">
            <span>Medicaid Meal Benefit</span>
            <span className="free">Free screening</span>
          </div>
          <div className="hero">
            <div className="tag">For NYC &amp; NJ Medicaid members</div>
            <h1>Free Meals Delivered to Your Door, <em>Every Day</em></h1>
            <p>3 meals a day, 7 days a week, at no cost. See if you qualify in 30 seconds.</p>
          </div>
        </div>
      </header>

      <main className="wrap">
        <div className="card" id="quiz" ref={quizRef}>

          {QUESTIONS.map((question, qIndex) => (
            <div key={question.step} className={`step${step === question.step ? " on" : ""}`} data-step={question.step}>
              <div className="prog">
                <span>Question {question.step} of 3</span>
                <div className="segs">
                  {QUESTIONS.map((q, i) => <i key={q.step} className={i <= qIndex ? "f" : undefined}></i>)}
                </div>
              </div>
              <h2 className="q">{question.title}</h2>
              <div className="opts">
                {question.options.map((option, i) => (
                  <button
                    key={option.label}
                    className={`opt${selected[question.step] === i ? " sel" : ""}`}
                    onClick={() => choose(question, i)}
                  >
                    <span className="dot"></span>{option.label}
                  </button>
                ))}
              </div>
              <p className="hint">{question.hint}</p>
            </div>
          ))}

          <div className={`step res${step === "ok" ? " on" : ""}`} data-step="ok">
            <div className="badge"><CheckIcon size={32} /></div>
            <h2>Good news, you may qualify!</h2>
            <p>Call now to finish your free screening. It only takes a few minutes, and meals can start soon after.</p>
            <a className="call" href={callHref} onClick={trackCallClick}>
              <PhoneIcon />
              Call now, it&apos;s free
            </a>
            <div className="sub" hidden={!PHONE_LABEL}>{PHONE_LABEL}</div>
            <div className="facts">
              <div><b>3</b><span>meals a day</span></div>
              <div><b>7</b><span>days a week</span></div>
              <div><b>$0</b><span>cost to you</span></div>
            </div>
          </div>

          <div className={`step res${step === "no-medicaid" ? " on" : ""}`} data-step="no-medicaid">
            <h2>This program requires Medicaid</h2>
            <p>Free delivered meals are for Medicaid members. If you can leave home, <a href="https://www.foodhelp.nyc" rel="noopener">FoodHelp NYC</a> lists food pantries and kitchens in all five boroughs. In New Jersey, call <b>211</b>.</p>
            <button className="back" onClick={() => go("1")}>Start over</button>
          </div>

          <div className={`step res${step === "no-area" ? " on" : ""}`} data-step="no-area">
            <h2>Not available in your area yet</h2>
            <p>This program serves the five NYC boroughs and New Jersey. Call <b>211</b> to find food assistance near you.</p>
            <button className="back" onClick={() => go("1")}>Start over</button>
          </div>

        </div>

        <div className="bento">
          <div className="tile lead"><b>$0</b><span>for eligible Medicaid members</span></div>
          <div className="tile soft"><b>3 a day</b><span>hot and frozen meals</span></div>
          <div className="tile"><b>7 days</b><span>a week, every week</span></div>
          <div className="tile" style={{ gridColumn: "1/-1" }}><b>Any diet</b><span>Kosher, halal, diabetic-friendly and medically prescribed</span></div>
        </div>

        <section>
          <h2>How it works</h2>
          <ol className="steps">
            <li><h3>Check eligibility</h3><p>Answer the 3 quick questions above.</p></li>
            <li><h3>Call for a free screening</h3><p>It takes a few minutes. A family member can call for you.</p></li>
            <li><h3>Meals at your door</h3><p>3 meals a day, 7 days a week, made for your diet.</p></li>
          </ol>
        </section>

        <section>
          <h2>Who qualifies</h2>
          <div className="panel">
            <ul className="checks">
              {QUALIFIES.map((item) => <li key={item}><CheckIcon size={18} />{item}</li>)}
            </ul>
          </div>
          <p className="note">Need groceries and able to leave home? In NYC visit <a href="https://www.foodhelp.nyc" rel="noopener">FoodHelp NYC</a>. In New Jersey, call 211.</p>
        </section>

        <section>
          <h2>Common questions</h2>
          <details><summary>Is it really free?</summary><p>Yes. Meals are funded through government health programs like Medicaid for all eligible members.</p></details>
          <details><summary>Which areas are covered?</summary><p>Manhattan, Queens, Brooklyn, Staten Island, the Bronx and New Jersey.</p></details>
          <details><summary>How many meals will I get?</summary><p>3 meals a day, 7 days a week. Delivery schedules may vary by program and location.</p></details>
          <details><summary>What kind of meals?</summary><p>Hot and frozen meals for all dietary needs, including kosher, halal, diabetic-friendly and medically prescribed diets.</p></details>
        </section>

        <footer>
          <p>This is not a government website. Eligibility is not guaranteed and is confirmed through an individual assessment. Benefits depend on your health needs and Medicaid plan.</p>
        </footer>
      </main>

      <div className={`sticky${step === "ok" ? " show" : ""}`} id="sticky">
        <a className="call" href={callHref} onClick={trackCallClick}>Call now, it&apos;s free</a>
      </div>
    </>
  );
};

export default HomePage;
