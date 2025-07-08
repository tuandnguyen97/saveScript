document.addEventListener('DOMContentLoaded', () => {
    const templatesList = document.getElementById('templates-list');
    const saveBtn = document.getElementById('save-template-btn');
    const newNameInput = document.getElementById('new-template-name');
    const newCodeInput = document.getElementById('new-template-code');
    const closeBtn = document.getElementById('close-btn');

    const getTemplates = () => {
        const templates = localStorage.getItem('myCodeTemplates');
        return templates ? JSON.parse(templates) : [];
    };

    const saveTemplates = (templates) => {
        localStorage.setItem('myCodeTemplates', JSON.stringify(templates));
    };

    const renderTemplates = () => {
        templatesList.innerHTML = '';
        const templates = getTemplates();
        if (templates.length === 0) {
            templatesList.innerHTML = '<p>Chưa có template nào. Hãy thêm một cái mới!</p>';
            return;
        }

        templates.forEach((template, index) => {
            const item = document.createElement('div');
            item.className = 'template-item';
            item.innerHTML = `
                <span class="name">${template.name}</span>
                <div class="actions">
                    <button class="copy-btn" data-index="${index}">Copy</button>
                    <button class="edit-btn" data-index="${index}">Sửa</button>
                    <button class="delete-btn" data-index="${index}">Xóa</button>
                </div>
            `;
            templatesList.appendChild(item);
        });
    };

    const addTemplate = () => {
        const name = newNameInput.value.trim();
        const code = newCodeInput.value.trim();

        if (!name || !code) {
            alert('Tên và code không được để trống!');
            return;
        }

        const templates = getTemplates();
        templates.push({ name, code });
        saveTemplates(templates);
        renderTemplates();

        // Xóa trống form
        newNameInput.value = '';
        newCodeInput.value = '';
    };
    
    // Sử dụng event delegation để xử lý các nút
    templatesList.addEventListener('click', (e) => {
        const target = e.target;
        const index = target.dataset.index;

        if (target.classList.contains('delete-btn')) {
            if (confirm('Bạn có chắc muốn xóa template này?')) {
                let templates = getTemplates();
                templates.splice(index, 1);
                saveTemplates(templates);
                renderTemplates();
            }
        }

        if (target.classList.contains('copy-btn')) {
            const templates = getTemplates();
            navigator.clipboard.writeText(templates[index].code).then(() => {
                alert('Đã copy vào clipboard!');
            }).catch(err => {
                console.error('Lỗi khi copy: ', err);
            });
        }
        
        if (target.classList.contains('edit-btn')) {
             // Logic để edit sẽ phức tạp hơn một chút
             // Bạn có thể hiện một modal hoặc thay đổi form thêm mới thành form edit
            alert(`Tính năng edit cho template ${index} đang được phát triển!`);
        }
    });

    closeBtn.addEventListener('click', () => {
        // Gửi thông điệp ra ngoài để trang cha đóng iframe
        window.parent.postMessage('close-template-overlay', '*');
    });

    saveBtn.addEventListener('click', addTemplate);

    // Render lần đầu
    renderTemplates();
});