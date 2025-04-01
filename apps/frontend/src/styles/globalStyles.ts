import { css } from '@emotion/react'

const globalStyles = css`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html,
  body {
    height: 100%;
    width: 100%;
    font-family: 'Arial', sans-serif;
    background: var(--background);
    color: var(--text);
  }

  #root {
    margin: 0;
    padding: 0;
    height: 100%;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    font-family: inherit;
    cursor: pointer;
  }

  //Tweakpane styling
  /* Stilizacija unutarnjih elemenata */
  .tp-lblv_l {
    color: #00ff99 !important; /* Tirkizni tekst */
  }
  .tp-fldv_t {
    color: #3399ff !important;
  }

  //wireframe-checkbox
  .tp-ckbv_w {
    background: #3399ff94 !important;
  }

  //slider
  .tp-sldv_k::before {
    background: linear-gradient(90deg, #3399ff, #00ff99) !important;
  }

  .tp-sldv_k::after {
    background: white !important;
  }

  .tp-btnv_b {
    background: linear-gradient(90deg, #3399ff, #00ff99) !important;
    color: #1e1e1e !important; /* Tamnija unutrašnjost inputa */
    border-radius: 4px;
  }

  .tp-btnv_b:hover {
    box-shadow: 0px 0px 10px #00ff99;
  }

  .tp-fldv {
    border: 1px solid rgba(255, 255, 255, 0.2) !important; /* Suptilan okvir foldera */
    border-radius: 6px !important;
  }
`

export default globalStyles
