import React from "react"
import "./styles.css"
import { FiLogIn } from "react-icons/fi"
import { Link } from "react-router-dom"


const Home = () => {
  return (
    <div id="page-home">
      <div className="content">
        <div className="logo-container">
          <img src={require("../../assets/logo.png")} alt="Logo RFood"/>
          <h1>RFood</h1>
        </div>

        <p>Deixe seu ponto de comida mais conhecido!</p>
        <p>Descubra novos clientes.</p>
        <p>Cadastre seu ponto de comida abaixo</p>

        <Link className="button" to="/create">
          <FiLogIn color="#f0f0f0" size={24} />
          <span>Cadastrar Ponto</span>
        </Link>
      </div>
    </div>
  )
}

export default Home
