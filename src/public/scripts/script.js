

async function handleLoginSubmit(event){

    event.preventDefault();
    const form = document.getElementById("login-form");

    const formData = {
        // @ts-ignore
        email: form.elements.email.value,
        // @ts-ignore
        password: form.elements.password.value
    };

    const response = await fetch("/auth/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });

    if(response.ok){
        window.location.href = "/";
        return;
    }
    const responseJSON = await response.json();

    const errorElement = document.getElementById("form-error");
    // @ts-ignore
    errorElement.textContent = responseJSON.message;

}
