import { useState, useEffect, useCallback, useRef } from "react";

const EXAM_SIZE = 80;

let _questionsCache = null;
async function loadQuestions() {
  if (_questionsCache) return _questionsCache;
  const resp = await fetch("questions.json");
  if (!resp.ok) throw new Error("Failed to load questions (" + resp.status + ")");
  _questionsCache = await resp.json();
  return _questionsCache;
}

const TOTAL_TIME = 60 * 60;
const PASS_PERCENTAGE = 85;

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function StartScreen({ onStart }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(145deg, #0a0e1a 0%, #121930 50%, #0d1224 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 680, width: "100%", textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            background: "rgba(99, 179, 237, 0.08)",
            border: "1px solid rgba(99, 179, 237, 0.15)",
            borderRadius: 100,
            padding: "8px 20px",
            marginBottom: 32,
          }}
        >
          <span style={{ fontSize: 18 }}>🎯</span>
          <span
            style={{
              color: "#63b3ed",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: 1.5,
              textTransform: "uppercase",
            }}
          >
            Practice Exam
          </span>
        </div>
        <h1
          style={{
            fontSize: "clamp(36px, 5vw, 56px)",
            fontWeight: 800,
            color: "#fff",
            margin: "0 0 12px 0",
            lineHeight: 1.1,
            letterSpacing: -1,
          }}
        >
          PSM-I
        </h1>
        <p
          style={{
            fontSize: "clamp(16px, 2.5vw, 22px)",
            color: "rgba(255,255,255,0.5)",
            margin: "0 0 48px 0",
            fontWeight: 400,
          }}
        >
          Professional Scrum Master I
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            marginBottom: 48,
          }}
        >
          {[
            { icon: "📝", label: "80 questions", sub: "Randomized from pool" },
            { icon: "⏱️", label: "60 minutes", sub: "45 sec per question" },
            { icon: "✅", label: "85% to pass", sub: "68 of 80 correct" },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 16,
                padding: "24px 16px",
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 10 }}>{item.icon}</div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
                {item.label}
              </div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{item.sub}</div>
            </div>
          ))}
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 16,
            padding: "24px 28px",
            marginBottom: 24,
            textAlign: "left",
          }}
        >
          <div
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 1.2,
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            Topics
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[
              "Scrum Theory & Pillars",
              "Scrum Values",
              "Scrum Team & Accountabilities",
              "Scrum Events",
              "Artifacts & Commitments",
              "Scenarios & Trick Questions",
            ].map((t, i) => (
              <span
                key={i}
                style={{
                  background: "rgba(99,179,237,0.08)",
                  border: "1px solid rgba(99,179,237,0.12)",
                  color: "#63b3ed",
                  fontSize: 12,
                  fontWeight: 500,
                  borderRadius: 8,
                  padding: "6px 12px",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <div
          style={{
            background: "rgba(251,191,36,0.06)",
            border: "1px solid rgba(251,191,36,0.12)",
            borderRadius: 12,
            padding: "16px 20px",
            marginBottom: 40,
            textAlign: "left",
          }}
        >
          <span style={{ color: "#fbbf24", fontSize: 13, lineHeight: 1.6 }}>
            ⚠️ <strong>Note:</strong> This practice exam follows the exact terminology of the Scrum
            Guide 2020. Read questions and answers carefully — subtle word choices often make the
            difference.
          </span>
        </div>
        <button
          onClick={onStart}
          className="start-btn"
          style={{
            background: "linear-gradient(135deg, #3182ce 0%, #2563eb 100%)",
            color: "#fff",
            border: "none",
            borderRadius: 14,
            padding: "18px 48px",
            fontSize: 17,
            fontWeight: 700,
            cursor: "pointer",
            letterSpacing: 0.3,
            boxShadow: "0 4px 24px rgba(49, 130, 206, 0.35)",
            transition: "all 0.2s",
          }}
        >
          Start exam →
        </button>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 16 }}>
          Based on the Scrum Guide 2020 by Ken Schwaber & Jeff Sutherland
        </p>
      </div>
    </div>
  );
}

function QuestionCard({ question, currentAnswer, onAnswer, index, total }) {
  const isMultiple = question.type === "multiple";
  const selected = currentAnswer || [];
  const toggleOption = (idx) => {
    if (isMultiple) {
      const n = selected.includes(idx) ? selected.filter((i) => i !== idx) : [...selected, idx];
      onAnswer(n);
    } else {
      onAnswer([idx]);
    }
  };
  const catColors = {
    "Scrum Theory": {
      bg: "rgba(129,140,248,0.08)",
      border: "rgba(129,140,248,0.2)",
      text: "#818cf8",
    },
    "Scrum Values": {
      bg: "rgba(52,211,153,0.08)",
      border: "rgba(52,211,153,0.2)",
      text: "#34d399",
    },
    "Scrum Team": { bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.2)", text: "#fbbf24" },
    "Scrum Events": {
      bg: "rgba(244,114,182,0.08)",
      border: "rgba(244,114,182,0.2)",
      text: "#f472b6",
    },
    "Artifacts & Commitments": {
      bg: "rgba(99,179,237,0.08)",
      border: "rgba(99,179,237,0.2)",
      text: "#63b3ed",
    },
    Scenarios: { bg: "rgba(251,146,60,0.08)", border: "rgba(251,146,60,0.2)", text: "#fb923c" },
  };
  const cs = catColors[question.category] || catColors["Scrum Theory"];
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 20,
        padding: "clamp(20px, 4vw, 36px)",
        maxWidth: 780,
        width: "100%",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            background: cs.bg,
            border: `1px solid ${cs.border}`,
            color: cs.text,
            fontSize: 11,
            fontWeight: 600,
            borderRadius: 6,
            padding: "4px 10px",
            letterSpacing: 0.5,
          }}
        >
          {question.category}
        </span>
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
          Question {index + 1} of {total}
        </span>
        {isMultiple && (
          <span
            style={{
              background: "rgba(251,191,36,0.08)",
              border: "1px solid rgba(251,191,36,0.15)",
              color: "#fbbf24",
              fontSize: 11,
              fontWeight: 600,
              borderRadius: 6,
              padding: "4px 10px",
            }}
          >
            Choose {question.selectCount}
          </span>
        )}
      </div>
      <h2
        style={{
          color: "#fff",
          fontSize: "clamp(16px, 2.2vw, 20px)",
          fontWeight: 600,
          lineHeight: 1.5,
          margin: "0 0 28px 0",
        }}
      >
        {question.question}
      </h2>
      <div
        role={isMultiple ? "group" : "radiogroup"}
        aria-label={`Options for question ${index + 1}`}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        {question.options.map((opt, idx) => {
          const isSel = selected.includes(idx);
          return (
            <button
              key={idx}
              role={isMultiple ? "checkbox" : "radio"}
              aria-checked={isSel}
              onClick={() => toggleOption(idx)}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                padding: "14px 18px",
                borderRadius: 12,
                border: isSel
                  ? "1px solid rgba(99,179,237,0.4)"
                  : "1px solid rgba(255,255,255,0.06)",
                background: isSel ? "rgba(99,179,237,0.08)" : "rgba(255,255,255,0.015)",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s",
                color: "#fff",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  flexShrink: 0,
                  width: 24,
                  height: 24,
                  borderRadius: isMultiple ? 6 : 12,
                  border: isSel ? "2px solid #63b3ed" : "2px solid rgba(255,255,255,0.15)",
                  background: isSel ? "#63b3ed" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 1,
                  fontSize: 13,
                  fontWeight: 700,
                  color: isSel ? "#0a0e1a" : "rgba(255,255,255,0.3)",
                }}
              >
                {isSel ? "✓" : String.fromCharCode(65 + idx)}
              </span>
              <span
                style={{
                  fontSize: 15,
                  lineHeight: 1.5,
                  color: isSel ? "#fff" : "rgba(255,255,255,0.7)",
                }}
              >
                {opt}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ReviewScreen({ questions, answers, flagged, onRetry, onBackToStart }) {
  const flaggedSet = new Set(flagged || []);
  const results = questions.map((q, i) => {
    const ua = answers[i] || [];
    const isCorrect = [...q.correct].sort().join(",") === [...ua].sort().join(",");
    return { ...q, userAns: ua, isCorrect, isFlagged: flaggedSet.has(i) };
  });
  const score = results.filter((r) => r.isCorrect).length;
  const pct = Math.round((score / questions.length) * 100 * 10) / 10;
  const passed = pct >= PASS_PERCENTAGE;
  const catStats = {};
  results.forEach((r) => {
    if (!catStats[r.category]) catStats[r.category] = { total: 0, correct: 0 };
    catStats[r.category].total++;
    if (r.isCorrect) catStats[r.category].correct++;
  });
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const filtered =
    filter === "all"
      ? results
      : filter === "wrong"
        ? results.filter((r) => !r.isCorrect)
        : filter === "correct"
          ? results.filter((r) => r.isCorrect)
          : results.filter((r) => r.isFlagged);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(145deg, #0a0e1a 0%, #121930 50%, #0d1224 100%)",
        padding: "clamp(16px, 4vw, 40px)",
        fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div style={{ textAlign: "center", padding: "48px 24px", marginBottom: 32 }}>
          <div
            style={{
              fontSize: "clamp(56px, 10vw, 80px)",
              fontWeight: 800,
              color: passed ? "#34d399" : "#f87171",
              lineHeight: 1,
            }}
          >
            {pct}%
          </div>
          <div style={{ fontSize: 20, color: "rgba(255,255,255,0.5)", marginTop: 8 }}>
            {score} of {questions.length} correct
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginTop: 20,
              padding: "10px 24px",
              borderRadius: 100,
              background: passed ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)",
              border: `1px solid ${passed ? "rgba(52,211,153,0.2)" : "rgba(248,113,113,0.2)"}`,
            }}
          >
            <span style={{ fontSize: 20 }}>{passed ? "🎉" : "📚"}</span>
            <span style={{ color: passed ? "#34d399" : "#f87171", fontWeight: 700, fontSize: 15 }}>
              {passed ? "Passed!" : `Not passed (minimum ${PASS_PERCENTAGE}% required)`}
            </span>
          </div>
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 16,
            padding: 24,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 1.2,
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Score by topic
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {Object.entries(catStats).map(([cat, stats]) => {
              const cp = Math.round((stats.correct / stats.total) * 100);
              return (
                <div key={cat}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}
                  >
                    <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>{cat}</span>
                    <span
                      style={{
                        color: cp >= 85 ? "#34d399" : cp >= 70 ? "#fbbf24" : "#f87171",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      {stats.correct}/{stats.total} ({cp}%)
                    </span>
                  </div>
                  <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)" }}>
                    <div
                      style={{
                        height: "100%",
                        borderRadius: 2,
                        width: `${cp}%`,
                        background: cp >= 85 ? "#34d399" : cp >= 70 ? "#fbbf24" : "#f87171",
                        transition: "width 0.5s",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {[
            { key: "all", label: `All (${results.length})` },
            { key: "wrong", label: `Wrong (${results.filter((r) => !r.isCorrect).length})` },
            { key: "correct", label: `Correct (${results.filter((r) => r.isCorrect).length})` },
            { key: "flagged", label: `🚩 Flagged (${results.filter((r) => r.isFlagged).length})` },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: "8px 18px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                border:
                  filter === f.key
                    ? "1px solid rgba(99,179,237,0.3)"
                    : "1px solid rgba(255,255,255,0.06)",
                background: filter === f.key ? "rgba(99,179,237,0.1)" : "rgba(255,255,255,0.02)",
                color: filter === f.key ? "#63b3ed" : "rgba(255,255,255,0.5)",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((q) => {
            const exp = expandedId === q.id;
            return (
              <div
                key={q.id}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: `1px solid ${q.isCorrect ? "rgba(52,211,153,0.12)" : "rgba(248,113,113,0.12)"}`,
                  borderRadius: 14,
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => setExpandedId(exp ? null : q.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "16px 20px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    color: "#fff",
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: q.isCorrect ? "rgba(52,211,153,0.12)" : "rgba(248,113,113,0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                    }}
                  >
                    {q.isCorrect ? "✓" : "✗"}
                  </span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", flexShrink: 0 }}>
                    #{q.id}
                  </span>
                  {q.isFlagged && <span style={{ fontSize: 12, flexShrink: 0 }}>🚩</span>}
                  <span
                    style={{
                      flex: 1,
                      fontSize: 14,
                      color: "rgba(255,255,255,0.8)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: exp ? "normal" : "nowrap",
                    }}
                  >
                    {q.question}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 18, flexShrink: 0 }}>
                    {exp ? "−" : "+"}
                  </span>
                </button>
                {exp && (
                  <div
                    style={{
                      padding: "0 20px 20px",
                      borderTop: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    <div style={{ paddingTop: 16 }}>
                      {q.options.map((opt, idx) => {
                        const isC = q.correct.includes(idx),
                          isU = q.userAns.includes(idx);
                        let bg = "transparent",
                          bd = "1px solid rgba(255,255,255,0.04)";
                        if (isC && isU) {
                          bg = "rgba(52,211,153,0.08)";
                          bd = "1px solid rgba(52,211,153,0.2)";
                        } else if (isC) {
                          bg = "rgba(52,211,153,0.05)";
                          bd = "1px solid rgba(52,211,153,0.15)";
                        } else if (isU) {
                          bg = "rgba(248,113,113,0.08)";
                          bd = "1px solid rgba(248,113,113,0.2)";
                        }
                        return (
                          <div
                            key={idx}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 10,
                              padding: "10px 14px",
                              borderRadius: 8,
                              background: bg,
                              border: bd,
                              marginBottom: 6,
                              fontSize: 14,
                              lineHeight: 1.5,
                            }}
                          >
                            <span style={{ flexShrink: 0, width: 20, textAlign: "center" }}>
                              {isC && isU ? "✅" : isC ? "✅" : isU ? "❌" : ""}
                            </span>
                            <span
                              style={{
                                color: isC ? "#34d399" : isU ? "#f87171" : "rgba(255,255,255,0.5)",
                              }}
                            >
                              {opt}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div
                      style={{
                        marginTop: 14,
                        padding: "14px 16px",
                        background: "rgba(99,179,237,0.05)",
                        border: "1px solid rgba(99,179,237,0.1)",
                        borderRadius: 10,
                        fontSize: 13,
                        lineHeight: 1.6,
                        color: "rgba(255,255,255,0.65)",
                      }}
                    >
                      <strong style={{ color: "#63b3ed" }}>Explanation:</strong> {q.explanation}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            marginTop: 40,
            paddingBottom: 40,
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={onRetry}
            style={{
              background: "linear-gradient(135deg, #3182ce 0%, #2563eb 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "14px 32px",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(49,130,206,0.3)",
            }}
          >
            Try again
          </button>
          <button
            onClick={onBackToStart}
            style={{
              background: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.6)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12,
              padding: "14px 32px",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Back to start
          </button>
        </div>
      </div>
    </div>
  );
}

const STORAGE_KEY = "psm-exam-state";
async function saveState(state) {
  try {
    if (window.storage) {
      await window.storage.set(STORAGE_KEY, JSON.stringify(state));
    }
  } catch (e) {
    console.warn("Failed to save exam state:", e);
  }
}
async function loadState() {
  try {
    if (window.storage) {
      const r = await window.storage.get(STORAGE_KEY);
      if (!r) return null;
      const parsed = JSON.parse(r.value);
      if (!parsed || !Array.isArray(parsed.questions)) return null;
      return parsed;
    }
  } catch (e) {
    console.warn("Failed to load exam state:", e);
  }
  return null;
}
async function clearState() {
  try {
    if (window.storage) {
      await window.storage.delete(STORAGE_KEY);
    }
  } catch (e) {
    console.warn("Failed to clear exam state:", e);
  }
}

export default function PSMExam() {
  const [phase, setPhase] = useState("loading");
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [flagged, setFlagged] = useState(new Set());
  const [showNav, setShowNav] = useState(false);
  const timerRef = useRef(null);
  const initialized = useRef(false);

  const saveTimerRef = useRef(null);
  const timeLeftRef = useRef(TOTAL_TIME);
  timeLeftRef.current = timeLeft;

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    loadState().then((saved) => {
      if (
        saved &&
        saved.phase &&
        saved.phase !== "start" &&
        saved.questions &&
        saved.questions.length > 0
      ) {
        const validQ = Math.min(Math.max(0, saved.currentQ || 0), saved.questions.length - 1);
        const validTime =
          typeof saved.timeLeft === "number"
            ? Math.min(Math.max(0, saved.timeLeft), TOTAL_TIME)
            : TOTAL_TIME;
        setQuestions(saved.questions);
        setCurrentQ(validQ);
        setAnswers(saved.answers || {});
        setTimeLeft(validTime);
        setFlagged(new Set(saved.flagged || []));
        setPhase(saved.phase);
      } else {
        setPhase("start");
      }
    });
  }, []);

  const doSave = useCallback(() => {
    saveState({
      phase,
      questions,
      currentQ,
      answers,
      timeLeft: timeLeftRef.current,
      flagged: Array.from(flagged),
    });
  }, [phase, questions, currentQ, answers, flagged]);

  useEffect(() => {
    if (phase === "loading") return;
    if (phase === "start") {
      clearState();
      return;
    }
    doSave();
  }, [phase, doSave]);

  // Save timer periodically (every 30s) instead of every tick
  useEffect(() => {
    if (phase !== "exam") return;
    saveTimerRef.current = setInterval(() => {
      doSave();
    }, 30000);
    return () => clearInterval(saveTimerRef.current);
  }, [phase, doSave]);

  const startExam = useCallback(() => {
    loadQuestions()
      .then((allQuestions) => {
        const selected = shuffleArray(allQuestions).slice(0, EXAM_SIZE);
        setQuestions(selected);
        setCurrentQ(0);
        setAnswers({});
        setTimeLeft(TOTAL_TIME);
        setFlagged(new Set());
        setPhase("exam");
      })
      .catch((err) => {
        console.error("Failed to load questions:", err);
      });
  }, []);

  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useEffect(() => {
    if (phase === "exam") {
      timerRef.current = setInterval(() => {
        if (phaseRef.current !== "exam") {
          clearInterval(timerRef.current);
          return;
        }
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setPhase("review");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [phase]);

  const finishExam = useCallback(() => {
    clearInterval(timerRef.current);
    clearInterval(saveTimerRef.current);
    setPhase("review");
  }, []);

  const globalStyles = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      * { box-sizing: border-box; }
      button { font-family: inherit; }
      .start-btn:hover { transform: translateY(-2px); }
      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
    `}</style>
  );

  if (phase === "loading")
    return (
      <>
        {globalStyles}
        <div
          style={{
            minHeight: "100vh",
            background: "linear-gradient(145deg, #0a0e1a 0%, #121930 50%, #0d1224 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'DM Sans', system-ui, sans-serif",
          }}
        >
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 16 }}>Loading...</div>
        </div>
      </>
    );
  if (phase === "start")
    return (
      <>
        {globalStyles}
        <StartScreen onStart={startExam} />
      </>
    );
  if (phase === "review")
    return (
      <>
        {globalStyles}
        <ReviewScreen
          questions={questions}
          answers={answers}
          flagged={Array.from(flagged)}
          onRetry={startExam}
          onBackToStart={() => setPhase("start")}
        />
      </>
    );

  const q = questions[currentQ];
  const answeredCount = Object.keys(answers).length;
  const isUrgent = timeLeft < 300;
  const progress = ((currentQ + 1) / questions.length) * 100;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(145deg, #0a0e1a 0%, #121930 50%, #0d1224 100%)",
        fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(10,14,26,0.9)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div
          style={{
            maxWidth: 820,
            margin: "0 auto",
            padding: "12px clamp(16px, 4vw, 24px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span
              role="timer"
              aria-live="off"
              aria-label={`Time remaining: ${formatTime(timeLeft)}`}
              style={{
                color: isUrgent ? "#f87171" : "rgba(255,255,255,0.7)",
                fontWeight: 700,
                fontSize: 18,
                fontVariantNumeric: "tabular-nums",
                animation: isUrgent ? "pulse 1s infinite" : "none",
              }}
            >
              {formatTime(timeLeft)}
            </span>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
              {answeredCount}/{questions.length} answered
            </span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setShowNav(!showNav)}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8,
                padding: "8px 14px",
                color: "rgba(255,255,255,0.6)",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Overview
            </button>
            <button
              onClick={finishExam}
              style={{
                background:
                  answeredCount === questions.length
                    ? "linear-gradient(135deg, #3182ce, #2563eb)"
                    : "rgba(255,255,255,0.04)",
                border:
                  answeredCount === questions.length ? "none" : "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8,
                padding: "8px 14px",
                color: answeredCount === questions.length ? "#fff" : "rgba(255,255,255,0.5)",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Submit
            </button>
          </div>
        </div>
        <div style={{ height: 2, background: "rgba(255,255,255,0.03)" }}>
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #3182ce, #63b3ed)",
              transition: "width 0.3s",
            }}
          />
        </div>
      </div>

      {showNav && (
        <div
          role="dialog"
          aria-label="Question Navigator"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={() => setShowNav(false)}
        >
          <div
            style={{
              background: "#121930",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
              padding: 28,
              maxWidth: 520,
              width: "100%",
              maxHeight: "80vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h3 style={{ color: "#fff", margin: 0, fontSize: 18 }}>Question Navigator</h3>
              <button
                onClick={() => setShowNav(false)}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "none",
                  borderRadius: 8,
                  padding: "6px 12px",
                  color: "rgba(255,255,255,0.5)",
                  cursor: "pointer",
                  fontSize: 18,
                }}
              >
                ×
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 6 }}>
              {questions.map((_, i) => {
                const ans = answers[i] !== undefined,
                  cur = i === currentQ,
                  fl = flagged.has(i);
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentQ(i);
                      setShowNav(false);
                    }}
                    style={{
                      width: "100%",
                      aspectRatio: "1",
                      borderRadius: 8,
                      border: cur ? "2px solid #63b3ed" : "1px solid rgba(255,255,255,0.06)",
                      background: ans
                        ? fl
                          ? "rgba(251,191,36,0.15)"
                          : "rgba(99,179,237,0.12)"
                        : "rgba(255,255,255,0.02)",
                      color: ans ? "#fff" : "rgba(255,255,255,0.3)",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    {i + 1}
                    {fl && (
                      <span style={{ position: "absolute", top: -2, right: -2, fontSize: 8 }}>
                        🚩
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11,
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 3,
                    background: "rgba(99,179,237,0.12)",
                    display: "inline-block",
                  }}
                />{" "}
                Answered
              </span>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11,
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 3,
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    display: "inline-block",
                  }}
                />{" "}
                Unanswered
              </span>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11,
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 3,
                    background: "rgba(251,191,36,0.15)",
                    display: "inline-block",
                  }}
                />{" "}
                Flagged
              </span>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          flex: 1,
          padding: "clamp(16px, 4vw, 40px) clamp(16px, 4vw, 24px)",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <QuestionCard
          question={q}
          currentAnswer={answers[currentQ]}
          onAnswer={(ans) => setAnswers((prev) => ({ ...prev, [currentQ]: ans }))}
          index={currentQ}
          total={questions.length}
        />
        <div
          style={{
            maxWidth: 780,
            width: "100%",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            paddingBottom: 24,
          }}
        >
          <button
            aria-label="Previous question"
            onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
            disabled={currentQ === 0}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10,
              padding: "12px 20px",
              color: currentQ === 0 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.6)",
              fontSize: 14,
              fontWeight: 600,
              cursor: currentQ === 0 ? "not-allowed" : "pointer",
            }}
          >
            ← Previous
          </button>
          <button
            aria-label={
              flagged.has(currentQ) ? "Unflag this question" : "Flag this question for review"
            }
            aria-pressed={flagged.has(currentQ)}
            onClick={() => {
              const nf = new Set(flagged);
              if (nf.has(currentQ)) nf.delete(currentQ);
              else nf.add(currentQ);
              setFlagged(nf);
            }}
            style={{
              background: flagged.has(currentQ) ? "rgba(251,191,36,0.1)" : "rgba(255,255,255,0.02)",
              border: flagged.has(currentQ)
                ? "1px solid rgba(251,191,36,0.2)"
                : "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10,
              padding: "12px 16px",
              color: flagged.has(currentQ) ? "#fbbf24" : "rgba(255,255,255,0.4)",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            🚩 {flagged.has(currentQ) ? "Flagged" : "Flag"}
          </button>
          <button
            aria-label="Next question"
            onClick={() => setCurrentQ(Math.min(questions.length - 1, currentQ + 1))}
            disabled={currentQ === questions.length - 1}
            style={{
              background:
                currentQ === questions.length - 1
                  ? "rgba(255,255,255,0.04)"
                  : "linear-gradient(135deg, #3182ce, #2563eb)",
              border:
                currentQ === questions.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
              borderRadius: 10,
              padding: "12px 20px",
              color: currentQ === questions.length - 1 ? "rgba(255,255,255,0.15)" : "#fff",
              fontSize: 14,
              fontWeight: 600,
              cursor: currentQ === questions.length - 1 ? "not-allowed" : "pointer",
            }}
          >
            Next →
          </button>
        </div>
      </div>
      {globalStyles}
    </div>
  );
}
