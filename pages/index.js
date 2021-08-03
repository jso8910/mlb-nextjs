import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import getEndpoint from '../lib/endpoints.js'
import useSWR from 'swr'

export default function Home() {
  const { data, error } = useSWR('test', getData)
  let dataElement;
  if (error) {
    console.log(error)
    dataElement = <p>Error</p>
  } else if (!data) {
    // dataElement = <p>Loading...</p>
    dataElement = <div className={styles.loader}><div></div><div></div><div></div><div></div></div>
  } else if (data) {
    dataElement = (
      <div className={styles.games}>
        {data.map(game => {
          let runnerDict = game.liveData.linescore.offense
          let runners = []
          for (const base in ["first", "second", "third"]) {
            if (base in runnerDict) {
              runners.append(base)
          }

          let gameInfo;
          let balls = game.liveData.linescore.balls
          let strikes = game.liveData.linescore.strikes
          let outs = game.liveData.linescore.outs
          
          // If the game is currently ongoing then have current game stuff
          if (game.gameData.status.statusCode.toLowerCase() !== 'f' && game.gameData.status.statusCode.toLowerCase() !== 's' && game.gameData.status.statusCode.toLowerCase() !== 'p') {
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
          <li className={styles.card}>
            <p>Status: {game.gameData.status.detailedState}</p>
            <table className={styles.score}>
              <tr>
                <td>{game.gameData.teams.away.name}</td>
                <td>{game.liveData.linescore.teams.away.runs}</td>
              </tr>
              <tr>
                <td>{game.gameData.teams.home.name}</td>
                <td>{game.liveData.linescore.teams.home.runs}</td>
              </tr>
            </table>
            {gameInfo}
          </li>
      )}})}
      </div>
    )
  }
  return (
    <div>
      <Head>
        <title>Latest MLB scores</title>
        <meta name="description" content="MLB website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles.heading}>
        Games
      </h1>
      {dataElement}
    </div>
  )
}

async function getData() {
  let data;
  await fetch(getEndpoint('schedule') + new URLSearchParams({ sportId: 1 })).then(
    res => res.json()
  ).then(
    json => data = json
  )

  let todayGamePks = []
  data.dates[0].games.forEach(game => {
    todayGamePks.push(game.gamePk)
  })

  let games = await Promise.all(todayGamePks.map(gamePk => fetch(getEndpoint('game', { gamePk: gamePk })))).then(
    responses => Promise.all(responses.map(async (res) => await res.json()))
  )

  return games
}