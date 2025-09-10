var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// Importa o módulo readline-sync para ler dados do usuário no terminal
var readlineSync = require('readline-sync');
/**
 * Classe que representa um chamado no sistema.
 */
// Classe que representa um chamado
var Chamado = /** @class */ (function () {
    /**
     * Cria uma nova instância de Chamado.
     * @param id Identificador único (formato 0001)
     * @param nomeSolicitante Nome do solicitante
     * @param setorSolicitante Setor do solicitante
     * @param titulo Título do chamado
     * @param descricao Descrição detalhada
     */
    function Chamado(id, nomeSolicitante, setorSolicitante, titulo, descricao) {
        this.id = id;
        this.nomeSolicitante = nomeSolicitante;
        this.setorSolicitante = setorSolicitante;
        this.titulo = titulo;
        this.descricao = descricao;
        this.dataAbertura = new Date();
        this.status = 'aberto';
    }
    return Chamado;
}());
/**
 * Sistema para gerenciar chamados.
 */
var SistemaChamados = /** @class */ (function () {
    function SistemaChamados() {
        /** Lista de chamados */
        this.chamados = [];
    }
    /**
     * Abre um novo chamado.
     * @param id ID do chamado (formato 0001)
     * @param titulo Título do chamado
     * @param descricao Descrição detalhada
     * @returns O chamado criado
     */
    SistemaChamados.prototype.abrirChamado = function (id, nomeSolicitante, setorSolicitante, titulo, descricao) {
        var chamado = new Chamado(id, nomeSolicitante, setorSolicitante, titulo, descricao);
        this.chamados.push(chamado);
        return chamado;
    };
    /**
     * Lista todos os chamados abertos no sistema.
     * @returns Array de chamados
     */
    SistemaChamados.prototype.listarChamados = function () {
        return this.chamados;
    };
    /**
     * Verifica se o ID já existe
     * @param id ID a verificar
     */
    SistemaChamados.prototype.idExiste = function (id) {
        return this.chamados.some(function (c) { return c.id === id; });
    };
    return SistemaChamados;
}());
// --- Interatividade para cadastrar chamados e salvar em CSV ---
// ...existing code...
// eslint-disable-next-line @typescript-eslint/no-var-requires
// Importa módulos do Node.js para manipular arquivos e caminhos
var fs = require('fs');
var path = require('path');
/**
 * Salva os chamados em um arquivo CSV.
 * @param chamados Lista de chamados
 * @param arquivo Caminho do arquivo CSV
 */
// Função para salvar os chamados em um arquivo CSV
function salvarChamadosCSV(chamados, arquivo) {
    var cabecalho = 'ID;Nome;Setor;Título;Descrição;Data de Abertura;Status';
    var linhas = chamados.map(function (c) {
        return "".concat(c.id, ";").concat(c.nomeSolicitante, ";").concat(c.setorSolicitante, ";").concat(c.titulo, ";").concat(c.descricao, ";").concat(c.dataAbertura.toISOString(), ";").concat(c.status);
    });
    var conteudo = __spreadArray([cabecalho], linhas, true).join('\n');
    // Garante que a pasta existe
    var pasta = path.dirname(arquivo);
    if (!fs.existsSync(pasta)) {
        fs.mkdirSync(pasta, { recursive: true });
    }
    fs.writeFileSync(arquivo, conteudo, { encoding: 'utf-8' });
}
// Instancia o sistema de chamados e define o caminho do arquivo CSV
var sistema = new SistemaChamados();
var arquivoCSV = path.join(__dirname, 'chamados.csv');
// Função para exibir o menu principal
function menu() {
    console.log('--- Sistema de Chamados ---');
    console.log('1 - Cadastro de chamado');
    console.log('2 - Consulta de chamados');
    console.log('0 - Sair');
}
// Loop principal do sistema
var rodando = true;
while (rodando) {
    menu(); // Mostra o menu
    var opcao = readlineSync.question('Escolha uma opcao: ');
    switch (opcao) {
        case '1':
            // Cadastro de chamado
            // Solicita o ID do chamado
            var id = void 0;
            while (true) {
                id = readlineSync.question('Digite o ID do chamado (formato 0001): ');
                if (!/^\d{4}$/.test(id)) {
                    console.log('ID invalido! O ID deve conter exatamente 4 digitos numericos, exemplo: 0001.');
                    continue;
                }
                if (sistema.idExiste(id)) {
                    console.log('ID ja cadastrado! Digite um ID unico.');
                    continue;
                }
                break;
            }
            // Solicita o nome do solicitante
            var nomeSolicitante = void 0;
            while (true) {
                nomeSolicitante = readlineSync.question('Digite o nome de quem esta solicitando: ');
                if (!nomeSolicitante.trim()) {
                    console.log('O nome nao pode ser vazio.');
                    continue;
                }
                break;
            }
            // Solicita o setor do solicitante
            var setorSolicitante = void 0;
            while (true) {
                setorSolicitante = readlineSync.question('Digite o setor de quem esta solicitando: ');
                if (!setorSolicitante.trim()) {
                    console.log('O setor nao pode ser vazio.');
                    continue;
                }
                break;
            }
            // Solicita o título do chamado
            var titulo = void 0;
            while (true) {
                titulo = readlineSync.question('Digite o titulo do chamado (max. 100 palavras): ');
                var numPalavras = titulo.trim().split(/\s+/).length;
                if (numPalavras > 100) {
                    console.log('O titulo deve ter no maximo 100 palavras. Você digitou', numPalavras, 'palavras.');
                    continue;
                }
                break;
            }
            // Solicita a descrição do chamado
            var descricao = void 0;
            while (true) {
                descricao = readlineSync.question('Digite a descricao do chamado (max. 500 palavras): ');
                var numPalavras = descricao.trim().split(/\s+/).length;
                if (numPalavras > 500) {
                    console.log('A descricao deve ter no maximo 500 palavras. Você digitou', numPalavras, 'palavras.');
                    continue;
                }
                break;
            }
            // Cadastra o chamado
            var chamado = sistema.abrirChamado(id, nomeSolicitante, setorSolicitante, titulo, descricao);
            console.log('Chamado cadastrado com sucesso:', chamado);
            // Salva os chamados no arquivo CSV
            salvarChamadosCSV(sistema.listarChamados(), arquivoCSV);
            console.log('Chamados salvos em', arquivoCSV);
            break;
        case '2':
            // Consulta de chamados
            var chamados = sistema.listarChamados();
            if (chamados.length === 0) {
                console.log('Nenhum chamado cadastrado.');
            }
            else {
                console.log('--- Lista de Chamados ---');
                chamados.forEach(function (c) {
                    // Exibe os detalhes de cada chamado
                    console.log("ID: ".concat(c.id, "\nNome: ").concat(c.nomeSolicitante, "\nSetor: ").concat(c.setorSolicitante, "\nT\u00EDtulo: ").concat(c.titulo, "\nDescri\u00E7\u00E3o: ").concat(c.descricao, "\nData: ").concat(c.dataAbertura.toLocaleString(), "\nStatus: ").concat(c.status, "\n----------------------"));
                });
            }
            break;
        case '0':
            // Sai do sistema
            rodando = false;
            console.log('Encerrando o sistema.');
            break;
        default:
            // Opção inválida
            console.log('Opcao invalida!');
    }
}
