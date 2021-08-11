import Head from 'next/head'
import GameSmall from '../components/game_small'
import styles from '../styles/Home.module.scss'
import getEndpoint from '../lib/endpoints'
import useSWR from 'swr'
import Feed from '../interfaces/feed'
import Schedule from '../interfaces/schedule'

export default function Home() {
  const { data, error } = useSWR('test', getData, { refreshInterval: 1 })
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
        {data.map(game => <GameSmall key={`gwidget_small_${game.gameData.game.pk}`} game={game} />)}
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

async function getData(): Promise<Array<Feed>> {
  let data: Schedule;
  data = await fetch(getEndpoint('schedule', {}) + new URLSearchParams({ sportId: '1' })).then(
    res => res.json()
  )

  let todayGamePks: Array<number> = []
  data.dates[0].games.forEach(game => {
    todayGamePks.push(game.gamePk)
  })

  let games = await Promise.all(todayGamePks.map(gamePk => fetch(getEndpoint('game', { gamePk: gamePk })))).then(
    responses => Promise.all(responses.map(async (res) => await res.json()))
  )

  return games.sort((a, b) => {
    switch ([a.gameData.status.statusCode, b.gameData.status.statusCode]) {
      case ['F', 'S']: {
        return 1
      }
      case ['S', 'F']: {
        return -1
      }
      case ['F', 'PW']: {
        return 1
      }
      case ['PW', 'F']: {
        return -1
      }
      case ['P', 'F']: {
        return -1
      }
      case ['F', 'P']: {
        return 1
      }
      case ['S', 'P']: {
        return -1
      }
      case ['P', 'S']: {
        return 1
      }
    }
    return 0
  })
}