document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registroForm');
    const submitBtn = document.getElementById('submitBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const btnText = submitBtn.querySelector('span');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxvPokc8QbtgAArXUEX_0Jxg7s8HX8G26OlU5EVPGIPHWcjtzmHhGlw-GWP2tz0WrUz/exec';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        submitBtn.disabled = false;
        submitBtn.classList.add('opacity-80', 'cursor-not-allowed');
        btnText.textContent = 'Enviando...';
        loadingSpinner.classList.remove('hidden');
        errorMessage.classList.add('hidden');

        const formData = new FormData(form);

        const data = {
            correo: formData.get('correo'),
            matricula: formData.get('matricula'),
            nombre: formData.get('nombre'),
            apellidos: formData.get('apellidos'),
            carrera: formData.get('carrera'),
            cuatrimestre: formData.get('cuatrimestre')
        };

        try {
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.status === 'success') {
                form.classList.add('hidden');
                successMessage.classList.remove('hidden');

                try {
                    const apkUrl = 'downloads/mathstack-v1.1.1.apk';
                    const apkResponse = await fetch(apkUrl, { method: 'HEAD' });
                    if (apkResponse.ok) {
                        document.getElementById('androidModal').classList.remove('hidden');
                    }
                } catch (e) {
                    console.log("APK no disponible para descarga automática");
                }
            } else {
                throw new Error(result.message || 'Error desconocido del servidor');
            }
        } catch (error) {
            console.error('Error al enviar:', error);
            errorMessage.classList.remove('hidden');

            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-80', 'cursor-not-allowed');
            btnText.textContent = 'Completar Registro';
            loadingSpinner.classList.add('hidden');
        }
    });
});

window.cerrarModal = function () {
    document.getElementById('androidModal').classList.add('hidden');
};

window.confirmarDescarga = async function () {
    cerrarModal();
    try {
        const apkUrl = 'downloads/mathstack-v1.1.1.apk';
        const response = await fetch(apkUrl, { method: 'HEAD' });
        if (response.ok) {
            window.location.href = apkUrl;
        } else {
            alert("Próximamente estará disponible la descarga de MathStack.");
        }
    } catch (error) {
        console.error("Error checking APK:", error);
        alert("Próximamente estará disponible la descarga de MathStack.");
    }
};
