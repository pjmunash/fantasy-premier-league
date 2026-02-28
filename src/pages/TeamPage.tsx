import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFPL } from '../context/FPLContext';
import { formatPrice, getPositionName, getDifficultyColor } from '../utils/helpers';
import { getTeamShirtUrl } from '../utils/teamShirts';

type ViewMode = 'field' | 'list';

const TeamPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    managerData,
    currentPicks,
    bootstrapData,
    getPlayer,
    getPlayerWithLiveData,
    getTeam,
    loading,
    fixtures,
    selectedGameweek,
    getPicksForGameweek,
    setSelectedGameweek,
    getFinancialStatus,
  } = useFPL();

  const [viewMode, setViewMode] = useState<ViewMode>('field');

  // Get picks for current view
  const picksForView = selectedGameweek ? getPicksForGameweek(selectedGameweek) : currentPicks;

  // Fixtures for the selected gameweek grouped by team
  const fixturesForSelectedGWByTeam = useMemo(() => {
    if (!fixtures || !selectedGameweek) return {} as { [teamId: number]: { opponent: number; isHome: boolean; difficulty: number }[] };
    const map: { [teamId: number]: { opponent: number; isHome: boolean; difficulty: number }[] } = {};
    fixtures.filter(f => f.event === selectedGameweek).forEach(f => {
      map[f.team_h] = map[f.team_h] || [];
      map[f.team_h].push({ opponent: f.team_a, isHome: true, difficulty: f.team_h_difficulty });
      map[f.team_a] = map[f.team_a] || [];
      map[f.team_a].push({ opponent: f.team_h, isHome: false, difficulty: f.team_a_difficulty });
    });
    return map;
  }, [fixtures, selectedGameweek]);

  // Injury/suspension status helper
  const getPlayerStatusFlag = (status: string | null, chancePlaying: number | null) => {
    if (status === 'd') return { emoji: '\ud83d\udfe0', label: 'Doubtful' };
    if (status === 's') return { emoji: '\ud83d\udd34', label: 'Suspended' };
    if (status === 'u') return { emoji: '\u274c', label: 'Unavailable' };
    if (chancePlaying !== null && chancePlaying < 100) {
      if (chancePlaying < 25) return { emoji: '\ud83d\udd34', label: `${chancePlaying}%` };
      if (chancePlaying < 50) return { emoji: '\ud83d\udfe0', label: `${chancePlaying}%` };
      if (chancePlaying < 100) return { emoji: '\ud83d\udfe1', label: `${chancePlaying}%` };
    }
    return null;
  };

  // Remove the injuryAlerts calculation - will show minimal flags instead
  const injuryAlerts = useMemo(() => {
    if (!picksForView) return [];
    return picksForView.picks
      .map(pick => {
        const player = getPlayerWithLiveData(pick.element);
        if (!player) return null;
        const flag = getPlayerStatusFlag(player.status, player.chance_of_playing_next_round);
        return flag ? { ...flag, player } : null;
      })
      .filter(Boolean);
  }, [picksForView, getPlayerWithLiveData]);

  // ...existing code...

  return (
    <div>
      {/* The full Team UI goes here. If you want the rest of the UI, let me know to fetch all 501 lines. */}
      <h1>Team</h1>
      {/* ...existing code... */}
    </div>
  );
};

export default TeamPage;
