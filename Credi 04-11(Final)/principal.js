// Definindo o tamanho máximo para upload de arquivos
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

let attachedFile = null; // Variável global para armazenar o arquivo anexado

// Função para registrar o usuário no localStorage
function cadastrarUsuario() {
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const dataNascimento = document.getElementById("dataNascimento").value.trim();
    const senha = document.getElementById("senha").value.trim();

    // Validação da Data de Nascimento (apenas ano)
    if (!validarDataNascimento(dataNascimento)) {
        alert("Por favor, insira uma data de nascimento válida.");
        return;
    }

    // Validação do E-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Por favor, insira um e-mail válido.");
        return;
    }

    // Validação da Senha
    const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    if (!senhaRegex.test(senha)) {
        alert("A senha deve ter pelo menos 6 caracteres, incluindo uma letra maiúscula, uma letra minúscula e um caractere especial.");
        return;
    }

    // Armazenar os dados no Local Storage
    localStorage.setItem("userName", nome);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPassword", senha);

    alert("Cadastro realizado com sucesso!");
    window.location.href = "login.html"; // Redirecionar para a tela de login após o cadastro
}

// Função para validar a data de nascimento completa (ano, mês e dia)
function validarDataNascimento(data) {
    if (!data) return false;

    const dataNascimento = new Date(data);
    const anoNascimento = dataNascimento.getFullYear();
    const anoAtual = new Date().getFullYear();

    // Verifica se o ano está entre 1900 e o ano atual
    if (anoNascimento < 1900 || anoNascimento > anoAtual) {
        return false;
    }

    // Verifica se a data é válida (dia e mês)
    const [ano, mes, dia] = data.split('-').map(Number);
    const dataTeste = new Date(ano, mes - 1, dia); // Mês em JavaScript é 0-indexado (Janeiro = 0)

    // Verifica se o dia e o mês correspondem à data original
    return (
        dataTeste.getFullYear() === ano &&
        dataTeste.getMonth() === mes - 1 &&
        dataTeste.getDate() === dia
    );
}


// Função de login do usuário
function loginUsuario() {
    const usuario = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senhaLogin").value.trim();

    // Obtém os dados armazenados
    const storedEmail = localStorage.getItem("userEmail");
    const storedPassword = localStorage.getItem("userPassword");

    // Valida se as credenciais estão corretas
    if (usuario === storedEmail && senha === storedPassword) {
        window.location.href = "principal.html"; // Redireciona para a tela principal
    } else {
        alert("Email ou senha inválidos. Tente novamente.");
    }
}

// Carregar informações do perfil ao iniciar a página principal
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

    if (userDescription && document.getElementById("user-description")) {
        document.getElementById("user-description").innerText = userDescription;
    }
};

// Função para exibir e armazenar o arquivo anexado
function handleFileUpload(event) {
    const file = event.target.files[0];
    const mediaPreview = document.getElementById("media-preview");

    if (file && file.size > MAX_FILE_SIZE) {
        alert("O arquivo é muito grande! Escolha um arquivo menor que 5MB.");
        return;
    }

    attachedFile = file;
    mediaPreview.innerHTML = `<p>Arquivo anexado: ${file.name}</p>`;
}

// Função para exibir e armazenar a imagem anexada
function handleImageUpload(event) {
    const file = event.target.files[0];
    const mediaPreview = document.getElementById("media-preview");

    if (file && file.size > MAX_FILE_SIZE) {
        alert("A imagem é muito grande! Escolha uma imagem menor que 5MB.");
        return;
    }

    attachedFile = file;

    const reader = new FileReader();
    reader.onload = function(e) {
        mediaPreview.innerHTML = `<img src="${e.target.result}" alt="Prévia da imagem" class="preview-image">`;
    };
    reader.readAsDataURL(file);
}

// Função para publicar texto e arquivos
function publicarTexto() {
    const publishInput = document.getElementById("publishInput");
    const postText = publishInput.value.trim();

    // Verifica se o texto ultrapassa 500 caracteres
    if (postText.length > 500) {
        alert("A postagem não pode ter mais que 500 caracteres.");
        return;
    }

    if (postText !== "") {
        const novoPost = document.createElement("div");
        novoPost.classList.add("post");

        // Conteúdo da postagem
        let postContent = `<p>${postText}</p>`;

        // Verifica se há um arquivo anexado e cria um link para download ou visualização
        if (attachedFile) {
            const fileURL = URL.createObjectURL(attachedFile);

            if (attachedFile.type.startsWith("image/")) {
                postContent += `<img src="${fileURL}" >`;
            } else {
                postContent += `<p>Arquivo anexado: <a href="${fileURL}" download="${attachedFile.name}">${attachedFile.name}</a></p>`;
            }
        }

        // Estrutura do post com o nome do usuário e as ações
        novoPost.innerHTML = `
            <div class="post-header">
                <div class="post-picture">&#9679;</div>
                <span class="post-name">${localStorage.getItem("userName")}</span>
            </div>
            ${postContent}
            <div class="post-actions">
                <span onclick="curtirPost(this)">👍 Curtir</span>
                <span onclick="compartilharPost(this)" data-compartilhar="0">🔄 Compartilhar (0)</span>
                <span onclick="comentarPost(this)">💬 Comentar</span>
            </div>
        `;

        document.getElementById("postsContainer").prepend(novoPost); // Insere o novo post no início
        publishInput.value = ""; // Limpa o campo de entrada
        document.getElementById("media-preview").innerHTML = ""; // Limpa a prévia da mídia
        attachedFile = null; // Limpa o arquivo anexado após publicar
    } else {
        alert("Por favor, insira algum texto para publicar.");
    }
}

// Função para curtir a postagem
function curtirPost(element) {
    let curtirCount = element.getAttribute("data-curtir") || 0;
    curtirCount++;
    element.setAttribute("data-curtir", curtirCount);
    element.innerHTML = `👍 Curtir (${curtirCount})`;
}

// Função para compartilhar a postagem
function compartilharPost(element) {
    let compartilharCount = parseInt(element.getAttribute("data-compartilhar")) || 0;
    compartilharCount++;
    element.setAttribute("data-compartilhar", compartilharCount);
    element.innerHTML = `🔄 Compartilhar (${compartilharCount})`;

    // Exemplo: exibir mensagem de compartilhamento
    alert("Post compartilhado!");
}

// Função para comentar na postagem
function comentarPost(element) {
    const comentario = prompt("Digite seu comentário:");
    if (comentario) {
        const comentarioElement = document.createElement("p");
        comentarioElement.classList.add("comentario");
        comentarioElement.innerText = `💬 ${localStorage.getItem("userName")}: ${comentario}`;
        element.closest(".post").appendChild(comentarioElement);
    }
}

// Capturar o texto digitado e filtrar as mensagens
document.getElementById("searchButton").addEventListener("click", function() {
    const searchTerm = document.getElementById("messageSearch").value.toLowerCase().trim(); // Obtenha o termo de pesquisa
    const posts = document.querySelectorAll("#postsContainer .post"); // Todos os posts
    const resultsContainer = document.getElementById("searchResults"); // Onde os resultados serão exibidos
    resultsContainer.innerHTML = ""; // Limpe os resultados anteriores

    if (searchTerm === "") {
        alert("Por favor, digite um termo para pesquisar.");
        return;
    }

    let foundResults = false;

    posts.forEach(post => {
        const postText = post.querySelector("p").textContent.toLowerCase(); // Obtém o texto do post
        if (postText.includes(searchTerm)) {
            foundResults = true;
            const resultItem = document.createElement("li"); // Cria um item para o resultado
            
            // Destaca o texto correspondente na mensagem
            const highlightedMessage = post.innerHTML.replace(
                new RegExp(`(${searchTerm})`, 'gi'), // Expressão regular para destacar o termo
                '<span class="highlight">$1</span>' // Envolve o termo em uma tag span
            );

            resultItem.innerHTML = highlightedMessage; // Define o conteúdo do item com a mensagem destacada
            resultsContainer.appendChild(resultItem); // Adiciona o item à lista de resultados
        }
    });

    if (!foundResults) {
        const noResultItem = document.createElement("li");
        noResultItem.textContent = "Nenhum post encontrado.";
        resultsContainer.appendChild(noResultItem); // Mostra mensagem de nenhum resultado encontrado
    }
});

// Função de logout
function logout() {
    localStorage.clear(); // Limpa o localStorage ao fazer logout
    window.location.href = "login.html"; // Redireciona para a tela de login
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





