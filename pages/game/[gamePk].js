import getEndpoint from '../../lib/endpoints';
import useSWR from 'swr'
import Plays from '../../components/plays';
import styles from '../../styles/Home.module.scss'
import Head from 'next/head';
import Boxscore from '../../components/boxscore';

export default function GamePage ({ params }) {
  const { gamePk } = params
  const { data, error } = useSWR([gamePk], getPlayByPlay, { refreshInterval: 100 })
  let dataElement;
  if (error) {
    console.log(error)
    dataElement = <p>Error</p>
  } else if (!data) {
    dataElement = <div className={styles.loader}><div></div><div></div><div></div><div></div></div>
  } else if (data) {
    dataElement = (
      <div className={styles.liveGameContainer}>
        <div className={styles.playByPlayPlays}>
          <Plays game={data[1]} />
        </div>
        <div className={styles.scores}>
          <Boxscore game={data[1]} />
        </div>
      </div>
    )
  }
  return (
    <div>
      <Head>
        <title>Live MLB Game</title>
        <meta name="description" content="MLB website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {dataElement}
    </div>
  )
}

export function getServerSideProps(context) {
  return {
    props: {params: context.params}
  };
}
async function getPlayByPlay(gamePk, timecode=null) {
  let params;
  if (timecode) {
    params = { timecode: timecode }
  } else {
    params = {  }
  }
  let data = await Promise.all([
    fetch(getEndpoint('playByPlay', { 'gamePk': gamePk }) + new URLSearchParams(params)),
    fetch(getEndpoint('game', { 'gamePk': gamePk }) + new URLSearchParams(params)),
  ]).then(
    responses => Promise.all(responses.map(async (res) => await res.json()))
  )
  return data
}