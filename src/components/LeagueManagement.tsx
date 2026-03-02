
import React, { useState, useMemo } from 'react';
import { useFPL } from '../context/FPLContext';

const LeagueManagement: React.FC = () => {
  const { leagues, leaguesLoading, leaguesError, refreshLeagues } = useFPL();
  const [selectedType, setSelectedType] = useState<'classic' | 'h2h' | 'cup'>('classic');
  const [selectedLeague, setSelectedLeague] = useState<any | null>(null);

  // Filter leagues by type
  const filteredLeagues = useMemo(() => {
    if (!leagues) return [];
    if (selectedType === 'classic') return leagues.classic || [];
    if (selectedType === 'h2h') return leagues.h2h || [];
    if (selectedType === 'cup') return leagues.cup || [];
    return [];
  }, [leagues, selectedType]);

  // Auto-select first league of type
  React.useEffect(() => {
    if (filteredLeagues.length > 0) {
      setSelectedLeague(filteredLeagues[0]);
    } else {
      setSelectedLeague(null);
    }
  }, [filteredLeagues]);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">League Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Track and compare your progress across all mini-leagues</p>
        </div>
        {!leaguesLoading && filteredLeagues.length > 0 && (
          <button onClick={refreshLeagues} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition text-sm">🔄 Refresh</button>
        )}
      </div>

      {/* Tabs for league types */}
      <div className="mb-6 flex gap-2">
        <button onClick={() => setSelectedType('classic')} className={`px-4 py-2 rounded-t-lg font-semibold transition ${selectedType === 'classic' ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}>Classic</button>
        <button onClick={() => setSelectedType('h2h')} className={`px-4 py-2 rounded-t-lg font-semibold transition ${selectedType === 'h2h' ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}>H2H</button>
        <button onClick={() => setSelectedType('cup')} className={`px-4 py-2 rounded-t-lg font-semibold transition ${selectedType === 'cup' ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}>Cup</button>
      </div>


      {leaguesLoading && (
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
          <div className="animate-spin inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mb-2"></div>
          <p className="text-blue-800 dark:text-blue-300 font-medium">Loading your connected leagues...</p>
        </div>
      )}

      {leaguesError && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 flex items-center justify-between">
          <p className="text-red-800 dark:text-red-300 text-sm">{leaguesError}</p>
          <button onClick={refreshLeagues} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold transition whitespace-nowrap">Retry</button>
        </div>
      )}


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">Your Leagues</h2>
            {filteredLeagues.length > 0 ? (
              <div className="mt-2 space-y-2">
                {filteredLeagues.map(league => (
                  <button key={league.id} onClick={() => setSelectedLeague(league)} className={`w-full p-3 rounded-lg text-left transition border-l-4 ${selectedLeague?.id === league.id ? 'bg-purple-100 dark:bg-purple-900/40 border-purple-500' : 'bg-gray-50 dark:bg-gray-700 border-transparent hover:bg-gray-100 dark:hover:bg-gray-600'}`}>
                    <div className="font-semibold text-sm text-gray-800 dark:text-gray-200">{league.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">ID: {league.id}</div>
                    {league.standings && league.standings.length > 0 && (
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{league.standings.length} members</div>
                    )}
                  </button>
                ))}
              </div>
            ) : !leaguesLoading && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">No leagues found</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">You are not in any {selectedType.toUpperCase()} leagues</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {!selectedLeague ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-2">No league selected</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">Import a league to view standings and comparisons</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">{selectedLeague.name}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">League ID</div>
                    <div className="font-bold text-gray-800 dark:text-gray-200">{selectedLeague.id}</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Members</div>
                    <div className="font-bold text-gray-800 dark:text-gray-200">{selectedLeague.standings?.length || 0}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">League Standings</h3>
                {selectedLeague.standings && selectedLeague.standings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100 dark:bg-gray-700 border-b dark:border-gray-600">
                        <tr>
                          <th className="px-4 py-2 text-left">Rank</th>
                          <th className="px-4 py-2 text-left">Team</th>
                          <th className="px-4 py-2 text-left">Manager</th>
                          <th className="px-4 py-2 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {selectedLeague.standings.map((s: any) => (
                          <tr key={s.entry}>
                            <td className="px-4 py-2">{s.rank}</td>
                            <td className="px-4 py-2">{s.entry_name}</td>
                            <td className="px-4 py-2">{s.player_name}</td>
                            <td className="px-4 py-2 text-right font-semibold">{s.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {selectedLeague.pagination?.hasNext && (
                      <div className="mt-4 flex justify-center">
                        <button
                          onClick={loadMoreStandings}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition text-sm"
                        >
                          Load More
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">No standings available</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeagueManagement;
