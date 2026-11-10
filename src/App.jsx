import React, { useState, useEffect } from 'react';
import {
  CheckCircle2, Circle, Calendar, RotateCcw, Pill,
  Footprints, Activity, ChevronDown, ChevronUp, ShieldAlert,
  Sun, Moon, TrendingDown
} from 'lucide-react';
import { PROTOCOLS, buildTasks, SHOES, RED_FLAGS, MED_SAFETY, MED_ESCALATION, DISCLAIMER } from './plan.js';

const ICONS = { pill: Pill, foot: Footprints, activity: Activity };

// Local calendar date as YYYY-MM-DD (avoids UTC rollover surprises).
function dayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function PainPicker({ label, icon: Icon, value, onChange }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mb-1.5">
        <Icon className="w-3.5 h-3.5 text-teal-600" /> {label}
      </p>
      <div className="flex flex-wrap gap-1">
        {Array.from({ length: 11 }, (_, n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(value === n ? null : n)}
            className={`w-8 h-8 rounded-lg text-xs font-bold border transition ${
              value === n
                ? 'bg-teal-600 border-teal-600 text-white'
                : 'bg-white border-slate-200 text-slate-600 hover:border-teal-400'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('today');
  const [expandedSection, setExpandedSection] = useState('protect');
  const [medProtocol, setMedProtocol] = useState(
    () => localStorage.getItem('plantar_med_protocol') || 'ibuprofen'
  );
  const [completedTasks, setCompletedTasks] = useState(() => {
    const saved = localStorage.getItem('plantar_tasks');
    const savedDate = localStorage.getItem('plantar_tasks_date');
    if (savedDate === new Date().toDateString() && saved) {
      return JSON.parse(saved);
    }
    return {};
  });
  const [history, setHistory] = useState(() => loadJSON('plantar_history', {}));

  const tasks = buildTasks(medProtocol);
  const completedCount = tasks.filter((t) => completedTasks[t.id]).length;
  const todayEntry = history[dayKey()] || { am: null, pm: null, done: 0, total: tasks.length };

  useEffect(() => {
    localStorage.setItem('plantar_tasks', JSON.stringify(completedTasks));
    localStorage.setItem('plantar_tasks_date', new Date().toDateString());
  }, [completedTasks]);

  useEffect(() => {
    localStorage.setItem('plantar_med_protocol', medProtocol);
  }, [medProtocol]);

  // Keep today's history entry in step with tasks and pain scores.
  useEffect(() => {
    const key = dayKey();
    setHistory((prev) => {
      const prevEntry = prev[key] || { am: null, pm: null };
      const nextEntry = { ...prevEntry, done: completedCount, total: tasks.length };
      if (
        prevEntry.done === nextEntry.done &&
        prevEntry.total === nextEntry.total &&
        prevEntry.am !== undefined
      ) {
        return prev;
      }
      const next = { ...prev, [key]: nextEntry };
      localStorage.setItem('plantar_history', JSON.stringify(next));
      if (!localStorage.getItem('plantar_start_date')) {
        localStorage.setItem('plantar_start_date', key);
      }
      return next;
    });
  }, [completedCount, tasks.length]);

  const setPain = (which, value) => {
    const key = dayKey();
    setHistory((prev) => {
      const entry = { ...(prev[key] || { am: null, pm: null, done: completedCount, total: tasks.length }) };
      entry[which] = value;
      const next = { ...prev, [key]: entry };
      localStorage.setItem('plantar_history', JSON.stringify(next));
      if (!localStorage.getItem('plantar_start_date')) {
        localStorage.setItem('plantar_start_date', key);
      }
      return next;
    });
  };

  const toggleTask = (id) => {
    setCompletedTasks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const resetDay = () => setCompletedTasks({});

  const activeProtocol = PROTOCOLS.find((p) => p.id === medProtocol) || PROTOCOLS[0];

  // --- Progress figures ------------------------------------------------------
  const startDate = localStorage.getItem('plantar_start_date');
  const dayNumber = startDate
    ? Math.max(1, Math.round((new Date(dayKey()) - new Date(startDate)) / 86400000) + 1)
    : 1;
  const recordedDays = Object.keys(history).filter(
    (k) => (history[k].done || 0) > 0 || history[k].am != null || history[k].pm != null
  ).length;
  const sortedKeys = Object.keys(history).sort();
  const amScores = sortedKeys.map((k) => history[k].am).filter((v) => v != null);
  let improvement = null;
  if (amScores.length >= 4) {
    const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
    const firstAvg = avg(amScores.slice(0, 3));
    const lastAvg = avg(amScores.slice(-3));
    if (firstAvg > 0) improvement = Math.round(((firstAvg - lastAvg) / firstAvg) * 100);
  }
  const recentKeys = [...sortedKeys].slice(-14).reverse();

  const tabButton = (id, label) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`py-2 text-sm font-semibold rounded-lg transition ${
        activeTab === id ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
      }`}
    >
      {label}
    </button>
  );

  const accordion = (id, title, icon, children) => (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <button
        onClick={() => setExpandedSection(expandedSection === id ? '' : id)}
        className="w-full p-4 flex items-center justify-between bg-white text-left font-semibold text-slate-800 text-sm"
      >
        <span className="flex items-center gap-2">{icon} {title}</span>
        {expandedSection === id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {expandedSection === id && (
        <div className="p-4 border-t border-slate-100 text-xs text-slate-600 space-y-3 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12">
      <header className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-teal-600 text-white p-2.5 rounded-xl shadow-sm">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">Plantar Fasciitis Care</h1>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                <span className="text-teal-700 font-semibold">· Day {dayNumber}</span>
              </p>
            </div>
          </div>

          <button
            onClick={resetDay}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
            title="Reset Daily Tasks"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        <div className="max-w-2xl mx-auto mt-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Today's Progress</span>
            <span className="text-teal-700">{completedCount} / {tasks.length} done</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-teal-600 h-full transition-all duration-300"
              style={{ width: `${tasks.length ? (completedCount / tasks.length) * 100 : 0}%` }}
            />
          </div>

          <div className="grid grid-cols-3 p-1 bg-slate-100 rounded-xl gap-1">
            {tabButton('today', "Today's Plan")}
            {tabButton('progress', 'Progress')}
            {tabButton('guide', 'Care Guide')}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 mt-6">
        {activeTab === 'today' && (
          <div className="space-y-4">
            <div className="bg-white border border-teal-200 rounded-2xl p-4 shadow-sm">
              <label className="block text-xs font-bold text-teal-800 uppercase tracking-wider mb-2">
                Your Anti-Inflammatory Plan:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {PROTOCOLS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setMedProtocol(p.id)}
                    className={`py-2 px-1 text-xs font-bold rounded-lg transition border ${
                      medProtocol === p.id
                        ? 'bg-teal-50 border-teal-500 text-teal-800'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-600 leading-relaxed">{activeProtocol.blurb}</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">How does it feel today? (0 = none, 10 = worst)</p>
              <PainPicker
                label="First-step pain this morning"
                icon={Sun}
                value={todayEntry.am}
                onChange={(v) => setPain('am', v)}
              />
              <PainPicker
                label="Pain tonight"
                icon={Moon}
                value={todayEntry.pm}
                onChange={(v) => setPain('pm', v)}
              />
            </div>

            <div className="space-y-2.5">
              {tasks.map((task) => {
                const isDone = !!completedTasks[task.id];
                const IconComponent = ICONS[task.icon] || Footprints;

                return (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border transition cursor-pointer select-none ${
                      isDone
                        ? 'bg-emerald-50/60 border-emerald-200 text-slate-400'
                        : 'bg-white border-slate-200 hover:border-teal-300 text-slate-800 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <span>
                        {isDone ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                        ) : (
                          <Circle className="w-6 h-6 text-slate-300" />
                        )}
                      </span>

                      <div>
                        <p className={`text-sm font-semibold ${isDone ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {task.title}
                        </p>
                        {task.detail && !isDone && (
                          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{task.detail}</p>
                        )}
                        <p className="text-xs text-slate-500 mt-0.5">{task.time}</p>
                      </div>
                    </div>

                    <IconComponent className={`w-5 h-5 shrink-0 ${isDone ? 'text-slate-300' : 'text-teal-600'}`} />
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed px-1">{DISCLAIMER}</p>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-4">
            <div className="bg-teal-700 text-white rounded-2xl p-5 shadow-sm">
              <h2 className="text-base font-bold flex items-center gap-2">
                <TrendingDown className="w-5 h-5" /> Are you getting better?
              </h2>
              <p className="text-xs text-teal-100 mt-2 leading-relaxed">
                You are on <strong>day {dayNumber}</strong> of the plan, with {recordedDays} day{recordedDays === 1 ? '' : 's'} recorded.
                Morning first-step pain is the number that matters most — it is usually the last thing to
                hurt and the clearest sign the tissue is healing.
              </p>
              {improvement != null && (
                <p className="text-sm font-bold mt-3">
                  Your morning pain is down {improvement}% from your first days.
                </p>
              )}
              <p className="text-xs text-teal-100 mt-2 leading-relaxed">
                The yardstick used in the clinic: after <strong>two weeks</strong> of following the plan
                consistently, most people are at least <strong>half better</strong>. If you reach day 14
                and are not clearly improving, that is useful information — bring it to your clinician.
                Your anti-inflammatory may not be strong enough, and a stronger option, often a steroid
                taper, may be the next step.
              </p>
            </div>

            {recentKeys.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 text-sm text-slate-600 shadow-sm">
                Nothing recorded yet. Check off tasks and score your pain on the Today's Plan tab and
                your history will build here, day by day.
              </div>
            ) : (
              <div className="space-y-2">
                {recentKeys.map((key) => {
                  const e = history[key];
                  const pct = e.total ? Math.round(((e.done || 0) / e.total) * 100) : 0;
                  const label = new Date(`${key}T12:00:00`).toLocaleDateString('en-US', {
                    weekday: 'short', month: 'short', day: 'numeric',
                  });
                  return (
                    <div key={key} className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Plan done: {e.done || 0}/{e.total || 0} ({pct}%)
                        </p>
                      </div>
                      <div className="flex gap-2 text-xs font-bold">
                        <span className={`px-2 py-1 rounded-lg ${e.am != null ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-50 text-slate-300 border border-slate-100'}`}>
                          AM {e.am != null ? e.am : '–'}
                        </span>
                        <span className={`px-2 py-1 rounded-lg ${e.pm != null ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-50 text-slate-300 border border-slate-100'}`}>
                          PM {e.pm != null ? e.pm : '–'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <p className="text-[11px] text-slate-400 leading-relaxed px-1">{DISCLAIMER}</p>
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="space-y-4">
            <div className="bg-teal-700 text-white rounded-2xl p-5 shadow-sm">
              <h2 className="text-base font-bold flex items-center gap-2">
                <Activity className="w-5 h-5" /> Protect It. Calm It Down. Keep It From Coming Back.
              </h2>
              <p className="text-xs text-teal-100 mt-2 leading-relaxed">
                Every part of this plan does one of three jobs: protect the injured tissue so it can heal,
                reduce the inflammation in it by hand, and keep your body from making as much inflammation
                in the first place. Do all three, every day.
              </p>
            </div>

            <div className="space-y-3">
              {accordion('protect', '1. Protect the Injured Tissue', <Footprints className="w-4 h-4 text-teal-600" />, (
                <>
                  <p>Wear supportive shoes at all times — avoid walking barefoot, even at home on hard floors. If your clinician put you in a walking boot, wear it as directed.</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse border border-slate-200 text-xs">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="p-2 border border-slate-200 font-bold">Brand</th>
                          <th className="p-2 border border-slate-200 font-bold">Recommended Models</th>
                        </tr>
                      </thead>
                      <tbody>
                        {SHOES.map((s) => (
                          <tr key={s.brand}>
                            <td className="p-2 border border-slate-200 font-medium">{s.brand}</td>
                            <td className="p-2 border border-slate-200">{s.models}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p><strong>Insoles:</strong> a firm over-the-counter arch support makes a real difference — in the clinic we fit PowerStep Pinnacle (high arch or neutral, matched to your foot). Replace them when they pack down.</p>
                  <p><strong>Compression sleeve:</strong> wear it during the day to keep swelling from pooling in the ankle and heel.</p>
                  <p><strong>Night splint:</strong> holds your foot in a gently stretched position while you rest, so the fascia does not tighten up overnight. Wear it whenever you are off your feet, as much as is comfortable — or sleep in the compression sleeve if the splint keeps you awake.</p>
                </>
              ))}

              {accordion('calm', '2. Calm It Down — By Hand', <Footprints className="w-4 h-4 text-amber-600" />, (
                <>
                  <p><strong>Massage:</strong> work the swelling out from under the heel 4 times a day, 15–20 minutes a session. Use your hands, a foot roller, a frozen water bottle, or a percussion massage gun — pressure should be firm but never bruising.</p>
                  <p><strong>Morning tip:</strong> walk on your tiptoes to the bathroom first thing, to avoid stepping flat on swollen heels.</p>
                  <p><strong>Plantar fascia stretch:</strong> before your first steps, pull the toes back toward your shin until you feel the arch stretch. 6 reps, hold 30 seconds each. Repeat any time the heel starts to ache after sitting.</p>
                  <p><strong>Calf stretches:</strong> wall stretch with the knee straight, then bent — 3 reps each way, hold 30 seconds, both legs. Tight calves pull on the heel and keep the fascia loaded.</p>
                  <p><strong>Toe stretches:</strong> gentle toe pulls and spreading, once or twice a day, keeps the front of the foot moving.</p>
                </>
              ))}

              {accordion('prevent', '3. Keep It From Coming Back', <Pill className="w-4 h-4 text-rose-600" />, (
                <>
                  <p><strong>How I approach medication in my practice:</strong> an anti-inflammatory works best as one part of the plan, not the whole plan.</p>
                  {PROTOCOLS.map((p) => (
                    <div key={p.id} className="p-3 bg-slate-50 rounded-lg">
                      <strong className="text-slate-800">{p.label}:</strong> {p.blurb}
                    </div>
                  ))}
                  <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-teal-900">
                    <strong>Give it one to two weeks:</strong> {MED_ESCALATION}
                  </div>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900">
                    <strong>Before you take an NSAID:</strong> {MED_SAFETY}
                  </div>
                  <p><strong>Beyond medication:</strong> inflammation is also driven by the rest of life — extra weight the foot has to carry, poor sleep, and a diet heavy in processed food and sugar all push it up; regular gentle movement and an anti-inflammatory pattern of eating push it down. You do not have to fix all of that at once. Small, steady changes count.</p>
                  <p><strong>Keep the support:</strong> most recurrences start with a quiet return to bare feet and worn-out shoes. Keep the good shoes and insoles in rotation even after the pain is gone.</p>
                </>
              ))}

              {accordion('redflags', 'When to Get Checked', <ShieldAlert className="w-4 h-4 text-red-600" />, (
                <>
                  <p>Plantar fasciitis is common and usually heals with consistent care — but get checked promptly if you have:</p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    {RED_FLAGS.map((flag) => (
                      <li key={flag}>{flag}</li>
                    ))}
                  </ul>
                </>
              ))}
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed px-1">{DISCLAIMER}</p>
          </div>
        )}
      </main>
    </div>
  );
}
