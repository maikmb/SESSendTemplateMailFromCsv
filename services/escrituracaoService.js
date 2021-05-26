const { default: axios } = require("axios");
const s3Client = require("../aws/s3Client");

class EscrituracaoService {
    getFirstLetter(customerName) {
        const firstName = customerName.split(" ").length > 0 ? startCase(toLower(customerName.split(" ")[0])) : customerName;
        return firstName;
    }

    normalizeEmailAddress(emailAddress) {
        const customerEmail = emailAddress.substring(emailAddress.indexOf('<')).replace(/<|>/g, '');
        return customerEmail;
    }

    async getInvestorEarningsReport(customerDocument) {
        const document = Number.parseFloat(this.onlyNumbers(customerDocument))
        const urlEarningsReport = await this.getUrlEarningsReport(document);
        if (!urlEarningsReport) throw new Error("Investor without earnings report:" + customerDocument);
        return await this.assinarUrlObjeto(urlEarningsReport);
    }

    async assinarUrlObjeto(urlEarningsReport) {
        const s3 = new s3Client();
        const presignedUrl = await s3.assinarUrlObjeto(urlEarningsReport);
        return presignedUrl;
    }

    onlyNumbers(text) {
        return text.replace(/\D+/g, '');
    }

    async getUrlEarningsReport(investorDocument) {
        var options = {
            headers: {
                'apikey': '2b81d09ca0e56134229179d657c099ee1ad8e4a29d19c8d677fed0e2b2f1b111',
                'system': 'ApiVxInforma'
            }
        };

        return await axios
            .get(`https://ms-escrituracao.vortx.com.br/api/earnings-report/all-investor-earnings-report?ReferenceYear=2020&InvestorDocument=${investorDocument}`, options)
            .then(resp => resp.data.link)
    }
}

module.exports = EscrituracaoService;