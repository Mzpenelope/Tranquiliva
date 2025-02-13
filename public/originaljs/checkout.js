var therapistInformation;
var totalPrice;
$(document).ready(async function () {
    // AJAX call that checks the status of a cart to see if there is an item in the shopping cart.
    await $.ajax({
        url: '/checkStatus',
        method: 'GET',
        success: function (cart) {
            if (cart) {
                $('#orderNumber').text(`${cart.orderId}`)
                $("#noOrderSummary").hide();
                $("#orderSummary").show();
                getTherapist(cart.therapist);
                $('#cartPlan').val(`${cart.timeLength}`)
                updateCart();
            }
        }
    })
});

/**
 * This function finds the therapist from the cart and displays their info.
 */
function getTherapist(therapistId) {
    $.ajax({
        url: '/getTherapistInfo',
        method: "POST",
        data: {
            therapistId: therapistId
        },
        success: function (therapist) {
            $('#therapistName').text(`${therapist.firstName} ${therapist.lastName}`)
            $('#therapistDesc').text(`${therapist.yearsExperience} years of experience in the profession, and offers $${therapist.sessionCost} per session`)
            $('#therapistImg').attr('src', `${therapist.profileImg}`)
            therapistInformation = therapist;
            therapistInformation._id = therapistId;
            calculateCost();
        }
    })
}

/**
 * Calculates the cost, tax, and total based on the selected time length.
 */
function calculateCost() {
    let multiplier;
    if ($('#cartPlan').val() == "freePlan") {
        multiplier = 0;
    } else if ($('#cartPlan').val() == "monthPlan") {
        multiplier = 1;
    } else if ($('#cartPlan').val() == "threeMonthPlan") {
        multiplier = 2;
    } else {
        multiplier = 4;
    }
    $("#cartCost").html(`${parseFloat(therapistInformation.sessionCost * multiplier).toFixed(2)}`)
    $("#subTotal").html(`${parseFloat(therapistInformation.sessionCost * multiplier).toFixed(2)}`)
    $("#taxTotal").html(`$${parseFloat(therapistInformation.sessionCost * multiplier * 0.09).toFixed(2)}`)
    $("#total").html(`$${parseFloat(therapistInformation.sessionCost * multiplier * 1.09).toFixed(2)}`)
    totalPrice = parseFloat(therapistInformation.sessionCost * multiplier * 1.09).toFixed(2);
}

/**
 * This function allows users to change their shopping cart's timelength and updates the cart.
 */
function updateCart() {
    $('#cartPlan').change(() => {
        $.ajax({
            url: '/updateCart',
            type: 'PUT',
            data: {
                timeLength: $('#cartPlan').val()
            },
            success: function () {
                calculateCost();
            }
        })
    })
}

/**
 * This function confirms the order after payment via Paystack.
 */
function handleConfirmOrder(data) {
    if (data.errorMsg) {
        checkoutErrorMsg.style.display = 'block';
        checkoutErrorMsg.innerHTML = data.errorMsg;
    } else {
        checkoutErrorMsg.style.display = 'none';
        document.getElementById('signupSuccessModal').style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Directly redirect to the thank-you page after payment is successful
        setTimeout(() => {
            window.location = "/thank-you"; // Redirect to the thank you page
        }, 2500); // Delay for 2.5 seconds before redirecting
    }
}

/**
 * Calls Paystack to initiate the payment and confirm the order after payment.
 */
document.getElementById('confirmOrder').onclick = function () {
    const time = new Date();
    var timeLengthforUse;
    var selectedTime = $('#cartPlan').val();
    
    // Determine session time based on plan
    if (selectedTime == "freePlan") {
        timeLengthforUse = new Date(time.setMinutes(time.getMinutes() + 3)); // 3 minutes for free plan
    } else if (selectedTime == "monthPlan") {
        timeLengthforUse = new Date(time.setMinutes(time.getMinutes() + 5)); // 5 minutes for month plan
    } else if (selectedTime == "threeMonthPlan") {
        timeLengthforUse = new Date(time.setMinutes(time.getMinutes() + 10)); // 10 minutes for three-month plan
    } else if (selectedTime == "yearPlan") {
        timeLengthforUse = new Date(time.setMinutes(time.getMinutes() + 15)); // 15 minutes for year plan
    }

    // Proceed with Paystack payment
    var paystackKey = "pk_live_3001635563023ef59bd812e9102d00e4b4367b86";  // Replace with your Paystack public key
    var userEmail = sessionStorage.getItem('userEmail') || 'user@example.com';  // Use the user's email dynamically
    const paystackPaymentAmount = parseFloat(totalPrice.replace('$', '').trim()) * 100;  // Convert total price to kobo (smallest currency unit)

    const paystackPaymentHandler = PaystackPop.setup({
        key: paystackKey, // Paystack public key
        email: userEmail, // Dynamically set the user's email
        amount: paystackPaymentAmount, // Convert the amount to kobo
        currency: "GHS", // Currency code (GHS for Ghanaian cedi)
        ref: 'order_' + Math.floor(Math.random() * 1000000), // Generate unique transaction reference
        onClose: function () {
            alert('Transaction was not completed');
        },
        callback: function (response) {
            // On successful payment, just redirect the user to the thank-you page
            if (response.status === "success") {
                var paymentReference = response.reference;  // Capture the reference here

                // Redirect to the thank you page after successful payment
                window.location = "/thank-you"; // You can also add order details if needed (via sessionStorage or URL params)
            } else {
                alert('Payment was not successful. Please try again.');
            }
        }
    });

    // Open Paystack payment modal
    paystackPaymentHandler.openIframe();
}


/**
 * Print invoice function for the order
 */
function printInvoice() {
    var printWindow = window.open('', 'new div', 'height=600,width=600');
    printWindow.document.write('<html><head><title>Print Invoice</title>');
    printWindow.document.write('<link rel="stylesheet" type="text/css" href="../css/style.css" />');
    printWindow.document.write('</head><body> <div id="wrapper"><div id="orderSummary" style="display: block;">');
    printWindow.document.write('<div id="orderNumSec"><h2>Order: <span id="orderNumber">MM0509123456</span></h2></div><div id="orderTable">');
    printWindow.document.write(document.getElementById('orderTable').innerHTML);
    printWindow.document.write('</div><hr /><div id="cartTotalSec">');
    printWindow.document.write(document.getElementById('cartTotalSec').innerHTML);
    printWindow.document.write('</div>');
    printWindow.document.write('</div></div></body></html>');
    printWindow.document.close();

    setTimeout(() => {
        printWindow.focus();
        printWindow.print();
    }, 1000);
    return false;
}

/**
 * Remove item from cart modal logic
 */
var removeOrderModal = document.getElementById("removeOrderModal");
document.getElementById('removeItem').onclick = function (e) {
    removeOrderModal.style.display = "block";
    document.body.style.overflow = 'hidden';

    document.getElementById('removeOrderBtn').onclick = function () {
        $.ajax({
            url: '/deleteCart',
            type: 'DELETE',
            success: function (data) {
                removeOrderModal.style.display = "none";
                document.getElementById('signupSuccessModal').style.display = 'flex';
                document.body.style.overflow = 'hidden';
                setTimeout(() => {
                    location.reload();
                }, 2500);
            }
        })
    }
}

document.getElementById("cancelRemove").onclick = function () {
    removeOrderModal.style.display = "none";
    document.body.style.overflow = 'auto';
}

window.onclick = function (event) {
    if (event.target == removeOrderModal) {
        removeOrderModal.style.display = "none";
        document.body.style.overflow = 'auto';
    }
}
