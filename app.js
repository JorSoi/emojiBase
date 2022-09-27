const parentNode = document.getElementById('content-wrapper');
const searchBar = document.getElementById('searchBar');
const creatorPopup = document.getElementById('creatorPopup');
const editorPopup = document.getElementById('editorPopup');
const closeIcon = document.getElementById('closeIcon');
const createEmoji = document.getElementById('createEmoji');
const createDescription = document.getElementById('createDescription');
const changeEmoji = document.getElementById('changeEmoji');
const changeDescription = document.getElementById('changeDescription');
const popUpWrapper = document.querySelector('.popup-wrapper');



const getAllEmojis = async () => {
    try {
        let response = await fetch('http://localhost:3000/emojis');
        if (response.ok) {
            const data = await response.json();
            parentNode.innerHTML = "";
            for(let i = 0; i < data.length; i++) {
                parentNode.innerHTML += `<div id="${data[i].id}"class="emoji-container" onclick="openEditor()"><p>${data[i].emoji_face}</p><h5>${data[i].emoji_desc}</h5></div>`;
            }            
        } else {
            throw new Error('We can\'t create a connection to the api.');
        }
    } catch (err) {
        console.log(`There might be a problem with the code ${err}`);
    }
}

const searchEmoji = async () => {
    try {
        const response = await fetch(`http://localhost:3000/emojis/${encodeURI(searchBar.value)}`)
        if (response.ok && searchBar.value != '') {
            const data = await response.json();
            console.log(data);
            parentNode.innerHTML = "";
            for(let i = 0; i < data.length; i++) {
                parentNode.innerHTML += `<div id="${data[i].id}"class="emoji-container" onclick="openEditor()"><p>${data[i].emoji_face}</p><h5>${data[i].emoji_desc}</h5></div>`;
            } 
        } else {
            getAllEmojis();
        }
    } catch (err) {
        console.log(err);
    }

}



const openEditor = async () => {
    console.log(event.target.id);
    const response = await fetch(`http://localhost:3000/emojis/edit/${event.target.id}`);
    if (response.ok) {
        const data = await response.json();
        changeEmoji.value = data[0].emoji_face;
        changeDescription.value = data[0].emoji_desc;
        popUpWrapper.id = data[0].id;
    }
    editorPopup.style.display = "flex";
}

const updateEmoji = async () => {
    const jsBody = {
        emoji_desc: changeDescription.value,
        emoji_face: changeEmoji.value
    }
    try {
        const response = await fetch(`http://localhost:3000/emojis/edit/${popUpWrapper.id}`, {
            method: 'PUT',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(jsBody)
        });
        if (response.ok) {
            getAllEmojis();
            closePopups();
        }
    } catch (err) {
        console.log(err);
    }
}



const postEmoji = async () => {
    let jsBody = {
        emoji_face: createEmoji.value,
        emoji_desc: createDescription.value
    }
    try {
        const response = await fetch('http://localhost:3000/emojis', {
            method : 'POST',
            headers: {
                "Content-Type": "application/json"
              },
            body: JSON.stringify(jsBody)
        })
        if (response.ok) {
            console.log(response.status)
            closePopups();
            getAllEmojis();
            resetCreatorValues();
        } else {
            console.log('Failed to connect to endpoint')
        }
    } catch (err) {
        console.log(err);
    }
}

const deleteEmoji = async () => {
    try {
        const response = await fetch(`http://localhost:3000/emojis/${popUpWrapper.id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            getAllEmojis();
            closePopups();
        }
        
    } catch (err) {
        console.log(err);
    }
}






function resetCreatorValues () {
    createEmoji.value = "";
    createDescription.value = "";
}

function openCreator () {
    creatorPopup.style.display = "flex";
}

function closePopups () {
    editorPopup.style.display = "none";
    creatorPopup.style.display = "none";
}

// Execute a function when the user presses a key on the keyboard
searchBar.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    searchEmoji();
  }
});










getAllEmojis();





