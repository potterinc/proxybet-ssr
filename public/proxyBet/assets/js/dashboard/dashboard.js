// import AppModule from '/assets/js/app.module.js'

// const app = new AppModule();
const BASE_URI = 'http://localhost:3000/api/';

(function () {

    // Active Session
    if (localStorage.getItem('isLoggedIn') == 'true')
        document.querySelector('.fullname').innerHTML = `${localStorage.getItem('firstName')} ${localStorage.getItem('lastName')}`
    else
        location.href = '/auth.html'

    //Load Gameslips
    $.ajax({
        url: `${BASE_URI}user/bet`,
        dataType: 'json',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        complete: (res) => {
            $('#betslips').html(res.responseText)
        }
    })

    //Load Betslips
    $('#gameslips').load(`${BASE_URI}admin/ticket`)

    // Place Bet
    $('#place-bet').on('click', () => {
        if (validateField('isValid')) {
            $.ajax({
                url: `${BASE_URI}user/bet`,
                method: 'post',
                dataType: 'json',
                beforeSend: () => {
                    $('#place-bet').append($('<span>').addClass('ml-2 spinner-border spinner-border-sm text-white'))
                },
                data: {
                    stake: $('#stake').val(),
                    gameSlip: $('#gameid').val(),
                    cashOut: $('#cashout').val()
                },
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                success: (res) => {
                    $('.toast-body').addClass('bg-success text-white').html(res.message);
                },
                error: () => { $('.toast-body').addClass('bg-danger text-white'); },
                complete: (res, state) => {
                    $('#place-bet span').removeClass('spinner-sm spinner-border text-white')

                    switch (state) {
                        case 'success':
                            $('.toast').toast('show');
                            setTimeout(() => { location.href = "dashboard.html" }, 5000)
                            break;
                        case 'error':
                            $('.toast').toast('show');
                            $('#gameid').val(null)
                            $('#maxstake').val(null)
                            $('#totalodds').val(null)
                            $('#stake').val(null)
                            $('#slipbonus').val(null)
                            $('#cashout').val(null)
                            $('.toast-body').html(res.responseJSON.message)
                            break;
                    }
                    setTimeout(() => $('.toast-body').removeClass('bg-danger bg-success text-white'), 5000)
                }
            })
        }
    })

    $('.logout').on('click', function () {
        localStorage.clear()
        location.href = 'index.html'
    })

    // Cash calculator
    document.querySelector('#stake').addEventListener('change', () => {
        const odds = parseFloat($('#totalodds').val());
        const stake = parseFloat($('#stake').val());
        const _bonus = parseFloat($('#slipbonus').val());
        const bonus = (odds * stake) * (_bonus/100)

        $('#cashout').val((odds * stake) + bonus)
});
}) ()

// View Ticket
function viewOneTicket(gameSlip) {
    $.ajax({
        url: `${BASE_URI}admin/ticket/${gameSlip}`,
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        dataType: 'json',
        success: (res) => {
            $('#gameid').val(res.slip._id.toUpperCase())
            $('#maxstake').val(res.slip.maximumStake)
            $('#totalodds').val(res.slip.totalOdds)
            $('#slipbonus').val(res.slip.ticketBonus)
        }
    })
}
// Form Validator
function validateField(inputArgs) {
    let validInput = $(`[${inputArgs}]`);
    for (let formControl = 0; formControl < validInput.length; formControl++) {
        if (validInput.get(formControl).value == null || validInput.get(formControl).value == '') {
            validInput[formControl].placeholder = 'This field is required';
            validInput[formControl].style.borderWidth = '5px';
            validInput[formControl].style.borderStyle = 'solid';
            validInput[formControl].style.borderLeftColor = '#a00';
            return false;
        }
    }
    return true;
}