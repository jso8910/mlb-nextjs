import styles from '../styles/Home.module.scss'

function convertDateStringToTimestamp(date) {
  return date.replaceAll('-', '').replaceAll('T', '_').replaceAll(':', '').split('.')[0]
}

export default function Plays({ game, setTimestamp }) {
  game = game.liveData.plays
  let balls, strikes, outs;
  let plays = [game.currentPlay];
  plays.push(...game.allPlays)
  return (
    plays.map((play, index) => {
      balls = play.count.balls
      strikes = play.count.strikes
      outs = play.count.outs

      let interval;

      let collapseListener = () => {
        let content = document.getElementById(`pitches_${index}`)
        if (content.style.maxHeight) {
          if (interval) {
            clearInterval(interval)
          }
          content.style.maxHeight = null;
        } else {
          interval = setInterval(() => content.style.maxHeight = content.scrollHeight + "px", 100);
        }
      }

      return (
        <div onClick={collapseListener} className={styles.cardLight} key={`play_${index}`}>
        <div>
          <p>{play.result.description}</p>
          <div>
            <svg height="22" width="22">
              <circle cx="11" cy="11" r="10" stroke-width="1" stroke="black" fill={balls >= 1 && balls !== 4 ? 'yellow' : 'transparent'} />
            </svg>
            <svg height="22" width="22">
              <circle cx="11" cy="11" r="10" stroke-width="1" stroke="black" fill={balls >= 2 && balls !== 4 ? 'yellow' : 'transparent'} />
            </svg>
            <svg height="22" width="22">
              <circle cx="11" cy="11" r="10" stroke-width="1" stroke="black" fill={balls >= 3 && balls !== 4 ? 'yellow' : 'transparent'} />
            </svg>
          </div>
          <div>
            <svg height="22" width="22">
              <circle cx="11" cy="11" r="10" stroke-width="1" stroke="black" fill={strikes >= 1 && strikes !== 3 ? 'orange' : 'transparent'} />
            </svg>
            <svg height="22" width="22">
              <circle cx="11" cy="11" r="10" stroke-width="1" stroke="black" fill={strikes >= 2 && strikes !== 3 ? 'orange' : 'transparent'} />
            </svg>
          </div>
          <div>
            <svg height="22" width="22">
              <circle cx="11" cy="11" r="10" stroke-width="1" stroke="black" fill={outs >= 1 && outs !== 3 ? 'red' : 'transparent'} />
            </svg>
            <svg height="22" width="22">
              <circle cx="11" cy="11" r="10" stroke-width="1" stroke="black" fill={outs >= 2 && outs !== 3 ? 'red' : 'transparent'} />
            </svg>
          </div>
        </div>
        <div id={`pitches_${index}`} className={styles.pitches}>
          {play.playEvents ? play.playEvents.map((pitch, idx) => {
            return (
              <div key={`pitch_${idx}`}>
                <p>{pitch.details.description}</p>
                <hr />
              </div>
            )
          }) : null}
        </div>
        </div>
      )
    })
  )
}