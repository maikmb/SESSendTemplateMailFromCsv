const { default: axios } = require("axios")

function renderTemplate({ templateName, templateData = {} }) {
    return axios
        .post('https://apis.vortx.com.br/vxmails/api/templates/render-template', { templateName, templateData })
        .then(response => response.data)
}

module.exports = { renderTemplate }