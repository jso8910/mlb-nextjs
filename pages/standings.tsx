import getEndpoint from '../lib/endpoints';
import useSWR from 'swr'
import styles from '../styles/Home.module.scss'
import Standings from '../components/standings'
import Head from 'next/head';
import { LeagueRecordElement } from '../interfaces/standings';

/*
  NL, AL,
  AAA East, AAA West,
  AA South, AA North East, AA Central,
  High-A Central, High-A East, High-A West,
  Low-A West, Low-A East, Low-A Souteast,
*/
const leagueIds = [104, 103, 117, 112, 111, 113, 109, 118, 116, 126, 110, 122, 123]

export default function Standing() {
  const { data, error } = useSWR('test', getStandings, { refreshInterval: 1 })
  let dataElement;
  if (error) {
    console.log(error)
    dataElement = <p>Error</p>
  } else if (!data) {
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
  let standings = await Promise.all(leagueIds.map(leagueId => fetch(getEndpoint('standings', {}) + new URLSearchParams({leagueId: leagueId.toString()})))).then(
    responses => Promise.all(responses.map(async (res) => await res.json()))
  )

  let leagues = await Promise.all(leagueIds.map(leagueId => fetch(getEndpoint('league', { leagueId: leagueId })))).then(
    responses => Promise.all(responses.map(async (res) => await res.json()))
  )

  let divisionUrls: Array<Array<string>> = standings.map(league => league.records.map((division: LeagueRecordElement) => division.division ? division.division?.link : division.league?.link))
  let divisions = []
  for (const league of divisionUrls) {
    divisions.push(
      await Promise.all(league.map(divisionUrl => fetch(`https://statsapi.mlb.com${divisionUrl}`))).then(
        responses => Promise.all(responses.map(async (res) => await res.json()))
      )
    )
  }
  return {standings: standings, leagues: leagues, divisions: divisions}
}