import styles from '../styles/Home.module.scss'

export default function Standings({ standings, leagues, divisions }) {
  return (
    <div>
    {
      standings.map(function(e, i) {
        console.log(e)
        return [e, leagues[i], divisions[i]];
      }).map(league => {
        return ( 
        <div className={styles.league}>
          <h2>
            {league[1].leagues[0].name}
          </h2>
          {league[0].records.map((division, i) => {
            return (
              <div className={styles.division}>
                <table border="1" frame="void" rules="rows">
                  <thead>
                    <tr>
                      <th className={styles.centerPaddingTable}>{league[2][i].divisions[0].nameShort}</th>
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
                        <tr>
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
        </div>
        )
      })
    }
    </div>
  )
}