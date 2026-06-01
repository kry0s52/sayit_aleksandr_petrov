AOS.init({ duration: 800, once: true });

const form = document.getElementById('contactForm');
const statusDiv = document.getElementById('formStatus');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    statusDiv.style.display = 'none';
    statusDiv.className = 'form-status';
    
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
    submitBtn.disabled = true;
    
    const formData = new FormData(form);
    
    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        });
        
        if (response.ok) {
            statusDiv.textContent = '✅ Спасибо! Ваше сообщение успешно отправлено. Мы свяжемся с вами в ближайшее время.';
            statusDiv.classList.add('success');
            form.reset();
        } else {
            throw new Error('Ошибка отправки');
        }
    } catch (error) {
        statusDiv.textContent = '❌ Произошла ошибка. Пожалуйста, попробуйте ещё раз или напишите нам в Telegram: @kry0s67';
        statusDiv.classList.add('error');
    }
    
    statusDiv.style.display = 'block';
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 6000);
});
