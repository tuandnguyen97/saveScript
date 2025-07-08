// Đặt hàm này ở đầu file app.js
function escapeHTML(str) {
    const p = document.createElement('p');
    p.textContent = str;
    return p.innerHTML;
}

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
            item.dataset.index = index; // Gán index vào item
    
            // Cấu trúc mới cho mỗi item
            item.innerHTML = `
                <div class="template-header">
                    <span class="name">${escapeHTML(template.name)}</span>
                    <div class="actions">
                        <button class="copy-btn" data-index="${index}">Copy</button>
                        <button class="edit-btn" data-index="${index}">Sửa</button>
                        <button class="delete-btn" data-index="${index}">Xóa</button>
                    </div>
                </div>
                <div class="template-code-content">
                    <pre><code>${escapeHTML(template.code)}</code></pre>
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
        
        // 1. Xử lý click vào các nút actions (Copy, Sửa, Xóa)
        if (target.closest('.actions')) {
            const index = target.dataset.index;
            if (target.classList.contains('delete-btn')) {
                if (confirm('Bạn có chắc muốn xóa template này?')) {
                    let templates = getTemplates();
                    templates.splice(index, 1);
                    saveTemplates(templates);
                    renderTemplates();
                }
            } else if (target.classList.contains('copy-btn')) {
                const templates = getTemplates();
                navigator.clipboard.writeText(templates[index].code).then(() => {
                    // Thay đổi tạm thời text của nút để phản hồi
                    target.textContent = 'Đã Copy!';
                    setTimeout(() => { target.textContent = 'Copy'; }, 1500);
                });
            } else if (target.classList.contains('edit-btn')) {
                alert(`Tính năng edit cho template ${index} đang được phát triển!`);
            }
            return; // Dừng xử lý để không bị trigger mở/đóng item
        }
    
        // 2. Xử lý click vào item để mở/đóng dropdown
        const clickedItem = target.closest('.template-item');
        if (clickedItem) {
            // Tìm phần nội dung code tương ứng
            const content = clickedItem.querySelector('.template-code-content');
            
            // Đóng tất cả các item khác trước khi mở item mới
            document.querySelectorAll('.template-item').forEach(item => {
                if (item !== clickedItem && item.classList.contains('active')) {
                    item.classList.remove('active');
                    item.querySelector('.template-code-content').style.display = 'none';
                }
            });
    
            // Mở hoặc đóng item được click
            clickedItem.classList.toggle('active');
            if (clickedItem.classList.contains('active')) {
                content.style.display = 'block';
            } else {
                content.style.display = 'none';
            }
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