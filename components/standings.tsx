import styles from '../styles/Home.module.scss'
import StandingsInterface, { Record } from '../interfaces/standings';
import League from '../interfaces/league';
import Division from '../interfaces/division';

export default function Standings({ standings, leagues, divisions }: {standings: Array<StandingsInterface>, leagues: Array<League>, divisions: Array<Array<Division>>}) {
  standings = standings.filter(standing => standing.records[0])
  return (
    <div>
    {
      standings.map((e: any, i: number) => {
      return [e, leagues[i], divisions[i]];
      }).map(league => {
        return ( 
        <div className={styles.league} key={i}>
          <h2>
            {league[1].leagues[0].name}
          </h2>
          {league[0].records.map((division: Record, i: number) => {
            return (
              <div className={styles.division} key={i}>
                <table>
                  <thead>
                    <tr>
                      <th className={styles.centerPaddingTable}>{league[2][i].divisions ? league[2][i].divisions[0].nameShort : league[2][i].leagues[0].nameShort}</th>
                      <th className={styles.centerPaddingTable}>W</th>
                      <th className={styles.centerPaddingTable}>L</th>
                      <th className={styles.centerPaddingTable}>PCT</th>
                      <th className={styles.centerPaddingTable}>GB</th>
                      {division.teamRecords[0].wildCardGamesBack && <th className={styles.centerPaddingTable}>WCGB</th>}
                      <th className={styles.centerPaddingTable}>STRK</th>
                    </tr>
                  </thead>
                  <tbody>
                    {division.teamRecords.map(team => {
                      return (
                        <tr key={Math.random()}>
                          <td>{team.team.name}</td>
                          <td className={styles.centerPaddingTable}>{team.leagueRecord.wins}</td>
                          <td className={styles.centerPaddingTable}>{team.leagueRecord.losses}</td>
                          <td className={styles.centerPaddingTable}>{team.leagueRecord.pct}</td>
                          <td className={styles.centerPaddingTable}>{team.gamesBack}</td>
                          {team.wildCardGamesBack && <td className={styles.centerPaddingTable}>{team.wildCardGamesBack}</td>}
                          <td className={styles.centerPaddingTable}>{team.streak.streakCode}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )
          })}
          <hr />
        </div>
        )
      })
    }
    </div>
  )
}
