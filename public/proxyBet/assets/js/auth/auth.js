import AppModule from "../app.module.js";

(function () {
    const app = new AppModule();
    
    // User registration
    document.querySelector('#register').addEventListener('click', function () {
        if (app.validateField('newUser')) {
            if ($('#sign-up-password').val() == $('#confirm-password').val()) {

                let req = {
                    firstName: $('#firstname').val(),
                    lastName: $('#lastname').val(),
                    email: $('#sign-up-email').val(),
                    phone: $('#phone').val(),
                    password: $('#sign-up-password').val()
                }
                $.ajax({
                    url: `${app.BASE_URI}auth/register`,
                    method: "post",
                    dataType: 'json',
                    data: req,
                    beforeSend: () => { $('#register').append($('<span>').addClass('ml-2 spinner-border spinner-border-sm text-white')) },
                    success: (res) => {
                        localStorage.setItem('token', res.token)
                        localStorage.setItem('lastName', res.lastName)
                        localStorage.setItem('email', res.email)
                        localStorage.setItem('isLoggedIn', res.isLoggedIn)
                        localStorage.setItem('role', res.role)
                        localStorage.setItem('firstName', res.firstName)
                        $('.toast-body').addClass('bg-success text-white');
                    },
                    error: (err) => {
                        $('.toast-body').addClass('bg-danger text-white')
                    },
                    complete: (res, state) => {
                        document.querySelector('#firstname').value = null;
                        document.querySelector('#lastname').value = null;
                        document.querySelector('#phone').value = null;
                        document.querySelector('#sign-up-password').value = null;
                        document.querySelector('#sign-up-email').value = null;
                        document.querySelector('#confirm-password').value = null;

                        $('#register span').removeClass('spinner-sm spinner-border text-white')
                        if (state == 'success') {
                            $('.toast-body').html(res.responseJSON.message)
                            $('.toast').toast('show');
                            setTimeout(() => {
                                $('.toast-body').removeClass('bg-success text-white');
                                location.href = 'dashboard.html'
                            }, 6000)
                        }
                        if (state == 'error') {
                            $('.toast-body').html(res.responseJSON.message)
                            $('.toast').toast('show');
                            setTimeout(() => {
                                $('.toast-body').removeClass('bg-danger text-white')
                            }, 6000)
                        }
                    }
                })
            } else {
                $('.toast-body').addClass('bg-warning').html('Password does not match')
                $('.toast').toast('show')
                setTimeout(() => {
                    $('.toast-body').removeClass('bg-warning')
                }, 6000)
            }
        }
    })


    // Login
    document.querySelector('#login').addEventListener('click', function () {
        if (app.validateField('existingUser')) {
            $.ajax({
                url: `${app.BASE_URI}auth/login`,
                method: "post",
                dataType: 'json',
                data: {
                    email: document.querySelector('#email').value,
                    password: document.querySelector('#password').value
                },
                beforeSend: () => {
                    $('#login').append($('<span>').addClass('ml-2 spinner-border spinner-border-sm text-white'))
                },
                success: (res) => {
                    localStorage.setItem('token', res.token)
                    localStorage.setItem('lastName', res.lastName)
                    localStorage.setItem('email', res.email)
                    localStorage.setItem('isLoggedIn', res.isLoggedIn)
                    localStorage.setItem('role', res.role)
                    localStorage.setItem('firstName', res.firstName)
                    $('.toast-body').addClass('bg-success text-white');
                },
                error: () => {
                    $('.toast-body').addClass('bg-danger text-white');
                },
                complete: (x, state) => {
                    document.querySelector('#email').value = null;
                    document.querySelector('#password').value = null;

                    $('#login span').removeClass('spinner-sm spinner-border text-white')
                    if (state == 'success') {
                        $('.toast-body').html(x.responseJSON.message)
                        $('.toast').toast('show');
                        setTimeout(() => {
                            console.log(x.responseJSON.user);
                            $('.toast-body').removeClass('bg-success text-white')

                        }, 6000)
                        switch (x.responseJSON.role) {
                            case "Admin":
                                location.href = 'admin/dashboard.html'
                                break;
                            default: location.href = 'dashboard.html'
                        }
                    }
                    if (state == 'error') {
                        $('.toast-body').html(x.responseJSON.message)
                        $('.toast').toast('show');
                        setTimeout(() => {
                            $('.toast-body').removeClass('bg-danger text-white')
                        }, 6000)
                    }
                }
            })
        }
    })
})();