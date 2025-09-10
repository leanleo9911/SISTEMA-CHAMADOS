// Importa o módulo readline-sync para ler dados do usuário no terminal
const readlineSync = require('readline-sync');
/**
 * Classe que representa um chamado no sistema.
 */
// Classe que representa um chamado
class Chamado {
	/** Identificador único do chamado (formato 0001) */
	public id: string;
	/** Nome do solicitante */
	public nomeSolicitante: string;
	/** Setor do solicitante */
	public setorSolicitante: string;
	/** Título do chamado */
	public titulo: string;
	/** Descrição detalhada do chamado */
	public descricao: string;
	/** Data de abertura do chamado */
	public dataAbertura: Date;
	/** Status do chamado (aberto, em andamento, fechado) */
	public status: string;

	/**
	 * Cria uma nova instância de Chamado.
	 * @param id Identificador único (formato 0001)
	 * @param nomeSolicitante Nome do solicitante
	 * @param setorSolicitante Setor do solicitante
	 * @param titulo Título do chamado
	 * @param descricao Descrição detalhada
	 */
	constructor(id: string, nomeSolicitante: string, setorSolicitante: string, titulo: string, descricao: string) {
		this.id = id;
		this.nomeSolicitante = nomeSolicitante;
		this.setorSolicitante = setorSolicitante;
		this.titulo = titulo;
		this.descricao = descricao;
		this.dataAbertura = new Date();
		this.status = 'aberto';
	}
}

/**
 * Sistema para gerenciar chamados.
 */
class SistemaChamados {
	/** Lista de chamados */
	private chamados: Chamado[] = [];

	/**
	 * Abre um novo chamado.
	 * @param id ID do chamado (formato 0001)
	 * @param titulo Título do chamado
	 * @param descricao Descrição detalhada
	 * @returns O chamado criado
	 */
	abrirChamado(id: string, nomeSolicitante: string, setorSolicitante: string, titulo: string, descricao: string): Chamado {
		const chamado = new Chamado(id, nomeSolicitante, setorSolicitante, titulo, descricao);
		this.chamados.push(chamado);
		return chamado;
	}

	/**
	 * Lista todos os chamados abertos no sistema.
	 * @returns Array de chamados
	 */
	listarChamados(): Chamado[] {
		return this.chamados;
	}

	/**
	 * Verifica se o ID já existe
	 * @param id ID a verificar
	 */
	idExiste(id: string): boolean {
		return this.chamados.some(c => c.id === id);
	}
}


// --- Interatividade para cadastrar chamados e salvar em CSV ---

// ...existing code...
// eslint-disable-next-line @typescript-eslint/no-var-requires
// Importa módulos do Node.js para manipular arquivos e caminhos
const fs = require('fs');
const path = require('path');

/**
 * Salva os chamados em um arquivo CSV.
 * @param chamados Lista de chamados
 * @param arquivo Caminho do arquivo CSV
 */
// Função para salvar os chamados em um arquivo CSV
function salvarChamadosCSV(chamados: Chamado[], arquivo: string) {
	const cabecalho = 'ID;Nome;Setor;Título;Descrição;Data de Abertura;Status';
	const linhas = chamados.map(c =>
		`${c.id};${c.nomeSolicitante};${c.setorSolicitante};${c.titulo};${c.descricao};${c.dataAbertura.toISOString()};${c.status}`
	);
	const conteudo = [cabecalho, ...linhas].join('\n');
	// Garante que a pasta existe
	const pasta = path.dirname(arquivo);
	if (!fs.existsSync(pasta)) {
		fs.mkdirSync(pasta, { recursive: true });
	}
	fs.writeFileSync(arquivo, conteudo, { encoding: 'utf-8' });
}


// Instancia o sistema de chamados e define o caminho do arquivo CSV
const sistema = new SistemaChamados();
const arquivoCSV = path.join(__dirname, 'chamados.csv');

// Função para exibir o menu principal
function menu() {
	console.log('--- Sistema de Chamados ---');
	console.log('1 - Cadastro de chamado');
	console.log('2 - Consulta de chamados');
	console.log('0 - Sair');
}

// Loop principal do sistema
let rodando = true;
while (rodando) {
	menu(); // Mostra o menu
	const opcao = readlineSync.question('Escolha uma opção: ');
	switch (opcao) {
		case '1':
			// Cadastro de chamado
			// Solicita o ID do chamado
			let id: string;
			while (true) {
				id = readlineSync.question('Digite o ID do chamado (formato 0001): ');
				if (!/^\d{4}$/.test(id)) {
					console.log('ID inválido! O ID deve conter exatamente 4 dígitos numéricos, exemplo: 0001.');
					continue;
				}
				if (sistema.idExiste(id)) {
					console.log('ID já cadastrado! Digite um ID único.');
					continue;
				}
				break;
			}

			// Solicita o nome do solicitante
			let nomeSolicitante: string;
			while (true) {
				nomeSolicitante = readlineSync.question('Digite o nome de quem está solicitando: ');
				if (!nomeSolicitante.trim()) {
					console.log('O nome não pode ser vazio.');
					continue;
				}
				break;
			}

			// Solicita o setor do solicitante
			let setorSolicitante: string;
			while (true) {
				setorSolicitante = readlineSync.question('Digite o setor de quem está solicitando: ');
				if (!setorSolicitante.trim()) {
					console.log('O setor não pode ser vazio.');
					continue;
				}
				break;
			}

			// Solicita o título do chamado
			let titulo: string;
			while (true) {
				titulo = readlineSync.question('Digite o título do chamado (máx. 100 palavras): ');
				const numPalavras = titulo.trim().split(/\s+/).length;
				if (numPalavras > 100) {
					console.log('O título deve ter no máximo 100 palavras. Você digitou', numPalavras, 'palavras.');
					continue;
				}
				break;
			}

			// Solicita a descrição do chamado
			let descricao: string;
			while (true) {
				descricao = readlineSync.question('Digite a descrição do chamado (máx. 500 palavras): ');
				const numPalavras = descricao.trim().split(/\s+/).length;
				if (numPalavras > 500) {
					console.log('A descrição deve ter no máximo 500 palavras. Você digitou', numPalavras, 'palavras.');
					continue;
				}
				break;
			}

			// Cadastra o chamado
			const chamado = sistema.abrirChamado(id, nomeSolicitante, setorSolicitante, titulo, descricao);
			console.log('Chamado cadastrado com sucesso:', chamado);

			// Salva os chamados no arquivo CSV
			salvarChamadosCSV(sistema.listarChamados(), arquivoCSV);
			console.log('Chamados salvos em', arquivoCSV);
			break;
		case '2':
			// Consulta de chamados
			const chamados = sistema.listarChamados();
			if (chamados.length === 0) {
				console.log('Nenhum chamado cadastrado.');
			} else {
				console.log('--- Lista de Chamados ---');
				chamados.forEach(c => {
					// Exibe os detalhes de cada chamado
					console.log(`ID: ${c.id}\nNome: ${c.nomeSolicitante}\nSetor: ${c.setorSolicitante}\nTítulo: ${c.titulo}\nDescrição: ${c.descricao}\nData: ${c.dataAbertura.toLocaleString()}\nStatus: ${c.status}\n----------------------`);
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
			console.log('Opção inválida!');
	}
}
