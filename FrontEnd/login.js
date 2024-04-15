const emailElem = document.getElementById('email');
const passwordElem = document.getElementById('password');


// Actions

async function login(email, password)
{
    throw new Error('@TODO');
    // throw new Error('Erreur dans l’identifiant ou le mot de passe');
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