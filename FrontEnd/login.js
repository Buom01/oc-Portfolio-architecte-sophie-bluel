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

        sessionStorage.setItem('token', token);
        sessionStorage.setItem('userId', userId);

        return userId;
    }
    else if (res.status == 401 || res.status == 404)
        throw new Error('Erreur dans l’identifiant ou le mot de passe');
    else
        throw new Error('Erreur inconnue');
}


// Events handling

async function loginSubmit(e)
{
    e.preventDefault();

    let email = emailElem.value;
    let password = passwordElem.value;
    login(email, password)
        .then(
            () =>
            {
                window.location = './index.html';
            }
        )
        .catch(
            ({message}) =>
                alert(message)
        );

}

// Main

document.getElementById('login-form')
    .addEventListener('submit', loginSubmit);