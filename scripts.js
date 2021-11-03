const Modal = {
	open(){
		document.querySelector('.modal-overlay').classList.add('active')
	},

	close(){
		document.querySelector('.modal-overlay').classList.remove('active')
	}
}

// valores das transacoes que estarao presentes nas tabelas
const transactions = [
	{
		id: 1,
		description: 'Luz',
		amount: -50000,
		date: '23/01/2021',
	},

	{
		id: 2,
		description: 'Website',
		amount: 500000,
		date: '23/01/2021',
	},

	{
		id: 3,
		description: 'Internet',
		amount: -20000,
		date: '23/01/2021',
	},
]

// calculos
const Transaction = {
	incomes(){
		
	},
	
	expenses(){
		
	},

	total(){
		
	}
}

const DOM = {
	// Container que ira guardar o corpo da tabela
	transactionsContainer: document.querySelector('#data-table tbody'),

	// inserir os valores da Transaction de maneira dinâmica na tabela do HTML
	addTransaction(transaction, index){
		const tr = document.createElement('tr')
		tr.innerHTML = DOM.innerHTMLTransaction(transaction)

		DOM.transactionsContainer.appendChild(tr)
	},

	innerHTMLTransaction(transaction){
		// verifica se o valor de entrada foi positivo ou negativo
		const CSSclass = transaction.amount > 0 ? "income" : "expense"

		const amount = Utils.formatCurrency(transaction.amount)

		const html = `
			<td class="description">${transaction.description}</td>
			<td class="${CSSclass}">${amount}</td>
			<td class="date">${transaction.date}</td>
			<td>
				<img src="./assets/minus.svg" alt="Remover transação">
			</td>
		`
		return html
	}
}

const Utils = {
	formatCurrency(value){
		const signal = Number(value) < 0 ? "-" : ""

		// utiliza do regex para remover qualquer caractere presente na string, que seja diferente de um numero
		value = String(value).replace(/\D/g, "")
		value = Number(value)/100

		// valor padrao para moedas brasileiras
		value = value.toLocaleString("pt-BR", {
			style: "currency",
			currency: "BRL", 
		})

		return signal + value
	}
}

// Funcionalidade para objetos array -> para cada elemento ira executar a funcionalidade
transactions.forEach(function(transaction){
	DOM.addTransaction(transaction)
})