import getEndpoint from '../lib/endpoints';
import useSWR from 'swr'
import styles from '../styles/Home.module.scss'
import Standings from '../components/standings'
import Head from 'next/head';

export default function Standing() {
  const { data, error } = useSWR('test', getStandings, { refreshInterval: 1 })
  let dataElement;
  if (error) {
    console.log(error)
    dataElement = <p>Error</p>
  } else if (!data) {
    // dataElement = <p>Loading...</p>
    dataElement = <div className={styles.loader}><div></div><div></div><div></div><div></div></div>
  } else if (data) {
    dataElement = (
      <div>
        <Standings key={`standingwidget`} standings={data.standings} leagues={data.leagues} divisions={data.divisions} />
      </div>
    )
  }

  return (
    <div>
      <Head>
        <title>Standings</title>
        <meta name="description" content="MLB website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {dataElement}
    </div>
  )
}

async function getStandings() {
  let standings = await Promise.all([104, 103].map(leagueId => fetch(getEndpoint('standings') + new URLSearchParams({leagueId: leagueId})))).then(
    responses => Promise.all(responses.map(async (res) => await res.json()))
  )

  let leagues = await Promise.all([104, 103].map(leagueId => fetch(getEndpoint('league', { leagueId: leagueId })))).then(
    responses => Promise.all(responses.map(async (res) => await res.json()))
  )

  let divisions = await Promise.all(standings.map(async league => await Promise.all(league.records.map(divison => fetch(`https://statsapi.mlb.com${divison.division.link}`))).then(
    responses => Promise.all(responses.map(async (res) => await res.json()))
  )))

  return {standings: standings, leagues: leagues, divisions: divisions}
}