// Função auxiliar para salvar o token no localStorage
function saveToken(token) {
    localStorage.setItem('token', token);
  }
  
  // Função para obter o token
  function getToken() {
    return localStorage.getItem('token');
  }
  
  // Exemplo de chamada à API para login
  if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      try {
        const res = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.token) {
          saveToken(data.token);
          alert('Login realizado com sucesso!');
          window.location.href = 'index.html';
        } else {
          alert(data.message || 'Erro no login');
        }
      } catch (error) {
        console.error(error);
        alert('Erro na conexão com o servidor');
      }
    });
  }
  
  // Função para registrar usuário (usado em register.html)
  if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      try {
        const res = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        if (data.token) {
          saveToken(data.token);
          alert('Registro realizado com sucesso!');
          window.location.href = 'index.html';
        } else {
          alert(data.message || 'Erro no registro');
        }
      } catch (error) {
        console.error(error);
        alert('Erro na conexão com o servidor');
      }
    });
  }
  
  // Exemplo para criar uma doação e, se for PIX, buscar QR Code (usado em donate.html)
  if (document.getElementById('donationForm')) {
    document.getElementById('donationForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const type = document.getElementById('donationType').value;
      const amount = document.getElementById('donationAmount').value;
      try {
        const token = getToken();
        const res = await fetch('http://localhost:5000/api/donations', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({ type, amount })
        });
        const data = await res.json();
        if (data.donation) {
          if (type === 'pix') {
            // Se for PIX, buscar o QR Code
            const qrRes = await fetch(`http://localhost:5000/api/donations/pix/qrcode?amount=${amount}`, {
              headers: { 'Authorization': 'Bearer ' + token }
            });
            const qrData = await qrRes.json();
            if (qrData.qrCode) {
              document.getElementById('qrCodeContainer').innerHTML = `<img src="${qrData.qrCode}" alt="QR Code para PIX">`;
            }
          }
          alert('Doação criada com sucesso!');
        } else {
          alert(data.message || 'Erro ao criar doação');
        }
      } catch (error) {
        console.error(error);
        alert('Erro na conexão com o servidor');
      }
    });
  }
  