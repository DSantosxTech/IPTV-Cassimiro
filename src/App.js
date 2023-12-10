import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import axios from 'axios';
import Sidebar from 'react-sidebar';
import './App.css';

// Importa o parser de arquivos M3U8
const M3U8FileParser = require('m3u8-file-parser');
const reader = new M3U8FileParser();

const App = () => {
  // Estados para armazenar a lista de canais, a URL do canal escolhido, o nome do canal, o valor da busca, os canais filtrados e o status do Sidebar
  const [listaCanais, setListaCanais] = useState([]);
  const [urlCanalEscolhido, setUrlCanalEscolhido] = useState('');
  const [nomeCanal, setNomeCanal] = useState('');
  const [value, setValue] = useState('');
  const [canaisFiltrados, setCanaisFiltrados] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);

  // Efeito para carregar a lista de canais ao montar o componente
  useEffect(() => {
    const getCanais = async () => {
      try {
        // Obtém a lista de canais da URL fornecida
        const result = await axios.get('https://iptv-org.github.io/iptv/countries/br.m3u');
        // Faz a leitura do arquivo M3U8
        reader.read(result.data);
        // Obtém os segmentos da lista de canais
        const lista = reader.getResult().segments;
        // Atualiza os estados com a lista completa e a lista filtrada
        setListaCanais(lista);
        setCanaisFiltrados(lista);
      } catch (error) {
        console.error('Erro ao obter canais:', error);
      }
    };

    getCanais();
  }, []);

  // Função para realizar a busca de canais com base no valor inserido no campo de busca
  const search = () => {
    const canaisFiltrados = listaCanais.filter(
      (item) => item.inf.title.toLowerCase().includes(value.toLowerCase())
    );
    setCanaisFiltrados(canaisFiltrados);
  };

  // Função chamada ao clicar em um canal na lista
  const handleCanalClick = (canal) => {
    // Define o nome do canal e limpa a URL do canal escolhido
    setNomeCanal(canal.inf.title);
    setUrlCanalEscolhido('');

    // Define a URL do canal escolhido após um pequeno atraso
    setTimeout(() => {
      setUrlCanalEscolhido(canal.url);
      setShowSidebar(false); // Fecha o Sidebar ao clicar em um canal
    }, 500);
  };

  // Função para renderizar a lista de canais
  const renderCanais = () => {
    return canaisFiltrados.map((canal) => (
      <div
        key={canal.inf.title}
        className="canal-card"
        onClick={() => handleCanalClick(canal)}
      >
        {canal.inf.tvgLogo !== '' ? (
          <img alt={canal.inf.title} className="canal-logo" src={canal.inf.tvgLogo} />
        ) : (
          <div className="placeholder-logo" />
        )}
        <div className="canal-nome">{canal.inf.title}</div>
      </div>
    ));
  };

  return (
    <div className="app-container">
      {/* Sidebar para exibir a lista de canais */}
      <Sidebar
        showSidebar={showSidebar}
        onClose={() => setShowSidebar(false)}
        sidebar={renderCanais()}
        docked={true}
        styles={{
          sidebar: {
            color: "white",
            background: "#000000",
            width: "15vw", /* Alterado para ocupar 100% da largura na tela menor */
            display: "flex",
            flexDirection: "column",
            overflowY: "auto", /* Alterado para camelCase */
            padding: "20px",
            boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)", /* Alterado para camelCase */
          },
        }}
      />

      {/* Contêiner principal da aplicação */}
      <div className="main-container">
        {/* Botão para mostrar/ocultar a Sidebar */}

        {/* Título da aplicação */}
        <label className="app-title">IPTV - Cassimiro</label>
        {/* Nome do canal selecionado */}
        <label className="canal-selecionado">{nomeCanal}</label>
        {/* Contêiner do player de vídeo */}
        <div className="player-container">
          {/* Renderiza o player de vídeo se a URL do canal estiver definida */}
          {urlCanalEscolhido.length > 0 ? (
            <ReactPlayer autoPlay controls url={urlCanalEscolhido} />
          ) : (
            // Mensagem de orientação quando nenhum canal está selecionado
            <div className="placeholder">
              <label>Escolha um canal na lista ao lado</label>
            </div>
          )}
        </div>
        {/* Contêiner de busca de canais */}
        <div className="search-container">
          {/* Campo de input para inserir o termo de busca */}
          <input
            className="search-input"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Digite o nome do canal"
          />
          {/* Botão para acionar a busca de canais */}
          <button className="search-button" onClick={search}>
            Pesquisar
          </button>
          <button
            className="toggle-sidebar-button"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            {showSidebar ? 'Esconder Sidebar' : 'Mostrar Sidebar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
