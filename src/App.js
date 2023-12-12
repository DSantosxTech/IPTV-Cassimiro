import React, { useState, useEffect, PureComponent } from 'react';
import ReactPlayer from 'react-player';
import './App.css';
import axios from 'axios';

import Sidebar from 'react-sidebar';

const M3U8FileParser = require('m3u8-file-parser');
const reader = new M3U8FileParser();

function App() {
  const [listaCanais, setlistaCanais] = useState([]);
  const [urlCanalEscolhido, seturlCanalEscolhido] = useState('');
  const [nomeCanal, setnomeCanal] = useState('');
  const [value, setvalue] = useState('');
  const [CanaisFiltrados, setCanaisFiltrados] = useState([]);
  const [Height, setHeight] = useState(window.innerHeight);
  const [Width, setWidth] = useState(window.innerWidth);
  const [altura, setaltura] = useState(window.pageYOffset);

  useEffect(() => {
    async function getCanais() {
      // const fetchData = async () => {
      const result = await axios(
        // 'https://iptv-org.github.io/iptv/index.category.m3u', //->>>> todos os canais
        // 'https://iptv-org.github.io/iptv/categories/auto.m3u', //->>>> auto
        // 'https://iptv-org.github.io/iptv/categories/documentary.m3u', // -->>>> documentary
        'https://iptv-org.github.io/iptv/countries/br.m3u', // -->>>> brasil
      );

      reader.read(result.data);
      var lista = reader.getResult().segments;
      setlistaCanais(lista);
      setCanaisFiltrados(lista);
    }
    getCanais();
  }, []);

  function search() {
    var CanaisFiltrados = listaCanais.filter(
      (item) =>
        item.inf.title.toLowerCase().indexOf(value.toLowerCase()) !== -1,
    );
    // console.log(CanaisFiltrados);
    setCanaisFiltrados(CanaisFiltrados);
  }

  function BotaoCanal({ canal }) {
    return (
      <div
        style={{
          alignItems: 'center',
          // flexDirection: 'row',
          margin: 10,
          padding: 10,
          backgroundColor: '#7159ca',
          borderRadius: 10,
          justifyContent: 'center',
          width: Width / 5 - 20,
          cursor: 'pointer',
        }}
        onClick={() => {
          // console.log(canal.url);
          setnomeCanal(canal.inf.title);
          seturlCanalEscolhido('');
          setTimeout(() => {
            seturlCanalEscolhido(canal.url);
          }, 500);
        }}
      >
        {canal.inf.tvgLogo !== '' ? (
          <img
            alt={canal.inf.title}
            resizeMode='contain'
            src={canal.inf.tvgLogo}
            style={{
              height: 50,
              width: 50,
              marginRight: 30,
              borderRadius: 5,
              backgroundColor: 'white',
            }}
          />
        ) : (
          <div
            style={{
              height: 50,
              width: 50,
              marginRight: 30,
              borderRadius: 25,
              backgroundColor: 'white',
            }}
          />
        )}
        <div style={{ fontSize: 20, cursor: 'pointer' }}>
          {canal.inf.title}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: '#282c34',
        display: 'flex',
        // flexDirection: 'row',
        // alignItems: 'center',
        justifyContent: 'space-around',
        fontSize: 20,
        color: 'white',
        scrollSnapType: 'mandatory',
        // height: Height,
        // maxHeight: Height,
        // width: 200,
      }}
    >
      <Sidebar
        showVerticalScrollIndicator={false}
        sidebar={CanaisFiltrados.map((canal) => {
          return <BotaoCanal key={canal.inf.title} canal={canal} />;
        })}
        // open={true}
        docked={true}
        // onSetOpen={this.onSetSidebarOpen}
        styles={{
          sidebar: {
            background: '#000',
            width: Width / 5 + 30,
            showVerticalScrollIndicator: false,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          },
        }}
      ></Sidebar>

      <div
        style={{
          display: 'flex',
          flex: 8,
          // backgroundColor: '#ffa500',
          flexDirection: 'column',
          marginLeft: 30,
          alignItems: 'center',
          justifyContent: 'space-around',
          height: Height,
          marginLeft: Width / 5 + 30,
        }}
      >
        <label>IPTV Cassimiro</label>
        <label>{nomeCanal}</label>
        <div
          style={{
            alignItems: 'center',
            // justifyContent: 'space-around',
          }}
        >
          {urlCanalEscolhido.length > 0 ? (
            <ReactPlayer
              // height={600}
              // width={900}
              autoPlay
              controls
              url={urlCanalEscolhido}
            />
          ) : (
            <div style={{ height: 600 }}>
              <label>Escolha um canal na lista ao lado</label>
            </div>
          )}
        </div>
        <div style={{ zIndex: 999 }}>
          <input
            style={{
              height: 30,
              width: 250,
              borderRadius: 10,
              borderWidth: 0,
              paddingLeft: 10,
            }}
            type='text'
            value={value}
            onChange={(e) => {
              setvalue(e.target.value);
            }}
            placeholder='Digite o nome do canal:'
          />
          <button
            style={{
              height: 30,
              borderRadius: 10,
              borderWidth: 0,
              marginLeft: 5,
              color: 'white',
              background: '#7159ca',
            }}
            onClick={() => search()}
          >
            Pesquisar
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;