import Head from 'next/head'
import GameSmall from '../components/game_small'
import styles from '../styles/Home.module.scss'
import getEndpoint from '../lib/endpoints'
import useSWR from 'swr'
import FeedInterface from '../interfaces/feed'
import Schedule from '../interfaces/schedule'

const leagues = [1, 11, 12, 13, 14] // MLB, AAA, AA, HighA, LowA
const leagueNames = ['MLB', 'Triple-A', 'Double-A', 'High-A', 'Low-A', 'Rookie', 'Winter Leagues']
export default function Home() {
  const { data, error } = useSWR('test', getData, { refreshInterval: 10000 })
  let dataElement;
  if (error) {
    console.log(error)
    dataElement = <p>Error</p>
  } else if (!data) {
    dataElement = <div className={styles.loader}><div></div><div></div><div></div><div></div></div>
  } else if (data) {
    dataElement = <>{data.map((league, i: number) => league[0] ? (
      <>
        <h3>{leagueNames[i]}</h3>
        <div className={styles.games}>
          {league.map(game => <GameSmall key={`gwidget_small_${game.gameData.game.pk}`} game={game} />)}
        </div>
      </>
    ) : "")
    }</>
  }
  return (
    <div>
      <Head>
        <title>Latest Baseball scores</title>
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

async function getData(): Promise<Array<Array<FeedInterface>>> {
  const sortFunc = (a: FeedInterface, b: FeedInterface) => {
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
  }

  let data: Schedule[] = await Promise.all(leagues.map(async league => await fetch(getEndpoint('schedule', {}) + new URLSearchParams({ sportId: league.toString() })))).then(
    responses => Promise.all(responses.map(async (res) => await res.json()))
  )

  let gamePks: Array<Array<number>> = data.map(league => league.dates[0] ? league.dates[0].games.map(game => game.gamePk) : [])

  let toReturn = await Promise.all(gamePks.map(async games => {
    return await Promise.all(games.map(gamePk => fetch(getEndpoint('game', { gamePk: gamePk })))).then(
      responses => Promise.all(responses.map(async (res) => await res.json()))
    )
  }))

  return toReturn.map(league => league.sort(sortFunc))
}