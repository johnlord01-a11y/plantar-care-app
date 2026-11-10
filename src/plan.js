// Clinical content for the Plantar Fasciitis Care app.
//
// Everything a clinician would want to adjust — daily tasks, medication
// protocols, the care guide, shoe list, red flags — lives in this one file,
// separate from the UI components in App.jsx. Edit the words here and the
// app updates everywhere.
//
// Framework: Dr. John Lord's three-part approach to plantar fasciitis care —
//   1. Protect the injured tissue
//   2. Reduce inflammation by hand (massage, range of motion, stretches)
//   3. Keep the body from making as much inflammation (medication, diet,
//      exercise)
// Content is education only, written the way he approaches this in his
// practice. It is not medical advice for any individual reader.

// ---------------------------------------------------------------------------
// Medication protocols (anti-inflammatory plans)
// ---------------------------------------------------------------------------

export const PROTOCOLS = [
  {
    id: 'ibuprofen',
    label: 'Ibuprofen',
    blurb:
      'As prescribed by your doctor, up to three times a day, with food. The schedule sets the framework — pain decides each dose: at every dose time, take it if your heel hurts; if there is no pain, skip that dose.',
  },
  {
    id: 'naproxen',
    label: 'Naproxen',
    blurb:
      'As prescribed by your doctor, twice a day, with food. The schedule sets the framework — pain decides each dose: at every dose time, take it if your heel hurts; if there is no pain, skip that dose.',
  },
  {
    id: 'steroid',
    label: 'Steroid Taper',
    blurb:
      'The step up when an anti-inflammatory is not strong enough. A steroid taper starts at a dose high enough to bring the inflammation down, then steps down as you get better. Take it exactly as prescribed — the day’s dose first thing in the morning, so it does not interfere with sleep.',
  },
  {
    id: 'other',
    label: 'Other (as prescribed)',
    blurb:
      'Whatever anti-inflammatory your primary care doctor prescribed — for example meloxicam, once a day. Follow the schedule you were prescribed: at every dose time, take it if your heel hurts; if there is no pain, skip that dose.',
  },
];

// Medication reminder tasks per protocol. The prescription sets the schedule;
// each individual dose is pain-gated — take it if the heel hurts at that dose
// time, skip it if there is no pain. The steroid taper is the exception: it is
// taken exactly as prescribed, on its own step-down schedule.
const PAIN_GATE_DETAIL = 'Take it if your heel hurts at this dose time; if there is no pain, skip this dose.';
const MED_TASKS = {
  ibuprofen: [
    { id: 'ibu_1', slot: 'morning', title: 'Ibuprofen (1 of 3) — with food', detail: PAIN_GATE_DETAIL, time: '7:30 AM', icon: 'pill' },
    { id: 'ibu_2', slot: 'midday', title: 'Ibuprofen (2 of 3) — with food', detail: PAIN_GATE_DETAIL, time: '1:30 PM', icon: 'pill' },
    { id: 'ibu_3', slot: 'evening', title: 'Ibuprofen (3 of 3) — with food', detail: PAIN_GATE_DETAIL, time: '7:30 PM', icon: 'pill' },
  ],
  naproxen: [
    { id: 'nap_1', slot: 'morning', title: 'Naproxen (1 of 2) — with food', detail: PAIN_GATE_DETAIL, time: '7:30 AM', icon: 'pill' },
    { id: 'nap_2', slot: 'evening', title: 'Naproxen (2 of 2) — with food', detail: PAIN_GATE_DETAIL, time: '7:30 PM', icon: 'pill' },
  ],
  steroid: [
    {
      id: 'steroid_dose',
      slot: 'waking',
      title: 'Steroid taper — today’s dose, exactly as prescribed',
      time: '6:30 AM (Upon Waking)',
      icon: 'pill',
    },
  ],
  other: [
    {
      id: 'other_1',
      slot: 'morning',
      title: 'Your prescribed anti-inflammatory — dose time',
      detail: 'Follow the schedule your doctor prescribed (for example, meloxicam once a day). Take it if your heel hurts at this dose time; if there is no pain, skip this dose.',
      time: '7:30 AM',
      icon: 'pill',
    },
  ],
};

// ---------------------------------------------------------------------------
// Daily plan
// ---------------------------------------------------------------------------

// Builds the full ordered reminder list for a day. The spine is the same for
// every protocol: stretch before the first steps, massage 4x/day, support
// and compression, then the night routine. Medication tasks slot into it.
export function buildTasks(protocolId) {
  const medTasks = MED_TASKS[protocolId] || [];
  const tasks = [];

  const bySlot = (slot) => medTasks.filter((t) => t.slot === slot);

  // Steroid goes in first thing, before everything else.
  tasks.push(...bySlot('waking'));

  tasks.push({
    id: 'stretch_bed',
    title: 'Plantar Fascia Stretch — in bed, before your first steps',
    detail: 'Pull the toes back toward your shin until you feel a stretch in the arch. 6 reps, hold 30 seconds each.',
    time: '6:35 AM',
    icon: 'foot',
  });
  tasks.push({
    id: 'massage_1',
    title: 'Heel Massage & Swelling Removal (1 of 4)',
    detail: 'Work the swelling out from under the heel. Walk on tiptoes to the bathroom first if your heels are sore.',
    time: '6:45 AM',
    icon: 'foot',
  });
  tasks.push({
    id: 'sleeve_morning',
    title: 'Put On Ankle Compression Sleeve',
    time: '7:00 AM',
    icon: 'activity',
  });
  tasks.push({
    id: 'shoes_morning',
    title: 'Stability Shoes & Insoles On — no barefoot on hard floors',
    time: '7:15 AM',
    icon: 'foot',
  });

  // Morning medication dose.
  tasks.push(...bySlot('morning'));

  tasks.push({
    id: 'massage_2',
    title: 'Heel Massage & Swelling Removal (2 of 4)',
    time: '12:00 PM',
    icon: 'foot',
  });
  tasks.push({
    id: 'stretch_calf',
    title: 'Calf Stretches — both legs',
    detail: 'Wall stretch, knee straight then bent. 3 reps each way, hold 30 seconds.',
    time: '12:15 PM',
    icon: 'foot',
  });

  // Midday medication dose (ibuprofen protocols).
  tasks.push(...bySlot('midday'));

  tasks.push({
    id: 'massage_3',
    title: 'Heel Massage & Swelling Removal (3 of 4)',
    time: '4:00 PM',
    icon: 'foot',
  });

  // Evening medication dose.
  tasks.push(...bySlot('evening'));

  tasks.push({
    id: 'massage_4',
    title: 'Heel Massage & Swelling Removal (4 of 4)',
    time: '8:00 PM',
    icon: 'foot',
  });
  tasks.push({
    id: 'stretch_evening',
    title: 'Toe Stretch & Calf Stretch — evening set',
    detail: 'Gentle toe pulls and one more round of calf stretches to finish the day.',
    time: '8:15 PM',
    icon: 'foot',
  });

  tasks.push({
    id: 'night_routine',
    title: 'Night Splint On — or sleep in the compression sleeve',
    time: '9:30 PM',
    icon: 'activity',
  });

  return tasks;
}

// ---------------------------------------------------------------------------
// Care guide content
// ---------------------------------------------------------------------------

export const SHOES = [
  { brand: 'Brooks', models: 'Adrenaline, Addiction' },
  { brand: 'New Balance', models: '860' },
  { brand: 'Asics', models: 'GT-2000, Kayano' },
  { brand: 'Hoka', models: 'Arahi, Gaviota' },
  { brand: 'On Cloud', models: 'Cloudrunner (Stability)' },
];

export const RED_FLAGS = [
  'Numbness, tingling, or burning that is new or getting worse',
  'Pain that started with a fall, twist, or other injury — or you cannot bear weight',
  'Redness, warmth, or fever along with the foot pain',
  'Diabetes or poor circulation — get checked before treating a sore foot on your own',
  'Swelling that keeps increasing instead of settling down',
  'No improvement after 1–2 weeks of following the plan consistently — your anti-inflammatory may not be strong enough, and your doctor may step you up to a stronger one',
];

// How the medication side of the plan unfolds over time: an anti-inflammatory
// gets one to two weeks to prove itself before the doctor steps treatment up.
export const MED_ESCALATION =
  'Give your anti-inflammatory time to work — it should start to take effect within one to two weeks. If you are not improving after one to two weeks, the medication may not be strong enough for the amount of inflammation you have, and it is time to see your doctor about a stronger option. That stronger option is usually a steroidal anti-inflammatory taper: it starts at a high enough dose to improve the inflammation, then you take less and less of it as you get better.';

export const MED_SAFETY =
  'Anti-inflammatory medicines (NSAIDs like ibuprofen and naproxen) can irritate the stomach and stress the kidneys. Take them with food, do not combine two NSAIDs at once, and check with your doctor or pharmacist first if you take blood thinners, have kidney disease or stomach ulcers, are pregnant, or take blood-pressure medication.';

export const DISCLAIMER =
  'Education only. This app reflects how Dr. John Lord, DPM approaches plantar fasciitis care in his practice. It is not medical advice for you personally, and it does not replace your own clinician — talk with them about what is right for you.';
