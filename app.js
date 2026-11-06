const API_URL = "https://jsonplaceholder.typicode.com/posts"

const loadButton = document.getElementById("load-btn")
const list = document.getElementById("posts")
const emptyMessage = document.getElementById("empty")
const form = document.getElementById("post-form")
const titleInput = document.getElementById("title")
const bodyInput = document.getElementById("body")
const submitButton = document.getElementById("submit-btn")
const messageBox = document.getElementById("message")

function showError(inputId, message) {
    document.getElementById(`${inputId}Error`).textContent = message
    document.getElementById(inputId).classList.toggle("invalid", message !== "")
}

function showMessage(text, type) {
    messageBox.textContent = text
    messageBox.classList.remove("success", "failure")
    if (type) {
        messageBox.classList.add(type)
    }
}

const validateTitle = (value) => {
    if (value.trim() === "") return "Введите заголовок"
    return ""
}

const validateBody = (value) => {
    if (value.trim() === "") return "Введите текст публикации"
    return ""
}

function createPostItem(post) {
    const item = document.createElement("li")
    const id = document.createElement("span")
    id.textContent = `Post ${post.id}`
    id.classList.add("post-id")
    const title = document.createElement("h3")
    title.textContent = post.title
    const body = document.createElement("p")
    body.textContent = post.body
    item.append(id, title, body)
    return item
}

function updateEmptyMessage() {
    emptyMessage.classList.toggle("hidden", list.children.length > 0)
}

function renderPosts(posts) {
    list.textContent = ""

    for (let i = 0; i < posts.length; i++) {
        list.appendChild(createPostItem(posts[i]))
    }

    updateEmptyMessage()
}

async function loadPosts() {
    showMessage("Загрузка...", "")
    loadButton.disabled = true

    try {
        const response = await fetch(`${API_URL}?_limit=5`)
        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`)
        }
        const posts = await response.json()
        renderPosts(posts)
        showMessage(`Загружено публикаций: ${posts.length}`, "success")
    } catch (error) {
        showMessage(`Не удалось загрузить публикации: ${error.message}. Попробуйте ещё раз.`, "failure")
    } finally {
        loadButton.disabled = false
    }
}

async function createPost(event) {
    event.preventDefault()

    const title = titleInput.value.trim()
    const body = bodyInput.value.trim()

    const titleError = validateTitle(title)
    const bodyError = validateBody(body)

    showError("title", titleError)
    showError("body", bodyError)

    if (titleError || bodyError) {
        showMessage("Заполните все поля формы", "failure")
        return
    }

    showMessage("Отправка...", "")
    submitButton.disabled = true

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: title, body: body, userId: 1 })
        })
        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`)
        }
        const data = await response.json()

        list.prepend(createPostItem(data))
        updateEmptyMessage()
        form.reset()
        showMessage(`Публикация создана. Заголовок: «${data.title}», ID: ${data.id}`, "success")
    } catch (error) {
        showMessage(`Не удалось создать публикацию: ${error.message}. Попробуйте ещё раз.`, "failure")
    } finally {
        submitButton.disabled = false
    }
}

loadButton.addEventListener("click", loadPosts)
form.addEventListener("submit", createPost)
