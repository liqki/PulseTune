import { formatTime } from "../util/helpers";

function Timeline({
  player,
  currentTime,
  setNewTime,
}: {
  player: HTMLAudioElement | null;
  currentTime: number;
  setNewTime: (time: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      <style>
        {`
          @media screen and (-webkit-min-device-pixel-ratio:0) {
            .timeline {
              overflow: hidden;
              -webkit-appearance: none;
            }
            
            .timeline::-webkit-slider-runnable-track {
              height: 10px;
              -webkit-appearance: none;
              margin-top: -1px;
            }
            
            .timeline::-webkit-slider-thumb {
              width: 1px;
              -webkit-appearance: none;
              height: 1px;
              box-shadow: -240px 0 0 240px #e5e7eb;
            }
          }
        `}
      </style>
      <p>{formatTime(currentTime)}</p>
      <input
        type="range"
        min={0}
        max={player && !Number.isNaN(player.duration) ? player.duration : 0}
        value={currentTime}
        onChange={e => {
          if (!player) return;
          setNewTime(Number(e.target.value));
        }}
        className="w-60 h-1 bg-gray-200 dark:bg-gray-700 rounded-full outline-none timeline"
      />
      <p>{player && !Number.isNaN(player.duration) ? formatTime(player.duration) : "0:00"}</p>
    </div>
  );
}

export default Timeline;
