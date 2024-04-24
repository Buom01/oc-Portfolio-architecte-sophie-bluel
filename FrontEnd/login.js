const emailElem = document.getElementById('email');
const passwordElem = document.getElementById('password');


// Actions

async function login(email, password)
{
    let res = await fetch(
        "http://localhost:5678/api/users/login",
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        }
    )

    if (res.ok)
    {
        let {userId, token} = await res.json();

        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);

        return userId;
    }
    else if (res.status == 401 || res.status == 404)
        throw new Error('Erreur dans l’identifiant ou le mot de passe');
    else
        throw new Error('Erreur inconnue');
}

function redirectWhenLogged()
{
    window.location = './index.html';
}


// Events handling

async function loginSubmit(e)
{
    e.preventDefault();

    let email = emailElem.value;
    let password = passwordElem.value;
    login(email, password)
        .then(redirectWhenLogged)
        .catch(
            ({message}) =>
                alert(message)
        );

}

// Main

document.getElementById('login-form')
    .addEventListener('submit', loginSubmit);

if (localStorage.getItem('token') && localStorage.getItem('userId'))
    redirectWhenLogged();