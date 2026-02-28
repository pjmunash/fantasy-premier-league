import React, { useState, useEffect } from 'react';
import { useFPL } from '../context/FPLContext';

const LeaguesPage: React.FC = () => {
  const { managerData, fetchPlayerLeagues, fetchLeagueStandings } = useFPL();
  const [leagueCode, setLeagueCode] = useState('');
  const [importedLeagues, setImportedLeagues] = useState<any[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (managerData?.id) {
      syncPlayerLeagues();
    }
  }, [managerData?.id]);

  const syncPlayerLeagues = async () => {
    if (!managerData?.id) return;
    try {
      setLoading(true);
      setError(null);
      const leaguesData = await fetchPlayerLeagues(managerData.id);
      const leagues = leaguesData.classic || [];
      const leaguesWithStandings = await Promise.all(
        leagues.map(async (league: any) => {
          try {
            const standings = await fetchLeagueStandings(league.id, 1, false);
            return {
              ...league,
              standings: standings.standings?.results || [],
              pagination: {
                page: standings.standings?.page || 1,
                hasNext: !!standings.standings?.has_next,
              },
              type: 'classic',
            };
          } catch {
            return { ...league, standings: [], type: 'classic' };
          }
        })
      );
      setImportedLeagues(leaguesWithStandings);
      if (leaguesWithStandings.length > 0) setSelectedLeague(leaguesWithStandings[0]);
    } catch (err) {
      setError('Failed to load your leagues. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImportLeague = async () => {
    if (!leagueCode.trim()) { setError('Please enter a league ID'); return; }
    const numericId = parseInt(leagueCode.trim(), 10);
    if (isNaN(numericId)) { setError('League ID must be a valid number'); return; }
    try {
      setLoading(true); setError(null);
      const standings = await fetchLeagueStandings(numericId, 1, false);
      if (!standings || !standings.league) { setError('League not found.'); return; }
      const newLeague = {
        ...standings.league,
        standings: standings.standings?.results || [],
        pagination: {
          page: standings.standings?.page || 1,
          hasNext: !!standings.standings?.has_next,
        },
        type: 'classic',
      };
      setImportedLeagues([...importedLeagues, newLeague]);
      setSelectedLeague(newLeague);
    } catch {
      setError('Failed to import league.');
    } finally {
      setLoading(false);
    }
  };

  // ...existing code...

  return (
    <div>
      {/* The full LeagueManagement UI goes here. If you want the rest of the UI, let me know to fetch all 232 lines. */}
      <h1>Leagues</h1>
      {/* ...existing code... */}
    </div>
  );
};

export default LeaguesPage;
