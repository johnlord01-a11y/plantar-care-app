import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Circle, Calendar, RotateCcw, Pill, 
  Footprints, Activity, ChevronDown, ChevronUp, ExternalLink, ShieldAlert
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('reminders');
  const [medTab, setMedTab] = useState('ibuprofen');
  const [expandedSection, setExpandedSection] = useState('foot');
  const [completedTasks, setCompletedTasks] = useState(() => {
    const saved = localStorage.getItem('plantar_tasks');
    const savedDate = localStorage.getItem('plantar_tasks_date');
    const today = new Date().toDateString();
    
    if (savedDate === today && saved) {
      return JSON.parse(saved);
    }
    return {};
  });

  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem('plantar_tasks', JSON.stringify(completedTasks));
    localStorage.setItem('plantar_tasks_date', today);
  }, [completedTasks]);

  const toggleTask = (id) => {
    setCompletedTasks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const resetDay = () => {
    setCompletedTasks({});
  };

  const getTasks = () => {
    const baseTasks = [];

    if (medTab === 'steroid') {
      baseTasks.push({
        id: 'steroid_dose',
        title: 'Anti-Inflammatory: Steroid Taper Dose',
        time: '6:45 AM (Upon Waking)',
        icon: Pill
      });
      baseTasks.push({
        id: 'massage_1',
        title: 'Heel Massage & Swelling Removal (1 of 4)',
        time: '6:45 AM (Upon Waking)',
        icon: Footprints
      });
    } else {
      baseTasks.push({
        id: 'massage_1',
        title: 'Heel Massage & Swelling Removal (1 of 4)',
        time: '6:45 AM (Upon Waking)',
        icon: Footprints
      });
    }

    baseTasks.push({
      id: 'sleeve_morning',
      title: 'Put On Ankle Compression Sleeve',
      time: '7:00 AM',
      icon: Activity
    });
    baseTasks.push({
      id: 'shoes_morning',
      title: 'Wear Stability Shoes & Orthotics',
      time: '7:15 AM',
      icon: Footprints
    });

    if (medTab === 'ibuprofen') {
      baseTasks.push({ id: 'ibu_1', title: 'Ibuprofen Dose 1 (800 mg with food)', time: '7:30 AM', icon: Pill });
      baseTasks.push({ id: 'massage_2', title: 'Heel Massage (2 of 4)', time: '12:00 PM', icon: Footprints });
      baseTasks.push({ id: 'ibu_2', title: 'Ibuprofen Dose 2 (800 mg with food)', time: '1:30 PM', icon: Pill });
      baseTasks.push({ id: 'massage_3', title: 'Heel Massage (3 of 4)', time: '4:00 PM', icon: Footprints });
      baseTasks.push({ id: 'ibu_3', title: 'Ibuprofen Dose 3 (800 mg with food)', time: '7:30 PM', icon: Pill });
    } else if (medTab === 'naproxen') {
      baseTasks.push({ id: 'nap_1', title: 'Naproxen Dose 1 (500 mg with food)', time: '7:30 AM', icon: Pill });
      baseTasks.push({ id: 'massage_2', title: 'Heel Massage (2 of 4)', time: '12:00 PM', icon: Footprints });
      baseTasks.push({ id: 'massage_3', title: 'Heel Massage (3 of 4)', time: '4:00 PM', icon: Footprints });
      baseTasks.push({ id: 'nap_2', title: 'Naproxen Dose 2 (500 mg with food)', time: '7:30 PM', icon: Pill });
    } else {
      baseTasks.push({ id: 'massage_2', title: 'Heel Massage (2 of 4)', time: '12:00 PM', icon: Footprints });
      baseTasks.push({ id: 'massage_3', title: 'Heel Massage (3 of 4)', time: '4:00 PM', icon: Footprints });
    }

    baseTasks.push({ id: 'massage_4', title: 'Heel Massage (4 of 4)', time: '8:00 PM', icon: Footprints });
    baseTasks.push({ id: 'sleeve_night', title: 'Night Ankle Compression & Splint', time: '9:30 PM', icon: Activity });

    return baseTasks;
  };

  const tasks = getTasks();
  const completedCount = tasks.filter(t => completedTasks[t.id]).length;

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

          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl gap-1">
            <button
              onClick={() => setActiveTab('reminders')}
              className={`py-2 text-sm font-semibold rounded-lg transition ${
                activeTab === 'reminders' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Today's Reminders
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`py-2 text-sm font-semibold rounded-lg transition ${
                activeTab === 'guide' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Care Guide
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 mt-6">
        {activeTab === 'reminders' ? (
          <div className="space-y-4">
            <div className="bg-white border border-teal-200 rounded-2xl p-4 shadow-sm">
              <label className="block text-xs font-bold text-teal-800 uppercase tracking-wider mb-2">
                Select Active Anti-Inflammatory Protocol:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setMedTab('ibuprofen')}
                  className={`py-2 text-xs font-bold rounded-lg transition border ${
                    medTab === 'ibuprofen' 
                      ? 'bg-teal-50 border-teal-500 text-teal-800' 
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Ibuprofen (3x/day)
                </button>
                <button
                  onClick={() => setMedTab('naproxen')}
                  className={`py-2 text-xs font-bold rounded-lg transition border ${
                    medTab === 'naproxen' 
                      ? 'bg-teal-50 border-teal-500 text-teal-800' 
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Naproxen (2x/day)
                </button>
                <button
                  onClick={() => setMedTab('steroid')}
                  className={`py-2 text-xs font-bold rounded-lg transition border ${
                    medTab === 'steroid' 
                      ? 'bg-teal-50 border-teal-500 text-teal-800' 
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Steroid Taper
                </button>
              </div>

              {medTab === 'steroid' && (
                <div className="mt-3 p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900">
                  <strong>Steroid Taper Rule:</strong> Take as soon as you wake up in the morning to prevent interfering with sleep.
                </div>
              )}
            </div>

            <div className="space-y-2.5">
              {tasks.map((task) => {
                const isDone = !!completedTasks[task.id];
                const IconComponent = task.icon;

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
                      <button type="button" className="focus:outline-none">
                        {isDone ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                        ) : (
                          <Circle className="w-6 h-6 text-slate-300" />
                        )}
                      </button>
                      
                      <div>
                        <p className={`text-sm font-semibold ${isDone ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {task.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">{task.time}</p>
                      </div>
                    </div>

                    <IconComponent className={`w-5 h-5 ${isDone ? 'text-slate-300' : 'text-teal-600'}`} />
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-teal-700 text-white rounded-2xl p-5 shadow-sm">
              <h2 className="text-base font-bold flex items-center gap-2">
                <Activity className="w-5 h-5" /> Your Recovery Protocol
              </h2>
              <p className="text-xs text-teal-100 mt-2 leading-relaxed">
                Four pillars to heal plantar fasciitis: support your foot, remove swelling, compress the ankle, and take your anti-inflammatory. Follow each daily.
              </p>
            </div>

            <div className="space-y-3">
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setExpandedSection(expandedSection === 'foot' ? '' : 'foot')}
                  className="w-full p-4 flex items-center justify-between bg-white text-left font-semibold text-slate-800 text-sm"
                >
                  <span className="flex items-center gap-2">
                    <Footprints className="w-4 h-4 text-teal-600" /> 1. Support Your Foot
                  </span>
                  {expandedSection === 'foot' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedSection === 'foot' && (
                  <div className="p-4 border-t border-slate-100 text-xs text-slate-600 space-y-3 leading-relaxed">
                    <p>Wear supportive shoes at all times — avoid walking barefoot, even at home on hard floors.</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse border border-slate-200 text-xs">
                        <thead>
                          <tr className="bg-slate-50">
                            <th className="p-2 border border-slate-200 font-bold">Brand</th>
                            <th className="p-2 border border-slate-200 font-bold">Recommended Models</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr><td className="p-2 border border-slate-200 font-medium">Brooks</td><td className="p-2 border border-slate-200">Adrenaline, Addiction</td></tr>
                          <tr><td className="p-2 border border-slate-200 font-medium">Asics</td><td className="p-2 border border-slate-200">GT-2000, Kayano</td></tr>
                          <tr><td className="p-2 border border-slate-200 font-medium">Hoka</td><td className="p-2 border border-slate-200">Arahi, Gaviota</td></tr>
                          <tr><td className="p-2 border border-slate-200 font-medium">On Cloud</td><td className="p-2 border border-slate-200">Cloudrunner (Stability)</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setExpandedSection(expandedSection === 'massage' ? '' : 'massage')}
                  className="w-full p-4 flex items-center justify-between bg-white text-left font-semibold text-slate-800 text-sm"
                >
                  <span className="flex items-center gap-2">
                    <Footprints className="w-4 h-4 text-amber-600" /> 2. Massage & Swelling Removal
                  </span>
                  {expandedSection === 'massage' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedSection === 'massage' && (
                  <div className="p-4 border-t border-slate-100 text-xs text-slate-600 space-y-2 leading-relaxed">
                    <p><strong>Morning Tip:</strong> Walk on your tiptoes to the bathroom first thing in the morning to avoid stepping directly on swollen heels.</p>
                    <p><strong>Frequency:</strong> Massage swelling from under heels 4 times a day to move fluid out of tissue (15–20 mins per session).</p>
                    <p><strong>Tools:</strong> Hands, percussion massage gun, foot roller, or frozen water bottle.</p>
                  </div>
                )}
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setExpandedSection(expandedSection === 'meds' ? '' : 'meds')}
                  className="w-full p-4 flex items-center justify-between bg-white text-left font-semibold text-slate-800 text-sm"
                >
                  <span className="flex items-center gap-2">
                    <Pill className="w-4 h-4 text-rose-600" /> 3. Anti-Inflammatories
                  </span>
                  {expandedSection === 'meds' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedSection === 'meds' && (
                  <div className="p-4 border-t border-slate-100 text-xs text-slate-600 space-y-3 leading-relaxed">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <strong className="text-slate-800">Ibuprofen Protocol:</strong> 800 mg three times a day. Take with food.
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <strong className="text-slate-800">Naproxen Protocol:</strong> 500 mg twice a day. Take with food.
                    </div>
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900">
                      <strong>Steroid Taper Protocol:</strong> Take dose as early as possible in the morning to prevent interfering with sleep.
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setExpandedSection(expandedSection === 'ancillary' ? '' : 'ancillary')}
                  className="w-full p-4 flex items-center justify-between bg-white text-left font-semibold text-slate-800 text-sm"
                >
                  <span className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-purple-600" /> 4. Ancillary Care & Treatments
                  </span>
                  {expandedSection === 'ancillary' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedSection === 'ancillary' && (
                  <div className="p-4 border-t border-slate-100 text-xs text-slate-600 space-y-4 leading-relaxed">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm mb-1">Dorsal Night Splint</h4>
                      <p>Holds your foot in a gently stretched position while resting, preventing the plantar fascia from tightening up overnight. Wear whenever off your feet — as much as possible, while comfortable.</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-800 text-sm mb-1">Plantar Fascia Stretches</h4>
                      <p>Perform 6 reps, holding each stretch for 30 seconds. Consistent daily stretching keeps fascia flexible and reduces morning pain.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
