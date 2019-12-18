App = {

    loading: false,
    contracts: {},

    load: async () => {
        await App.loadWeb3();
        await App.loadAccount(); 
        await App.loadContract();
        await App.render();
    },

    loadWeb3: async () => {
        if(typeof web3 !== 'undefined') {
            web3 = new Web3(web3.currentProvider);
            App.web3Provider = web3.currentProvider;
        }else {
            window.alert("Please connect to Metamask");
        }

        if(window.ethereum) {
            window.web3 = new Web3(ethereum);
            try {
                await ethereum.enable();
                web3.eth.sendTransaction({ });
            }catch (error) {

            }
        }else if(window.web3) {
            App.web3Provider = web3.currentProvider;
            window.web3 = new Web3(web3.currentProvider);
            web3.eth.sendTransaction({});
        }else{
            console.log('Non-Ethereum Browser detected');
        }
    },

    loadAccount: async() => {
        await web3.eth.getAccounts().then((result)=>{
            App.account = result[0];
            console.log(App.account);
        });
    },

    loadContract: async () => {
        const todoList = await $.getJSON('/todoJSON');
        App.contracts.TodoList = TruffleContract(todoList);
        App.contracts.TodoList.setProvider(App.web3Provider);
        
        App.todoList = await App.contracts.TodoList.deployed();
    },

    render: async() => {
        
        if(App.loading) {
            return;
        }

        App.setLoading(true);

        $('#account').html(App.account);

        App.renderTasks();

        App.setLoading(false);
    },

    renderTasks: async () => {
        const taskCount = await App.todoList.taskCount();

        const $taskTemplate = $('.taskTemplate');

        for(var i = 1; i <= taskCount; i++) {
            const task = await App.todoList.tasks(i);
            const taskId = task[0].toNumber();
            const taskContent = task[1];
            const taskCompleted = task[2];

            const $newTaskTemplate = $taskTemplate.clone();
            $newTaskTemplate.find('.content').html(taskContent);
            $newTaskTemplate.find('input')
                            .prop('name', taskId)
                            .prop('checked', taskCompleted)
                            .on('click', App.toggleCompleted);

            // Put the task in the correct list
            if (taskCompleted) {
                $('#completedTaskList').append($newTaskTemplate)
            } else {
                $('#taskList').append($newTaskTemplate)
            }

            // Show the task
            $newTaskTemplate.show()
        }
    },

    createTask: async () => {
        App.setLoading(true);
        const content = $('#newTask').val();
        await App.todoList.createTask(content, {from:App.account});
        window.location.reload();
    },

    toggleCompleted: async(e) => {
        App.setLoading(true);
        const taskId = e.target.name;
        await App.todoList.toggleCompleted(taskId, {from:App.account});
        window.location.reload();
    },

    setLoading: (boolean) => {
        App.loading = boolean;
        const loader = $('#loader');
        const content = $('#content');
        if(boolean) {
            loader.show();
            content.hide();
        }else {
            loader.hide();
            content.show();
        }
    }

}

$(() => {
    window.addEventListener('load', ()=>{
        App.load();
    })
})


