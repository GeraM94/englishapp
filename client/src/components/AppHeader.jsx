import { forwardRef } from 'react';

export const AppHeader = forwardRef(function AppHeader(props, ref) {
  return (
    <header ref={ref} className="app-header" {...props}>
      <div className="app-header__content">
        <h1>Entrenador de tiempos verbales</h1>
        <p>Practica la forma correcta del verbo en contexto con ejercicios tipo cloze.</p>
      </div>
    </header>
  );
});
