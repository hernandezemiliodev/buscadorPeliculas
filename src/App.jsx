import { useState } from "react";
import "./App.css";

export default function App() {

  const [texto, setTexto]             = useState("");
  const [resultados, setResultados]   = useState([]);
  const [cargando, setCargando]       = useState(false);
  const [detalle, setDetalle]         = useState(null);
  const [veredicto, setVeredicto]     = useState("");
  const [sinResultados, setSinResultados] = useState(false);

  async function buscar() {
    if (texto === "") {
      alert("Escribe algo");
      return;
    }

    setCargando(true);
    setResultados([]);
    setSinResultados(false);

    const response = await fetch("https://www.omdbapi.com/?apikey=c1d61990&s=" + texto);
    const data = await response.json();

    setCargando(false);

    if (data.Response === "False") {
      setSinResultados(true);
      return;
    }

    setResultados(data.Search);
  }

  async function verDetalle(pelicula) {
    const response = await fetch(
      "https://www.omdbapi.com/?apikey=c1d61990&i=" + pelicula.imdbID + "&plot=full"
    );
    const data = await response.json();
    setDetalle(data);

    const rv = await fetch("http://localhost:3000/comentario?calificacion=" + data.imdbRating);
    const resultado = await rv.json();
    setVeredicto(resultado.comentario);
  }

  function cerrarModal() {
    setDetalle(null);
    setVeredicto("");
  }

  return (
    <div>

      <h1>🎬 Buscador de Películas</h1>

      <div className="buscador">
        <input
          type="text"
          placeholder="Escribe una película"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && buscar()}
        />
        <button onClick={buscar}>Buscar</button>
      </div>

      {cargando && <div className="loader">Buscando...</div>}
      {sinResultados && <p className="sin-resultados">No se encontraron resultados</p>}

      <div className="resultados">
        {resultados.map((pelicula) => (
          <div
            key={pelicula.imdbID}
            className="tarjeta"
            onClick={() => verDetalle(pelicula)}
          >
            <h3>{pelicula.Title}</h3>
            <img
              src={pelicula.Poster !== "N/A" ? pelicula.Poster : "https://via.placeholder.com/200x300?text=Sin+imagen"}
              alt={pelicula.Title}
            />
            <p>Año: {pelicula.Year}</p>
          </div>
        ))}
      </div>

      {detalle && (
        <div className="modal" onClick={(e) => e.target === e.currentTarget && cerrarModal()}>
          <div className="modal-contenido">
            <span className="cerrar" onClick={cerrarModal}>&times;</span>
            <h2>{detalle.Title}</h2>
            <img
              src={detalle.Poster !== "N/A" ? detalle.Poster : "https://via.placeholder.com/200x300"}
              alt={detalle.Title}
            />
            <p><b>Año:</b> {detalle.Year}</p>
            <p><b>Género:</b> {detalle.Genre}</p>
            <p><b>Calificación IMDb:</b> {detalle.imdbRating}</p>
            <p><b>Sinopsis:</b> {detalle.Plot}</p>
            {veredicto && <p><b>💬 Veredicto:</b> {veredicto}</p>}
          </div>
        </div>
      )}

    </div>
  );
}
