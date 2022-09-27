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
                parentNode.innerHTML += `<div id="${data[i].id}"class="emoji-container" onclick="openEditor()"><p>${data[i].emoji}</p><h5>${data[i]['description']}</h5></div>`;
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
            parentNode.innerHTML = "";
            parentNode.innerHTML = `<div class="emoji-container"><p>${data[0].emoji}</p><h5>${data[0].description}</h5></div>`;
        } else {
            getAllEmojis();
            // parentNode.innerHTML = "";
            // parentNode.innerHTML = `<p class="failedSearch">We couldn't find ${searchBar.value}:(.</p>`
        }
    } catch (err) {
        console.log(err);
    }

}



const openEditor = async () => {
    const response = await fetch(`http://localhost:3000/emojis/edit/${event.target.id}`);
    if (response.ok) {
        const data = await response.json();
        changeEmoji.value = data.emoji;
        changeDescription.value = data.description;
        popUpWrapper.id = data.id;
    }
    editorPopup.style.display = "flex";
}





const postEmoji = async () => {
    let jsBody = {
        newEmoji: createEmoji.value,
        newDescription: createDescription.value
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
            const data = await response.json();
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
        const response = await fetch(`http://localhost:3000/emojis/delete/` + popUpWrapper.id);
        if (response.ok) {
            const data = await response.json();
            console.log(response)
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


getAllEmojis();




