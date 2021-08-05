import styles from '../styles/Home.module.scss'

export default function Boxscore({ game }) {
  let boxscore = game.liveData.boxscore;
  let linescore = game.liveData.linescore
  return (
    <div className={`${styles.cardLight} ${styles.inGameScores}`}>
      <table className={styles.tableInlineBlock}>
        <thead>
          <tr>
            <th>{game.gameData.status.codedGameState === 'F' ? 'Final' : linescore.currentInningOrdinal}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{game.gameData.teams.away.name}</td>
          </tr>
          <tr>
              <td>{game.gameData.teams.home.name}</td>
          </tr>
        </tbody>
      </table>
      <table className={`${styles.tableInlineBlock} ${styles.tableLinescore}`}>
        <thead>
          <tr>
            {linescore.scheduledInnings >= linescore.currentInning ? [...Array(linescore.scheduledInnings )].map((_, i) => {
              return (
                <>
                  <th>{i + 1}</th>
                </>
              )
            } ) : [...Array(linescore.currentInning)].map((_, i) => {
              return (
                <>
                  <th>{i + 1}</th>
                </>
              )
            })}
          </tr>
        </thead>
        <tbody>
          <tr>
          {linescore.innings.map(inning => {
              return (
                <>
                  <td className={styles.smallPadding}>{inning.away.runs}</td>
                </>
              )
            })}
          </tr>
          <tr>
          {linescore.innings.map(inning => {
              return (
                <>
                  <td className={styles.smallPadding}>{(inning.home.runs === undefined && game.gameData.status.codedGameState === 'F') ? 'x' : inning.home.runs }</td>
                </>
              )
            })}
          </tr>
        </tbody>
      </table>
      <table className={styles.tableInlineBlock}>
        <thead>
          <tr>
            <th>R</th>
            <th>H</th>
            <th>E</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{linescore.teams.away.runs}</td>
            <td>{linescore.teams.away.hits}</td>
            <td>{linescore.teams.away.errors}</td>
          </tr>
          <tr>
            <td>{linescore.teams.home.runs}</td>
            <td>{linescore.teams.home.hits}</td>
            <td>{linescore.teams.home.errors}</td>
          </tr>
        </tbody>
      </table>

      {["away", "home"].map(team => {
        return (
          <table className={styles.awayBoxscore} border='1' frame='hsides' rules='rows'>
        <thead>
          <tr>
            <th className={styles.nameBoxscore}>{boxscore.teams[team].team.name}</th>
            <th className={styles.centerPaddingTable}>AB</th>
            <th className={styles.centerPaddingTable}>R</th>
            <th className={styles.centerPaddingTable}>H</th>
            <th className={styles.centerPaddingTable}>RBI</th>
            <th className={styles.centerPaddingTable}>BB</th>
            <th className={styles.centerPaddingTable}>SO</th>
            <th className={styles.centerPaddingTable}>LOB</th>
            <th className={styles.centerPaddingTable}>AVG</th>
            <th className={styles.centerPaddingTable}>OPS</th>
          </tr>
        </thead>
        <tbody>
          {boxscore.teams[team].batters.sort((a, b) => {
            console.log(a, b)
            console.log(boxscore.teams[team].players)
            let playerA = boxscore.teams[team].players[`ID${a}`]
            let playerB = boxscore.teams[team].players[`ID${b}`]

            if (playerA.battingOrder < playerB.battingOrder) {
              return -1
            } else if (playerA.battingOrder > playerB.battingOrder) {
              return 1
            } else {
              return 0
            }
          }).map(playerId => {
            playerId = `ID${playerId}`
            let player = boxscore.teams[team].players[playerId]
            return (
              <tr>
                <td className={styles.nameBoxscore} style={{textIndent: player.gameStatus.isSubstitute ? '20px' : '0px'}}>{player.gameStatus.isSubstitute ? '' : String(player.battingOrder).charAt(0)} {player.person.fullName}, {player.position.abbreviation}</td>
                <td className={styles.centerPaddingTable}>{player.stats.batting.atBats}</td>
                <td className={styles.centerPaddingTable}>{player.stats.batting.runs}</td>
                <td className={styles.centerPaddingTable}>{player.stats.batting.hits}</td>
                <td className={styles.centerPaddingTable}>{player.stats.batting.rbi}</td>
                <td className={styles.centerPaddingTable}>{player.stats.batting.baseOnBalls}</td>
                <td className={styles.centerPaddingTable}>{player.stats.batting.strikeOuts}</td>
                <td className={styles.centerPaddingTable}>{player.stats.batting.leftOnBase}</td>
                <td className={styles.centerPaddingTable}>{player.seasonStats.batting.avg}</td>
                <td className={styles.centerPaddingTable}>{player.seasonStats.batting.ops}</td>
              </tr>
            )
          })}
          <tr>
            <td className={styles.nameBoxscore}>TOTALS</td>
            <td className={styles.centerPaddingTable}>{boxscore.teams[team].teamStats.batting.atBats}</td>
            <td className={styles.centerPaddingTable}>{boxscore.teams[team].teamStats.batting.runs}</td>
            <td className={styles.centerPaddingTable}>{boxscore.teams[team].teamStats.batting.hits}</td>
            <td className={styles.centerPaddingTable}>{boxscore.teams[team].teamStats.batting.rbi}</td>
            <td className={styles.centerPaddingTable}>{boxscore.teams[team].teamStats.batting.baseOnBalls}</td>
            <td className={styles.centerPaddingTable}>{boxscore.teams[team].teamStats.batting.strikeOuts}</td>
            <td className={styles.centerPaddingTable}>{boxscore.teams[team].teamStats.batting.leftOnBase}</td>
          </tr>
        </tbody>
      </table>
        )})}
    </div> 
  )
}