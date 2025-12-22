const ProgressBar = ({ checkpoints }) => {
  if (!Array.isArray(checkpoints)) return null;

  return (
    <div className="progress-track">
      <div className="progress-line" />
      {checkpoints.map((stage, idx) => (
        <div
          key={stage.key}
          className={`checkpoint ${stage.completed ? "completed" : ""}`}
        >
          <div className="checkpoint-circle">
            {stage.completed ? "✓" : idx + 1}
          </div>
          <p className="checkpoint-label">{stage.label}</p>
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;

