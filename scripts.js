const Modal = {
	open(){
		document.querySelector('.modal-overlay').classList.add('active')
	},

	close(){
		document.querySelector('.modal-overlay').classList.remove('active')
	}
}

const Transaction = {
	/* valores das transacoes que estarao presentes nas tabelas;
		atalho para as acoes, expandindo para utilizar novamente em outras funcoes */
	all: [
		{
			description: 'Luz',
			amount: -50000,
			date: '23/01/2021',
		},
	
		{
			description: 'Website',
			amount: 500000,
			date: '23/01/2021',
		},
	
		{
			description: 'Internet',
			amount: -20000,
			date: '23/01/2021',
		},
	], 
	
	add(transaction){
		Transaction.all.push(transaction)
		App.reload()
	},

	remove(index){
		Transaction.all.splice(index, 1)
		App.reload()
	},

	incomes(){
		let income = 0;

		Transaction.all.forEach(transaction => {
			if(transaction.amount > 0){
				income += transaction.amount;
			}
		})

		return income;
	},
	
	expenses(){
		let expense = 0;

		Transaction.all.forEach(transaction => {
			if(transaction.amount < 0){
				expense += transaction.amount;
			}
		})

		return expense;
	},

	total(){
		return Transaction.incomes() + Transaction.expenses();
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
	},

	updateBalance(){
		document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes())
		document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses())
		document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())
	},

	clearTransactions(){
		DOM.transactionsContainer.innerHTML = ""
	}
}

const Utils = {
	formatAmount(value){
		value = Number(value.replace(/\,\./g, "")) * 100
		return value 
	},

	formatDate(value){
		const splittedDate = value.split("-")
		return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
	},

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

const Form = {
	// armazenar valores dos inputs para acessar em diferentes areas sem repetir codigo
	description: document.querySelector('input#description'),
	amount: document.querySelector('input#amount'),
	date: document.querySelector('input#date'),

	// Verificar se estao vazios ou nao
	getValues(){
		return {
			description: Form.description.value,
			amount: Form.amount.value,
			date: Form.date.value,
		}
	},

	validateFields(){
		const {description, amount, date} = Form.getValues()
		
		if(description.trim() === "" || amount.trim() === "" || date.trim() === ""){
			throw new Error("Por favor, preencha todos os campos!")
		}
	},

	formatValues(){
		let {description, amount, date} = Form.getValues()

		amount = Utils.formatAmount(amount)
		date = Utils.formatDate(date)

		return{
			description,
			amount,
			date,
		}
	},

	saveTransaction(transaction){
		Transaction.add(transaction)
	},

	clearFields(){
		Form.description.value = ""
		Form.amount.value = ""
		Form.date.value = ""
	},

	submit(event){
		// nao retornar na url os valores enviados
		event.preventDefault()

		try{
			Form.validateFields()
			const transaction = Form.formatValues()
			Form.saveTransaction(transaction)
			Form.clearFields()
			Modal.close()
		}catch(error){
			alert(error.message)
		}
	}
}

const App = {
	init(){
		// Funcionalidade para objetos array -> para cada elemento ira executar a funcionalidade
		Transaction.all.forEach(transaction => {
			DOM.addTransaction(transaction)
		})

		DOM.updateBalance()
	},

	reload(){
		DOM.clearTransactions()
		App.init()
	},
}

App.init()