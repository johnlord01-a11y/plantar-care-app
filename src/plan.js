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
    label: 'Ibuprofen (low dose)',
    blurb:
      'A single low dose with food when pain is at its worst — not an around-the-clock schedule. Follow the package label or your own clinician’s direction.',
  },
  {
    id: 'naproxen',
    label: 'Naproxen (as directed)',
    blurb:
      'If your clinician has put you on naproxen, take it exactly as directed, with food.',
  },
  {
    id: 'steroid',
    label: 'Steroid Taper (as prescribed)',
    blurb:
      'Only as prescribed for you. Take the day’s dose first thing in the morning so it does not interfere with sleep, and finish the taper exactly as directed.',
  },
];

// Medication reminder tasks per protocol. Doses are intentionally framed as
// "the plan your clinician set for you" rather than a standing prescription.
const MED_TASKS = {
  ibuprofen: [
    {
      id: 'ibu_1',
      title: 'Ibuprofen — single low dose with food, only if you need it today',
      time: '7:30 AM',
      icon: 'pill',
    },
  ],
  naproxen: [
    {
      id: 'nap_1',
      title: 'Naproxen — morning dose with food (as directed for you)',
      time: '7:30 AM',
      icon: 'pill',
    },
    {
      id: 'nap_2',
      title: 'Naproxen — evening dose with food (as directed for you)',
      time: '7:30 PM',
      icon: 'pill',
    },
  ],
  steroid: [
    {
      id: 'steroid_dose',
      title: 'Steroid taper — today’s dose, exactly as prescribed',
      time: '6:30 AM (Upon Waking)',
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

  // Steroid goes in first thing, before everything else.
  tasks.push(...medTasks.filter((t) => t.id === 'steroid_dose'));

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

  // Morning medication (non-steroid protocols).
  tasks.push(...medTasks.filter((t) => t.id === 'ibu_1' || t.id === 'nap_1'));

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
  tasks.push({
    id: 'massage_3',
    title: 'Heel Massage & Swelling Removal (3 of 4)',
    time: '4:00 PM',
    icon: 'foot',
  });
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

  // Evening medication (naproxen protocols).
  tasks.push(...medTasks.filter((t) => t.id === 'nap_2'));

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
  'No improvement after 2–3 weeks of following the plan consistently',
];

export const MED_SAFETY =
  'Anti-inflammatory medicines (NSAIDs like ibuprofen and naproxen) can irritate the stomach and stress the kidneys. Take them with food, do not combine two NSAIDs at once, and check with your doctor or pharmacist first if you take blood thinners, have kidney disease or stomach ulcers, are pregnant, or take blood-pressure medication.';

export const DISCLAIMER =
  'Education only. This app reflects how Dr. John Lord, DPM approaches plantar fasciitis care in his practice. It is not medical advice for you personally, and it does not replace your own clinician — talk with them about what is right for you.';
