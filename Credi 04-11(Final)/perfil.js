// Função para carregar as informações do perfil do localStorage ao abrir a página
window.onload = function() {
    const userName = localStorage.getItem("userName");
    const userProfileImage = localStorage.getItem("userProfileImage");
    const userDescription = localStorage.getItem("userDescription");

    if (userName && document.getElementById("user-name")) {
        document.getElementById("user-name").innerText = userName;
    }

    if (userProfileImage && document.getElementById("profile-image")) {
        document.getElementById("profile-image").src = userProfileImage;
    }

    if (userDescription && document.getElementById("aboutText")) {
        document.getElementById("aboutText").innerText = userDescription; // Exibe a descrição no perfil
    }

    loadUserPosts(); // Carrega as postagens do usuário
};

// Função para editar a descrição
function editAbout() {
    const aboutTextArea = document.getElementById("aboutText");
    if (aboutTextArea.readOnly) {
        aboutTextArea.readOnly = false; // Permite edição
        aboutTextArea.focus(); // Foca no textarea
    } else {
        // Salva a nova descrição no localStorage
        const newDescription = aboutTextArea.value.trim();
        localStorage.setItem("userDescription", newDescription);
        aboutTextArea.readOnly = true; // Bloqueia a edição
    }
}

// Função para atualizar o cadastro
function updateUserInfo() {
    const newUserName = document.getElementById("new-username").value.trim();
    const newEmail = document.getElementById("new-email").value.trim();
    const newPassword = document.getElementById("new-password").value.trim();

    // Atualiza as informações no localStorage
    if (newUserName) {
        localStorage.setItem("userName", newUserName);
        document.getElementById("user-name").innerText = newUserName; // Atualiza o nome na página
    }
    
    if (newEmail) {
        localStorage.setItem("userEmail", newEmail);
    }

    if (newPassword) {
        localStorage.setItem("userPassword", newPassword);
    }

    alert("Informações atualizadas com sucesso!");
}

// Função para carregar as postagens do usuário
function loadUserPosts() {
    const postsContainer = document.getElementById("postsContainer");
    // Aqui você pode implementar a lógica para buscar e exibir as postagens do usuário
    // Exemplo: Iterar por um array de postagens armazenadas em localStorage
}

// Função para salvar a imagem de perfil no localStorage e exibir na página
function uploadProfileImage() {
    const fileInput = document.getElementById("upload-image");
    const profileImage = document.getElementById("profile-image");

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageUrl = e.target.result;
            localStorage.setItem("userProfileImage", imageUrl); // Armazena a imagem como base64 no localStorage
            profileImage.src = imageUrl; // Atualiza a imagem de perfil na página
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        alert("Por favor, selecione uma imagem válida.");
    }
}

function togglePassword(id) {
    const passwordField = document.getElementById(id);
    const icon = passwordField.nextElementSibling;

    if (passwordField.type === "password") {
        passwordField.type = "text";
        icon.textContent = "👁️"; // Ícone de olho aberto
    } else {
        passwordField.type = "password";
        icon.textContent = "🚫"; // Ícone de olho fechado
    }
}


// Função de logout
function logout() {
    localStorage.removeItem("userName");
    localStorage.removeItem("userProfileImage");
    localStorage.removeItem("userDescription");
    alert("Você saiu da sua conta.");
    window.location.href = "index.html"; // Redireciona para a tela de login
}
