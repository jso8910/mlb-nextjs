import FeedInterface, { CurrentPlayPlayEvent } from "../interfaces/feed";
import styles from '../styles/Home.module.scss';

export default function StrikeZone({ game, className }: { game: FeedInterface, className: string | undefined }) {
    let currentPlay = game.liveData.plays.currentPlay.playEvents[0]?.pitchData !== undefined ? game.liveData.plays.currentPlay : game.liveData.plays.allPlays[0]
    const FOOT = window.innerWidth > 1100 ? 5.5 : 7                    // Number of vw in a real life foot
    const STRIKEZONE_WIDTH = 17 / 12    // 17 inches in feet
    const BALL_WIDTH = 2.9 / 12         // apprx 2.9 inches +- 0.04
    let events = currentPlay.playEvents
    const VW_PX = window.innerWidth / 100     // Value of 1vw in pixels
    // Workaround for when the hotcoldzones don't exist
    if !(currentPlay.matchup.batterHotColdZones) {
        currentPlay.matchup.batterHotColdZones = [
            "#bbbbbb",
            "#bbbbbb",
            "#bbbbbb",
            "#bbbbbb",
            "#bbbbbb",
            "#bbbbbb",
            "#bbbbbb",
            "#bbbbbb",
            "#bbbbbb",
        ]
    }
    return (
        <div className={`${styles.centerContainer} ${className ? className : ''}`}>
            {/* First, let's form the strike zone */}
            {currentPlay.playEvents[0]?.pitchData !== undefined ?
            <div>
                <div 
                className={styles.grid}
                style={
                    {
                        height: `${(events[0].pitchData!!.strikeZoneTop - events[0].pitchData!!.strikeZoneBottom) * FOOT}vw`,
                        width: `${STRIKEZONE_WIDTH * FOOT}vw`,
                        // display: "inline-block",
                        border: "#ffffff solid 1px",
                        position: 'relative'
                    }
                }>
                    {/* <div style={{position: 'relative'}}> */}
                    {currentPlay.playEvents.map((event, index) => <div
                    key={index}
                    style={{
                        borderRadius: "50%",
                        display: "unset",
                        width: `${BALL_WIDTH * FOOT}vw`,
                        height: `${BALL_WIDTH * FOOT}vw`,
                        backgroundColor: event.details.ballColor,
                        position: 'absolute',
                        // left: `${event.pitchData!!.coordinates.pX * FOOT + STRIKEZONE_WIDTH / 2 * FOOT}px`,
                        // bottom: `${event.pitchData!!.coordinates.pZ * FOOT}px`
                        bottom: `${-BALL_WIDTH / 2 * FOOT - events[0].pitchData!!.strikeZoneBottom * FOOT + event.pitchData!!.coordinates.pZ * FOOT}vw`,
                        left: `${STRIKEZONE_WIDTH / 2 * FOOT - BALL_WIDTH / 2 * FOOT + event.pitchData!!.coordinates.pX * FOOT}vw`,
                        textAlign: 'center'
                    }} ><p style={{fontSize: `${BALL_WIDTH * FOOT * VW_PX / 21}em`}}>{index + 1}</p></div>)}
                    {/* </div> */}
                    <div className={styles.cell} style={{backgroundColor: currentPlay.matchup.batterHotColdZones[0].color}}></div>
                    <div className={styles.cell} style={{backgroundColor: currentPlay.matchup.batterHotColdZones[1].color}}></div>
                    <div className={styles.cell} style={{backgroundColor: currentPlay.matchup.batterHotColdZones[2].color}}></div>
                    <div className={styles.cell} style={{backgroundColor: currentPlay.matchup.batterHotColdZones[3].color}}></div>
                    <div className={styles.cell} style={{backgroundColor: currentPlay.matchup.batterHotColdZones[4].color}}></div>
                    <div className={styles.cell} style={{backgroundColor: currentPlay.matchup.batterHotColdZones[5].color}}></div>
                    <div className={styles.cell} style={{backgroundColor: currentPlay.matchup.batterHotColdZones[6].color}}></div>
                    <div className={styles.cell} style={{backgroundColor: currentPlay.matchup.batterHotColdZones[7].color}}></div>
                    <div className={styles.cell} style={{backgroundColor: currentPlay.matchup.batterHotColdZones[8].color}}></div>

                </div>
            </div> : ""}
        </div>
    )
}
