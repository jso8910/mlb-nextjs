import styles from '../styles/Home.module.scss'
import FeedInterface, { Batting } from '../interfaces/feed';

export default function Boxscore({ game }: { game: FeedInterface }) {
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

      {[boxscore.teams.away, boxscore.teams.home].map(team => {
        return (
          <table className={styles.awayBoxscore}>
        <thead>
          <tr>
            <th className={styles.nameBoxscore}>{team.team.name}</th>
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
          {team.batters.sort((a: number, b: number) => {
            let playerA = team.players[`ID${a}`]
            let playerB = team.players[`ID${b}`]

            if (playerA.battingOrder! < playerB.battingOrder!) {
              return -1
            } else if (playerA.battingOrder! > playerB.battingOrder!) {
              return 1
            } else {
              return 0
            }
          }).map((id: number) => {
            let playerId = `ID${id}`
            let player = team.players[playerId]
            return (
              <tr>
                <td className={styles.nameBoxscore} style={{textIndent: player.gameStatus.isSubstitute ? '20px' : '0px'}}>{player.gameStatus.isSubstitute ? '' : String(player.battingOrder).charAt(0)} {player.person.fullName}, {player.position.abbreviation}</td>
                <td className={styles.centerPaddingTable}>{(player.stats.batting as Batting).atBats}</td>
                <td className={styles.centerPaddingTable}>{(player.stats.batting as Batting).runs}</td>
                <td className={styles.centerPaddingTable}>{(player.stats.batting as Batting).hits}</td>
                <td className={styles.centerPaddingTable}>{(player.stats.batting as Batting).rbi}</td>
                <td className={styles.centerPaddingTable}>{(player.stats.batting as Batting).baseOnBalls}</td>
                <td className={styles.centerPaddingTable}>{(player.stats.batting as Batting).strikeOuts}</td>
                <td className={styles.centerPaddingTable}>{(player.stats.batting as Batting).leftOnBase}</td>
                <td className={styles.centerPaddingTable}>{player.seasonStats.batting.avg}</td>
                <td className={styles.centerPaddingTable}>{player.seasonStats.batting.ops}</td>
              </tr>
            )
          })}
          <tr>
            <td className={styles.nameBoxscore}>TOTALS</td>
            <td className={styles.centerPaddingTable}>{team.teamStats.batting.atBats}</td>
            <td className={styles.centerPaddingTable}>{team.teamStats.batting.runs}</td>
            <td className={styles.centerPaddingTable}>{team.teamStats.batting.hits}</td>
            <td className={styles.centerPaddingTable}>{team.teamStats.batting.rbi}</td>
            <td className={styles.centerPaddingTable}>{team.teamStats.batting.baseOnBalls}</td>
            <td className={styles.centerPaddingTable}>{team.teamStats.batting.strikeOuts}</td>
            <td className={styles.centerPaddingTable}>{team.teamStats.batting.leftOnBase}</td>
          </tr>
        </tbody>
      </table>
        )})}
    </div> 
  )
}