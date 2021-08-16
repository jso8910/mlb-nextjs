import styles from '../styles/Home.module.scss'
import getEndpoint from '../lib/endpoints'
import Link from 'next/link'
import FeedInterface from '../interfaces/feed'

export default function GameSmall({ game }: { game: FeedInterface }) {
  let runnerDict = game.liveData.linescore.offense
  let runners = []
  for (const base of ["first", "second", "third"]) {
    if (base in runnerDict) {
      runners.push(base)
    }
  }

  let gameInfo;
  let balls = game.liveData.linescore.balls
  let strikes = game.liveData.linescore.strikes
  let outs = game.liveData.linescore.outs
  
  // If the game is currently ongoing then have current game stuff
  let statusCode = game.gameData.status.statusCode.toLowerCase()
  let gameInProgress = !['f', 's', 'p', 'fr', 'co', 'dr', 'di'].includes(statusCode)
  let gameOver = statusCode === 'f'
  if (game.gameData.status.detailedState === "Postponed") {
    console.log(statusCode)
  }
  if (gameInProgress) {
    gameInfo = (
      <div>
        <p>Current inning: {game.liveData.linescore.inningHalf} {game.liveData.linescore.currentInningOrdinal}</p>
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid meet" viewBox="78.03606468133466 83.53300942673016 496.3416517857596 366.3416517857596" width="50" height="50">
          <defs>
            <path d="M325.21 84.53L441.38 200.7L325.21 316.87L209.04 200.7L325.21 84.53Z" id="b2YCI6YlRZ"></path>
            <path d="M195.21 214.53L311.38 330.7L195.21 446.87L79.04 330.7L195.21 214.53Z" id="avI05k38w"></path>
            <path d="M455.21 214.53L571.38 330.7L455.21 446.87L339.04 330.7L455.21 214.53Z" id="cpNV2Weba"></path>
          </defs>
          <g>
            <g>
              <use xlinkHref="#b2YCI6YlRZ" opacity="1" fill={runners.includes("second") ? 'yellow' : 'lightgrey'} fill-opacity="1"></use>
            </g>
            <g>
              <use xlinkHref="#avI05k38w" opacity="1" fill={runners.includes("third") ? 'yellow' : 'lightgrey'} fill-opacity="1"></use>
            </g>
            <g>
              <use xlinkHref="#cpNV2Weba" opacity="1" fill={runners.includes("first") ? 'yellow' : 'lightgrey'} fill-opacity="1"></use>
            </g>
          </g>
        </svg>
        <p>{balls}-{strikes}, {outs} out</p>
      </div>
    )
  }
  return (
  <Link href={`/game/${game.gameData.game.pk}`}>
  <div className={`${styles.card} ${styles.cardClickable}`}>
    <p>Status: {game.gameData.status.detailedState}</p>
    <table className={styles.score}>
      { (gameInProgress || gameOver) && (<thead><tr>
        <th className={styles.table}></th>
        <th className={styles.table}></th>
        <th className={styles.table}>R</th>
        <th className={styles.table}>H</th>
        <th className={styles.table}>E</th>
      </tr></thead>) }
      <tbody>
        <tr>
          <td className={styles.table}>
            <div className={styles.logocontainer}>
              <img width="25px" height="25px" src={getEndpoint('logo', {teamId: game.gameData.teams.away.id})}></img>
            </div>
          </td>
          <td className={styles.table}>{game.gameData.teams.away.name}</td>
          { (gameInProgress || gameOver) && <td className={styles.table}>{game.liveData.linescore.teams.away.runs}</td> }
          { (gameInProgress || gameOver) && <td className={styles.table}>{game.liveData.linescore.teams.away.hits}</td> }
          { (gameInProgress || gameOver) && <td className={styles.table}>{game.liveData.linescore.teams.away.errors}</td> }
        </tr>
        <tr>
          <td className={styles.table}>
            <div className={styles.logocontainer}>
              <img width="25px" height="25px" src={getEndpoint('logo', {teamId: game.gameData.teams.home.id})}></img>
            </div>
          </td>
          <td className={styles.table}>{game.gameData.teams.home.name}</td>
          { (gameInProgress || gameOver) && <td className={styles.table}>{game.liveData.linescore.teams.home.runs}</td> }
          { (gameInProgress || gameOver) && <td className={styles.table}>{game.liveData.linescore.teams.home.hits}</td> }
          { (gameInProgress || gameOver) && <td className={styles.table}> {game.liveData.linescore.teams.home.errors}</td> }
        </tr>
      </tbody>
    </table>
    {gameInfo}
  </div>
  </Link>
  )
}
