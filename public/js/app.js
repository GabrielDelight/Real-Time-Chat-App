let appender = document.getElementById('appedChat');
let activeusers = document.getElementById('showActiveUsers');
const start = document.getElementById('joinBtn');
const inputText = document.getElementById('username');  


function runGreetFun() {
    const socket = io()
    const username = document.getElementById('username').value;   
    document.getElementById('myChat').focus()
    if(inputText.value.trim() === ''){
        return alert("Please type a usernam")
        
    }


    document.querySelector('.customise_background').style.display = 'none'


    // Show active users
    socket.emit('users', username)
    socket.on('getNames', (user) => {
        
        let html = ''          
        for (i = 0; i < user.length; i++) {            
            html += '<div class="person"><div class="name"><h3>'+ user[i]+'</h3><p>Joined the Group</p></div></div>'
            activeusers.innerHTML = html                 
            scrollUpUsers()
        }
    })

    function scrollUpUsers(){
        let x = document.querySelector('.active_container')
        x.scrollTop += 64000
    }


    // Welcome users -> Welcome here
    socket.on('welcomeText', (msg) => {
        let html, newHtml
        html = `<div class="welcomeText">%welcome%</div>`
        newHtml = html.replace('%welcome%', msg)
        appender.insertAdjacentHTML('beforeend', newHtml)
    })

    function scrollerFunction() {
        let scroll = document.querySelector('.sub_wrapper');
        scroll.scrollTop += 640000
    }


    // Alert new user joined
    socket.emit('sendName', username);
    // Append 
    socket.on('newUserText', (data) => {
        let html, newHtml
        html = `<div class="newUser">%text%</div>`
        newHtml = html.replace('%text%', data);

        appender.insertAdjacentHTML('beforeend', newHtml)
        scrollerFunction()
    })


    document.getElementById('sendBtn').addEventListener('click', () => {
        // Appending my chat to browser
        let input = document.getElementById('myChat').value;
        
        if(input.trim() === ''){
            return 
        }

        let html, newHtml
        html = `<div class="myChat"><p>%chat%</p></div>`
        newHtml = html.replace('%chat%', input)
        appender.insertAdjacentHTML('beforeend', newHtml)

        // Sending chat to server
        socket.emit('sendMessage', { username, input })
        scrollerFunction()

        var x = document.getElementById('myChat');
        x.value = ''
        document.getElementById('myChat').focus()
    })


    // Show mesage to browser
    socket.on('showMessage', (msg) => {
        let html, newHtml, firstAlphabet;
        html = `<div class="message_box"><div class="image_user"><h4>%P%</h4></div><div class="chat_discription"><div class="name_date"><h4>%name%</h4><h6>%time%</h6></div><p>%message%</p></div></div>`


        // Get the first letter
        firstAlphabet = msg.username.substr(0, 1)
        // get tikme
        let date, hour, medidem
        date = new Date().toLocaleTimeString();
        date = date.substr(0, 4)


        //get medidem
        hour = new Date().getHours();
        if (hour < 10) {
            medidem = 'am'
        } else if (hour < 20) {
            medidem = 'pm'
        }
        else {
            medidem = 'pm'
        }
        let time = date + ' ' + medidem

        newHtml = html.replace('%name%', msg.username) //Replace the name
        newHtml = newHtml.replace('%message%', msg.input) //Replace the Input
        newHtml = newHtml.replace('%P%', firstAlphabet)
        newHtml = newHtml.replace('%time%', time)

        appender.insertAdjacentHTML('beforeend', newHtml)
        scrollerFunction()
    })

    // Toggle Emogi
    document.getElementById('emojiBtn').addEventListener('click', () => {        
        document.querySelector('.toggle_style').classList.toggle('toggle_emogi')
    })


    // Add sstickers
    let stickers = document.querySelectorAll('.sticker');
    stickers.forEach((cur) => {
        cur.addEventListener('click', (e) => {
            let emoji
            emoji = e.target.parentElement.children[0].textContent;
            let myInput = document.getElementById('myChat');
            myInput.value += emoji

        })
    })


    // Disconnect
    const myName = document.getElementById('username').value;
    socket.on('userleft', (msg) => {
        let html, newHtml;
        html = `<div class="newUser">%text%</div>`        
        newHtml = html.replace('%text%', msg)
        appender.insertAdjacentHTML('beforeend', newHtml)

    })


    // Close button
    document.getElementById('close').addEventListener('click', () => {
        let x = document.querySelector('aside')
        x.style.display = 'none'
    })

    document.getElementById('show').addEventListener('click', () => {
        let x = document.querySelector('aside')
        x.style.display = 'block'
    })
    

}
