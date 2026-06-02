const FILTROS = [
  {
    value: 'all',
    label: 'Todas'
  },
  {
    value: 'pending',
    label: 'Pendientes'
  },
  {
    value: 'done',
    label: 'Completadas'
  }
];

export function TaskFilters({ filtroActual, onCambiarFiltro }) {
  return (
    <div className="filter-bar">
      {FILTROS.map(function (filtro) {
        const estaActivo = filtroActual === filtro.value;

        return (
          <button
            key={filtro.value}
            type="button"
            className={`filter-btn ${estaActivo ? 'active' : ''}`}
            onClick={() => onCambiarFiltro(filtro.value)}
          >
            {filtro.label}
          </button>
        );
      })}
    </div>
  );
}