// State management & LocalStorage persistence for Justify Solutions module

const STORAGE_KEY = 'intellia_justify_solutions_v1';

export const PHASES = [
  { id: 'wonder', label: 'Wonder', icon: '🔮', num: '01' },
  { id: 'story', label: 'Story', icon: '📐', num: '02' },
  { id: 'stations', label: 'Simulate', icon: '🧪', num: '03' },
  { id: 'practice', label: 'Practice', icon: '🎮', num: '04' },
  { id: 'reflect', label: 'Reflect', icon: '📓', num: '05' },
];

export const INITIAL_STATE = {
  phase: 'intro', // 'intro' | 'wonder' | 'story' | 'stations' | 'practice' | 'reflect' | 'summary'
  xp: 0,
  streak: 0,
  highestStreak: 0,
  completedPhases: [],
  stationsProgress: {
    station1: false,
    station2: false,
    station3: false
  },
  practiceStats: {
    attempted: 0,
    correct: 0,
    currentStreak: 0,
    bestStreak: 0
  },
  reflectionAnswers: {},
  isMuted: false
};

export function loadStoredProgress() {
  if (typeof window === 'undefined') return INITIAL_STATE;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return INITIAL_STATE;
    const parsed = JSON.parse(data);
    return { ...INITIAL_STATE, ...parsed };
  } catch (e) {
    console.error('Error loading progress from storage:', e);
    return INITIAL_STATE;
  }
}

export function saveProgress(state) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving progress to storage:', e);
  }
}

export function progressReducer(state, action) {
  let newState = state;

  switch (action.type) {
    case 'SET_PHASE': {
      newState = { ...state, phase: action.payload };
      break;
    }
    case 'COMPLETE_PHASE': {
      const phaseId = action.payload;
      const completedPhases = state.completedPhases.includes(phaseId)
        ? state.completedPhases
        : [...state.completedPhases, phaseId];
      newState = { ...state, completedPhases };
      break;
    }
    case 'ADD_XP': {
      const xpToAdd = action.payload || 10;
      newState = { ...state, xp: state.xp + xpToAdd };
      break;
    }
    case 'COMPLETE_STATION': {
      const stationKey = action.payload;
      const stationsProgress = {
        ...state.stationsProgress,
        [stationKey]: true
      };
      const allStationsDone = Object.values(stationsProgress).every(Boolean);
      const completedPhases = allStationsDone && !state.completedPhases.includes('stations')
        ? [...state.completedPhases, 'stations']
        : state.completedPhases;

      newState = {
        ...state,
        stationsProgress,
        completedPhases,
        xp: state.xp + 50
      };
      break;
    }
    case 'RECORD_PRACTICE': {
      const { isCorrect } = action.payload;
      const newStreak = isCorrect ? state.practiceStats.currentStreak + 1 : 0;
      const bestStreak = Math.max(state.practiceStats.bestStreak, newStreak);
      const xpGain = isCorrect ? (15 + newStreak * 5) : 5;

      newState = {
        ...state,
        xp: state.xp + xpGain,
        streak: newStreak,
        highestStreak: Math.max(state.highestStreak, newStreak),
        practiceStats: {
          attempted: state.practiceStats.attempted + 1,
          correct: state.practiceStats.correct + (isCorrect ? 1 : 0),
          currentStreak: newStreak,
          bestStreak
        }
      };
      break;
    }
    case 'SAVE_REFLECTION': {
      newState = {
        ...state,
        reflectionAnswers: { ...state.reflectionAnswers, ...action.payload },
        xp: state.xp + 40
      };
      break;
    }
    case 'TOGGLE_MUTE': {
      newState = { ...state, isMuted: !state.isMuted };
      break;
    }
    case 'RESET_ALL': {
      newState = { ...INITIAL_STATE };
      break;
    }
    default:
      return state;
  }

  saveProgress(newState);
  return newState;
}
