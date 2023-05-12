// ABRE O PUPPETEER
// CAPTURA O TEMPO DE INICIO DA APLICAÇÃO
console.time("TEMPO PARA FINALIZAR O PROCEDIMENTO");
const puppeteer = require("puppeteer");

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('O que você quer pesquisar? ', (pesquisa) => {
rl.question('Quantos Resultados? ', (qtdPesq) => {
        //console.log(`Olá, ${pesquisa}!`);

let url = "http://www.amazon.com.br/";
//let pesquisa = "palmeiras";

    //INICIA A APLICAÇÃO TODA NUMA CONEXÃO ASSINCRONA
    (async () => {
    //AQUI CNFIGURA O PUPPETER
    // O OBJETO 'headless': false. PERMITE VER O NAVEGADOR ABERTO.
    const browser = await puppeteer.launch({ 
        headless: true,
        timeout: 6000
    });
        console.log("Abrindo o Site: "+url)
    //ABRE UMA NOVA PAGINA E COLOCA NUMA VARIAVEL
    const page = await browser.newPage();

    //VAI PARA A PAGINA Q EU QUISER
    await page.goto(url);

    //FAZ A PESQUISA NO INPUT, "." PARA CLASSE E "#" PARA ID
    await page.waitForSelector("#twotabsearchtextbox"); // ESPERA PELO CARREGAMENTO DO ELEMENTO
    await page.type("#twotabsearchtextbox", pesquisa);
        console.log("Pesquisando por "+pesquisa)

    //É POSSIVEL CLICAR OU APERTAR ENTER PARA VALIDAR O FORM
    await Promise.all([
        page.waitForNavigation(),
        page.keyboard.press("Enter")
    ])

    //ESPERA UM OBJETO CARREGAR
    await page.waitForSelector("[data-component-type=s-product-image]");

    //COMEÇA A CONFIGURAR AS PAGINAS
    //FAZ UM ARRAY COM OS LINKS DAS PAGINAS DE TODOS OS PRODUTOS PARA ACESSAR UMA POR VEZ
    const urls = await page.evaluate(() => {
        const elements = document.querySelectorAll(
        ".s-title-instructions-style h2 a"
        );
        const links = [];

        for (let element of elements) {
        links.push(element.href);
        }
        return links;
    });

    // ARRAY PARA GUARDAR AS INFORMAÇÕES DOS PRODUTOS
    const products = [];

    console.log("Criando a tabela")

    // FOR PARA PERCORRER POR TODAS AS PAGINAS DENTRO DA VARIAVEL DE URL
    for (let i = 0; i < qtdPesq; i++) {
        let oneUrl = urls[i];
        await page.goto(oneUrl);

        //ESPERA UM OBJETO CARREGAR
        await page.waitForSelector("#productTitle");
        await page.waitForSelector(".a-link-normal");
        await page.waitForSelector(".a-price span");

        // GUARDA INFORMAÇÕES DE CADA PRODUTO
        const product = await page.evaluate(() => {
        const tmp = {};
        tmp.Titulo = document.querySelector("#productTitle").innerText;
        tmp.Categoria = document.querySelector(".a-link-normal").innerText;
        tmp.Preco = document.querySelector(".a-price span").innerText;
        return tmp;
        });

        //INCLUI AS INFORMAÇÕES CAPTURADAS PARA O ARRAY
        products.push(product);
    }
    //MOSTRA NO CONSOLE A TABELA COM TODAS AS INFORMAÇÕES CAPTURADAS
    console.table(products);
    //FINALIZA O NAVEGADOR
    await browser.close();
    console.timeEnd("TEMPO PARA FINALIZAR O PROCEDIMENTO");
    //FINALIZA A APLICAÇÃO
    process.exit();
    })();
});
});
