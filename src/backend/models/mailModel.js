const contentHTML = (id) => `
<div
      style="
        max-width: 400px;
        margin: auto;
        padding: 25px 0;

        background: #97cefc;
        border-radius: 5px;
        border-bottom: 3px solid #00000020;
        border-left: 4px solid #00000050;
        text-align: center;
      "
    >
      <h1>Gracias por registrarte.</h1>
      <p style="margin-bottom: 25px">
        Por favor, verifica tu email para poder acceder a Notesapp
      </p>
      <a
        href="https://alexism-notes-app.herokuapp.com/pending/${id}"
        style="
          padding: 15px 25px;

          color: #000;
          background: #fff;
          border: none;
          border-radius: 5px;
          text-decoration: none;

          box-shadow: #00000050 0px 2.5px;
        "
      >
        Verificar
      </a>
    </div>
`;

module.exports = contentHTML;
