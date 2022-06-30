import getEndpoint from '../../lib/endpoints';
import useSWR from 'swr'
import Plays from '../../components/plays';
import styles from '../../styles/Home.module.scss'
import Head from 'next/head';
import Boxscore from '../../components/boxscore';
import { GetServerSidePropsContext } from 'next';
import StrikeZone from '../../components/strike_zone';

export default function GamePage ({ params }: { params: { gamePk: number } }) {
  const { gamePk } = params
  const { data, error } = useSWR([gamePk], getPlayByPlay, { refreshInterval: 5000 })
  let dataElement;
  let title;

  if (error) {
    title = 'Live MLB Game'
    console.log(error)
    dataElement = <p>Error</p>
  } else if (!data) {
    title = 'Live MLB Game'
    dataElement = <div className={styles.loader}><div></div><div></div><div></div><div></div></div>
  } else if (data) {
    title = `${data[1].gameData.teams.away.name} at ${data[1].gameData.teams.home.name} — Live Baseball Game`
    const playByPlayOnClick = () => {
      (document.getElementsByClassName(styles.playByPlayPlays) as HTMLCollectionOf<HTMLElement>)[0].style.display = 'block';
      // (document.getElementsByClassName(styles.playByPlayPlays) as HTMLCollectionOf<HTMLElement>)[1].style.display = 'none';
      (document.getElementsByClassName(styles.scores) as HTMLCollectionOf<HTMLElement>)[0].style.display = 'none';
      document.getElementById('playByPlayBTN')?.classList.add(styles.buttonActive);
      document.getElementById('boxscoreBTN')?.classList.remove(styles.buttonActive);
    }

    const boxScoreOnClick = () => {
      (document.getElementsByClassName(styles.playByPlayPlays) as HTMLCollectionOf<HTMLElement>)[0].style.display = 'none';
      // (document.getElementsByClassName(styles.playByPlayPlays) as HTMLCollectionOf<HTMLElement>)[1].style.display = 'block';
      (document.getElementsByClassName("boxscore") as HTMLCollectionOf<HTMLElement>)[0].style.display = 'block';
      document.getElementById('playByPlayBTN')?.classList.remove(styles.buttonActive);
      document.getElementById('boxscoreBTN')?.classList.add(styles.buttonActive);
    }
    dataElement = (
      <div className={styles.liveGameContainer}>
        {data[1].liveData.plays.currentPlay ? (<>
        <StrikeZone game={data[1]} className={styles.strikeMobile}/>
        <div className={styles.centerButtons}>
          <div id="playByPlayBTN" onClick={playByPlayOnClick} className={`${styles.changeButton} ${styles.buttonActive}`}>Plays</div>
          <div id="boxscoreBTN" onClick={boxScoreOnClick} className={styles.changeButton}>Boxscore</div>
        </div>
        <div className={styles.playByPlayPlays}>
          <Plays game={data[1]} />
        </div>
        <StrikeZone game={data[1]} className={styles.strikeMain}/>
        <Boxscore game={data[1]} />
        </>) : (
          <div className={styles.scores}>
            <h2>{data[1].gameData.teams.away.name} at {data[1].gameData.teams.home.name}</h2>
            <p>Game Status: {data[1].gameData.status.detailedState}</p>
            <strong>{data[1].gameData.teams.away.name} pitcher: {data[1].gameData.probablePitchers.away.fullName}</strong>
            <strong>{data[1].gameData.teams.home.name} pitcher: {data[1].gameData.probablePitchers.home.fullName}</strong>
          </div>
        )
        }
      </div>
    )
  }
  return (
    <div className={styles.gameContainer}>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="MLB website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {dataElement}
    </div>
  )
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {params: context.params}
  };
}
async function getPlayByPlay(gamePk: string, timecode=null) {
  let params;
  if (timecode) {
    params = { timecode: timecode }
  } else {
    params = {  }
  }
  let data = await Promise.all([
    // @ts-ignore
    fetch(getEndpoint('playByPlay', { 'gamePk': gamePk }) + new URLSearchParams(params)),
    // @ts-ignore
    fetch(getEndpoint('game', { 'gamePk': gamePk }) + new URLSearchParams(params)),
  ]).then(
    responses => Promise.all(responses.map(async (res) => await res.json()))
  )
  return data
}
