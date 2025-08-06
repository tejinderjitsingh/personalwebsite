/*
* File : To Do Task Manager Application
* Project : To Do Task Manager
* Programmer : Maruf Rasool
* First Version : 2025-08-04
* Description :
* The applicaiton is created to help user for daily task managment
*/

// AI Assistant Functionality
const aiAssistantBtn = document.getElementById('aiAssistantBtn');
const aiAssistantPanel = document.getElementById('aiAssistantPanel');
const closeAIBtn = document.getElementById('closeAIBtn');
const aiConversation = document.getElementById('aiConversation');
const aiUserInput = document.getElementById('aiUserInput');
const aiSendBtn = document.getElementById('aiSendBtn');
const aiQuickQuestions = document.querySelectorAll('.ai-quick-question');

// AI Knowledge Base
const aiKnowledge = {
    "how do i add a task": {
        response: "To add a new task:\n1. Click the '+ Add Task' button\n2. Fill in the task details (title is required)\n3. Set a due date, priority, and category if needed\n4. Click 'Save Task' to add it to your list"
    },
    "how do i delete a task": {
        response: "To delete a task:\n1. Find the task in your list\n2. Click the trash can icon (🗑️) next to the task\n3. Confirm that you want to delete the task"
    },
    "how do i postpone a task": {
        response: "To postpone a task:\n1. Click the edit icon (✏️) next to the task\n2. Update the due date to a later date\n3. Click 'Save Task' to update it"
    },
    "how do i set priorities": {
        response: "You can set priorities when adding or editing a task:\n1. Open the task form\n2. Select the priority level from the dropdown (High, Medium, Low)\n3. High priority tasks should be completed first, then medium, then low"
    },
    "how do i mark a task as complete": {
        response: "To mark a task as complete:\n1. Find the task in your list\n2. Click the checkmark icon (✓) next to the task\n3. The task will be marked as completed and can be hidden using the 'Hide Completed' filter"
    },
    "how do i search for tasks": {
        response: "To search for tasks:\n1. Type your search term in the 'Search tasks...' box\n2. The list will automatically filter to show only tasks that match your search\n3. You can combine this with other filters like category or priority"
    },
    "default": {
        response: "I'm not sure I understand. Try asking about:\n- Adding tasks\n- Deleting tasks\n- Setting priorities\n- Marking tasks as complete\n- Using filters\nOr click one of the quick questions above."
    }
};

// Toggle AI Panel
aiAssistantBtn.addEventListener('click', () => {
    aiAssistantPanel.classList.toggle('hidden');
});

closeAIBtn.addEventListener('click', () => {
    aiAssistantPanel.classList.add('hidden');
});

// Quick Questions
aiQuickQuestions.forEach(question => {
    question.addEventListener('click', (e) => {
        const questionText = e.target.dataset.question;
        addUserMessage(questionText);
        processQuestion(questionText);
    });
});

// Send Message
function sendMessage() {
    const message = aiUserInput.value.trim();
    if (message) {
        addUserMessage(message);
        processQuestion(message);
        aiUserInput.value = '';
    }
}

aiSendBtn.addEventListener('click', sendMessage);
aiUserInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Add user message to conversation
function addUserMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'ai-message user-message';
    messageElement.innerHTML = `<p><strong>You:</strong> ${message}</p>`;
    aiConversation.appendChild(messageElement);
    aiConversation.scrollTop = aiConversation.scrollHeight;
}

// Add AI response to conversation
function addAIResponse(response) {
    const responseElement = document.createElement('div');
    responseElement.className = 'ai-message ai-response';
    responseElement.innerHTML = `<p><strong>AI Assistant:</strong> ${response.replace(/\n/g, '<br>')}</p>`;
    aiConversation.appendChild(responseElement);
    aiConversation.scrollTop = aiConversation.scrollHeight;
}

// Process user question
function processQuestion(question) {
    const lowerQuestion = question.toLowerCase();
    let response = aiKnowledge.default.response;
    
    // Check for matching questions
    for (const [key, value] of Object.entries(aiKnowledge)) {
        if (lowerQuestion.includes(key)) {
            response = value.response;
            break;
        }
    }
    
    // Add slight delay to simulate thinking
    setTimeout(() => {
        addAIResponse(response);
    }, 500);
}
