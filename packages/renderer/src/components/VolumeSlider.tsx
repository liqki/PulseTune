function VolumeSlider({
  volume,
  setVolume,
}: {
  volume: number;
  setVolume: (volume: number) => void;
}) {
  return (
    <div>
      <style>
        {`
          @media screen and (-webkit-min-device-pixel-ratio:0) {
            .volume {
              -webkit-appearance: none;
              width: 80px;
              height: 14px;
              border-radius: 1rem;
              transform: rotate(-90deg);
              overflow: hidden;     
              background: linear-gradient(to right, #e5e7eb 0%, #e5e7eb ${volume * 100}%, #374151 ${
          volume * 100
        }%, #374151 100%);         
            }

            .volume::-webkit-slider-runnable-track {
              height: 80px;
              width: 14px;
              -webkit-appearance: none;
            }
          }
        `}
      </style>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={e => setVolume(parseFloat(e.target.value))}
        className="volume"
      />
    </div>
  );
}

export default VolumeSlider;
