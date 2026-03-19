import React from 'react';
import './index.css'; 
import Navbar from './components/navbar';

// 1. PRIMERO LAS IMPORTACIONES DE LAS FOTOS
import pro1 from './Assets/pro1.png';
import pro2 from './Assets/pro2.png';
import pro3 from './Assets/pro3.png';

// 2. AQUÍ VA EL ARRAY (AFUERA DE LA FUNCIÓN)
const acciones = [
  { 
    id: 1, 
    titulo: "Campaña Útiles Escolares", 
    desc: "Entrega de kits para el inicio de clases en Yerba Buena.",
    imagen: pro1 
  },
  { 
    id: 2, 
    titulo: "Colecta Tucumán", 
    desc: "Recaudación de alimentos y ropa para familias que más lo necesitan.",
    imagen: pro2
  },
  { 
    id: 3, 
    titulo: "Talleres Comunitarios", 
    desc: "Espacios de aprendizaje y contención en Lola Mora y Brasil.",
    imagen: pro3
  }
];

// 3. EMPIEZA LA FUNCIÓN QUE DIBUJA LA WEB
function App() {
  return (
    <div className="App">
      <Navbar />
      
      <header className="hero">
        <div className="hero-content">
          <h1>Fundación Construir Juntos</h1>
          <p>Transformando realidades en Yerba Buena</p>
        </div>
      </header>

{/* Sección de Acciones: Cambiamos 'grid' por 'flex-col' */}
<section className="section bg-grey">
  <h2 className="section-title">Nuestras Últimas Acciones</h2>
  <div className="flex-col"> {/* <--- NUEVO NOMBRE DE CLASE */}
    {acciones.map((item) => (
      <div key={item.id} className="card-wide"> {/* <--- NUEVO NOMBRE DE CLASE */}
        <img src={item.imagen} alt={item.titulo} className="card-wide-img" />
        <div className="card-wide-content"> {/* Contenedor para el texto */}
          <h3>{item.titulo}</h3>
          <p>{item.desc}</p>
          <a href="#mas-info" className="btn-small">Leer más</a>
        </div>
      </div>
    ))}
  </div>
</section>

      <footer className="footer">
        <p>© 2026 Fundación Construir Juntos - Tucumán</p>
      </footer>
    </div>
  );
}

export default App;