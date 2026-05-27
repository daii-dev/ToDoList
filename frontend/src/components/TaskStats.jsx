export function TaskStats({ estadisticas }) {
  return (
    <div className="stats">
      <div className="stat-chip">
        <span>{estadisticas.total}</span>
        Total
      </div>

      <div className="stat-chip">
        <span>{estadisticas.done}</span>
        Hechas
      </div>

      <div className="stat-chip">
        <span>{estadisticas.pending}</span>
        Pendientes
      </div>
    </div>
  );
}