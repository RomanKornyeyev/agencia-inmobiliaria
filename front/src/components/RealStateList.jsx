// src/components/RealStateList.js
import React, { useEffect, useState } from "react";
import { getRealState } from "../api/index";

const RealStateList = () => {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const data = await getRealState();
        setHouses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHouses();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1 class="mb-3">Listado de Casas</h1>
      <ul class="list-group">
        {houses.map((house) => (
            <a key={house.id} class="list-group-item" href="#">
              {house.name} - {house.location}
            </a>
          ))}
      </ul>
    </div>     
  );
};

export default RealStateList;
