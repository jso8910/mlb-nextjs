import styles from '../styles/Home.module.scss'
import FeedInterface, { AllPlayPlayEvent } from '../interfaces/feed';
// import { BALL_WIDTH, FOOT } from '../lib/strike_zone_constants'

function convertDateStringToTimestamp(date: string) {
  return date.replaceAll('-', '').replaceAll('T', '_').replaceAll(':', '').split('.')[0]
}

export default function Plays({ game }: { game: FeedInterface }) {
  const toOrdinalSuffix = (num: number) => {
    const int = num,
      digits = [int % 10, int % 100],
      ordinals = ['st', 'nd', 'rd', 'th'],
      oPattern = [1, 2, 3, 4],
      tPattern = [11, 12, 13, 14, 15, 16, 17, 18, 19];
    return oPattern.includes(digits[0]) && !tPattern.includes(digits[1])
      ? int + ordinals[digits[0] - 1]
      : int + ordinals[3];
  };
  let gameOld = game;
  let gamePlayByPlay = game.liveData.plays
  let balls: number, strikes: number, outs: number;
  let plays = gamePlayByPlay.allPlays

  if (plays[0].about.inning < plays[plays.length -1].about.inning) {
    plays = plays.reverse()
  }

  let runnerDict = gameOld.liveData.linescore.offense
  let runners: Array<String> = []
  for (const base of ["first", "second", "third"]) {
    if (base in runnerDict) {
      runners.push(base)
    }
  }
  return <>{
    plays.map((play, index) => {
      balls = play.count.balls
      strikes = play.count.strikes
      outs = play.count.outs

      let interval: ReturnType<typeof setInterval>;

      let collapseListener = () => {
        let content = document.getElementById(`pitches_${index}`)
        console.log(content?.style.maxHeight)
        if (content?.style.maxHeight && content?.style.maxHeight !== "0px") {
          clearInterval(localStorage.getItem(`pitches_${index}_interval`) as unknown as ReturnType<typeof setInterval>)
          content!.style.maxHeight = "0px";
        } else {
          interval = setInterval(() => (content) && (content.style.maxHeight = content.scrollHeight + "px"), 100);
          localStorage.setItem(`pitches_${index}_interval`, `${interval}`)
          console.log(interval)
        }
      }
      return (
        <div onClick={collapseListener} className={`${styles.cardLight} ${styles.play}`} key={`play_${index}`}>
        <div>
          <p>{play.about.halfInning.charAt(0).toUpperCase() + play.about.halfInning.slice(1)} of {toOrdinalSuffix(play.about.inning)}{play.result.description ? ` — ${play.result.description }` : play.matchup.batter.fullName}</p>
          <div>
            <svg height="22" width="22">
              <circle cx="11" cy="11" r="10" strokeWidth="1" stroke="black" fill={balls >= 1 ? 'yellow' : 'transparent'} />
            </svg>
            <svg height="22" width="22">
              <circle cx="11" cy="11" r="10" strokeWidth="1" stroke="black" fill={balls >= 2 ? 'yellow' : 'transparent'} />
            </svg>
            <svg height="22" width="22">
              <circle cx="11" cy="11" r="10" strokeWidth="1" stroke="black" fill={balls >= 3 ? 'yellow' : 'transparent'} />
            </svg>
          </div>
          <div>
            <svg height="22" width="22">
              <circle cx="11" cy="11" r="10" strokeWidth="1" stroke="black" fill={strikes >= 1 ? 'orange' : 'transparent'} />
            </svg>
            <svg height="22" width="22">
              <circle cx="11" cy="11" r="10" strokeWidth="1" stroke="black" fill={strikes >= 2 ? 'orange' : 'transparent'} />
            </svg>
          </div>
          <div>
            <svg height="22" width="22">
              <circle cx="11" cy="11" r="10" strokeWidth="1" stroke="black" fill={outs >= 1 ? 'red' : 'transparent'} />
            </svg>
            <svg height="22" width="22">
              <circle cx="11" cy="11" r="10" strokeWidth="1" stroke="black" fill={outs >= 2 ? 'red' : 'transparent'} />
            </svg>
          </div>
          <div>
            {index === 0 ? (<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid meet" viewBox="78.03606468133466 83.53300942673016 496.3416517857596 366.3416517857596" width="50" height="50">
              <defs>
                <path d="M325.21 84.53L441.38 200.7L325.21 316.87L209.04 200.7L325.21 84.53Z" id="b2YCI6YlRZ"></path>
                <path d="M195.21 214.53L311.38 330.7L195.21 446.87L79.04 330.7L195.21 214.53Z" id="avI05k38w"></path>
                <path d="M455.21 214.53L571.38 330.7L455.21 446.87L339.04 330.7L455.21 214.53Z" id="cpNV2Weba"></path>
              </defs>
              <g>
                <g>
                  <use xlinkHref="#b2YCI6YlRZ" opacity="1" fill={runners.includes("second") ? 'yellow' : 'lightgrey'} fillOpacity="1"></use>
                </g>
                <g>
                  <use xlinkHref="#avI05k38w" opacity="1" fill={runners.includes("third") ? 'yellow' : 'lightgrey'} fillOpacity="1"></use>
                </g>
                <g>
                  <use xlinkHref="#cpNV2Weba" opacity="1" fill={runners.includes("first") ? 'yellow' : 'lightgrey'} fillOpacity="1"></use>
                </g>
              </g>
            </svg>) : ""}
          </div>
        </div>
        <div id={play === plays[0] ? `pitches_${index}_nohide` : `pitches_${index}`} className={play !== plays[0] ? styles.pitches : styles.currentPitch}>
          {play.playEvents ? play.playEvents.map((pitch: AllPlayPlayEvent, idx: number) => {
            return (
              <div key={`pitch_${idx}`}>
                <span style={{
                    textAlign: 'center',
                    borderRadius: '50%',
                    backgroundColor: pitch.details.ballColor,
                    width: "25px",
                    display: 'inline-block',
                    height: '25px',
                    marginRight: '5px'
                }}>{idx + 1}</span>
                <span>{pitch.details.description}</span>
                <hr />
              </div>
            )
          }) : null}
        </div>
        </div>
      )
    })
  }</>
}
