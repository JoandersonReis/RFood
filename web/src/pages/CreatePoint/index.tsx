import React, { useState, useEffect, ChangeEvent, FormEvent } from "react"
import { FiArrowLeft } from "react-icons/fi"
import { Link, useHistory } from "react-router-dom"
import "./styles.css"
import api from "../../services/api"
import axios from "axios"

import Dropzone from "../components/Dropzone"
import MapView from "../components/MapView"

interface foods {
  id: number,
  name: string,
  image_url: string
}

interface ufs {
  sigla: string,
  nome: string
}

interface Cities {
  nome: string
}

const CreatePoint = () => {
  const history = useHistory()
  const [ foods, setFoods ] = useState<foods[]>([])
  const [ ufs, setUfs ] = useState<ufs[]>([])
  const [ cities, setCities ] = useState<Cities[]>([])
  const [ city, setCity ] = useState<string>("")
  const [ formData, setFormData ] = useState({
    name: "",
    email: "",
    whatsapp: ""
  })
  
  const [ selectedFile, setSelectedFile ] = useState<File>()
  const [ selectedFoods, setSelectedFoods ] = useState<number[]>([])
  const [ selectedUf, setSelectedUf] = useState<string>("AC")
  const [ selectedPosition, setSelectedPosition ] = useState<[number, number]>([0, 0])

  function handleSelectFoods(id: number) {
    const areadyFood = selectedFoods.findIndex(food => food === id)

    if(areadyFood >= 0) {
      const filteredFoods = selectedFoods.filter(food => food !== id)

      setSelectedFoods(filteredFoods)
    } else {
      setSelectedFoods([...selectedFoods, id])
    }
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const {name, value} = event.target

    setFormData({...formData, [name]: value})
  }

  async function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const { name, email, whatsapp } = formData
    const [ latitude, longitude ] = selectedPosition
    const foods = selectedFoods

    const data = new FormData

    data.append("name", name)
    data.append("email", email)
    data.append("whatsapp", whatsapp)
    data.append("latitude", String(latitude))
    data.append("longitude", String(longitude))
    data.append("city", city)
    data.append("foods", foods.join(","))
    data.append("uf", selectedUf)

    if(selectedFile) {
      data.append("image", selectedFile)
    }

    await api.post("/points", data)

    alert("Ponto de Comida criado com sucesso!")
    history.push("/")
  }

  useEffect(() => {
    api.get<foods[]>("/foods").then(response => {
      setFoods(response.data)
    })
  }, [])

  useEffect(() => {
    axios.get<Cities[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
      const filterCities = response.data.map(city => {
        return {
          nome: city.nome
        }
      })

      setCities(filterCities)
    })
  }, [selectedUf])

  useEffect(() => {
    axios.get<ufs[]>("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome").then(response => {
      const filterUfs = response.data.map((uf) => {
        return ({
          sigla: uf.sigla,
          nome: uf.nome
        })
      })

      setUfs(filterUfs)
    })
  }, [])

  return (
    <div id="page-create">
      <header>
        <div className="logo">
          <img src={require("../../assets/logo.png")} alt="Logo RFood"/>
          <h1>RFood</h1>
        </div>
        <Link to="/" className="back">
          <FiArrowLeft size={24} color="#EB7D16" />
          Voltar
        </Link>
      </header>

      <form onSubmit={handleFormSubmit}>
        <h1>Cadastro do Ponto de Comida</h1>

        <Dropzone onSelectedFile={setSelectedFile} />

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome</label>
            <input 
              type="text" 
              id="name" 
              name="name"
              placeholder="Digite o nome da entidade"
              required
              onChange={handleInputChange}
            />
          </div>

          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              placeholder="Digite o E-mail"
              required
              onChange={handleInputChange}
            />
          </div>

          <div className="field">
            <label htmlFor="whatsapp">Whatsapp</label>
            <input 
              type="text" 
              id="whatsapp" 
              name="whatsapp"
              placeholder="Digite o Whatsapp"
              required
              onChange={handleInputChange}
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <MapView onSelectedPosition={setSelectedPosition} selectedPosition={selectedPosition}/>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado(UF)</label>
              <select name="uf" id="uf" onChange={(event) => setSelectedUf(event.target.value)}>
                {ufs.map(uf => (
                  <option key={uf.sigla} value={uf.sigla}>{uf.nome} - {uf.sigla}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select name="city" id="city" onChange={(event) => setCity(event.target.value)}>
                {cities.map(city => (
                  <option key={city.nome} value={city.nome}>{city.nome}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Comidas</h2>
            <span>Seleciona as comidas vendidas</span>
          </legend>

          <div className="foods">
            {foods.map(food => (
              <div 
                className={selectedFoods.includes(food.id)? "food selected": "food"} 
                key={String(food.id)}
                onClick={() => handleSelectFoods(food.id)}
              >
                <img src={food.image_url} alt="foods"/>
                <p>{food.name}</p>
            </div>
            ))}
            
          </div>
        </fieldset>

        <button type="submit" className="button">Cadastrar</button>
      </form>
    </div>
  )
}

export default CreatePoint