window.addEventListener('load', async () => {
    document.getElementById("login-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch('http://localhost:5678/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            }); 

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                window.location.href = 'index.html';
            } else if (response.status === 401) {
                alert('Identifiants incorrects');
            } else if (response.status === 404) {
                alert('Utilisateur non trouvé');
            } else {
                alert('Une erreur est survenue');
            }
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            alert('Une erreur est survenue lors de la connexion');
        }
    });
});