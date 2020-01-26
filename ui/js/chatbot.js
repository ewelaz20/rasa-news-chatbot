
$(document).ready(function () {


// ------------------------------------------ Toggle chatbot -----------------------------------------------
//function to click and open chatbot from icon





$('.home_button').click(function () {
		//$('.profile_div').toggle();
		$('.chatCont').toggle();
		$('.bot_profile').toggle();
		$('.chatForm').toggle();
		document.getElementById('chat-input').focus();
	});

//function to click and close chatbot to icon
$('.close').click(function () {
    //$('.profile_div').toggle();
    $('.chatCont').toggle();
    $('.bot_profile').toggle();
    $('.chatForm').toggle();
});




// on input/text enter--------------------------------------------------------------------------------------

$('#chat-input').on('keyup keypress', function (e) {
    var keyCode = e.keyCode || e.which;
    var text = $("#chat-input").val();
    if (keyCode === 13) {
        if (text == "" || $.trim(text) == '') {
            e.preventDefault();
            return false;
        } else {
            $("#chat-input").blur();
            setUserResponse(text);
            send(text);
            e.preventDefault();
            return false;
        }
    }
});


//------------------------------------------- Call the RASA API--------------------------------------
function send(text) {


    $.ajax({
        url: 'http://localhost:5005/webhooks/rest/webhook', //  RASA API
        type: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            "sender": "user",
            "message": text
        }),
        success: function (data, textStatus, xhr) {
            console.log(data);

            if (Object.keys(data).length !== 0) {
                for (i = 0; i < Object.keys(data[0]).length; i++) {
                    if (Object.keys(data[0])[i] == "buttons") { //check if buttons(suggestions) are present.
                        addSuggestion(data[0]["buttons"])
                    }

                }
            }

            setBotResponse(data);

        },
        error: function (xhr, textStatus, errorThrown) {
            console.log('Error in Operation');
            setBotResponse('error');
        }
    });





}


//------------------------------------ Set bot response in result_div -------------------------------------
function setBotResponse(val) {
    setTimeout(function () {

        if ($.trim(val) == '' || val == 'error') { //if there is no response from bot or there is some error
            val = 'Sorry I wasn\'t able to understand your Query. Let\' try something else!'
            var BotResponse = '<p class="botResult">' + val + '</p><div class="clearfix"></div>';
            $(BotResponse).appendTo('#result_div');
        } else {

            //if we get message from the bot succesfully
            var msg = "";
            for (var i = 0; i < val.length; i++) {
                if (val[i]["image"]) { //check if there are any images
                    msg += '<p class="botResult"><img  width="200" height="124" src="' + val[i].image + '/"></p><div class="clearfix"></div>';
                } else {
                    msg += '<p class="botResult">' + val[i].text + '</p><div class="clearfix"></div>';
                }

            }
            BotResponse = msg;
            $(BotResponse).appendTo('#result_div');
        }
        scrollToBottomOfResults();
        hideSpinner();
    }, 500);
}


//------------------------------------- Set user response in result_div ------------------------------------
function setUserResponse(val) {
    var UserResponse = '<p class="userEnteredText">' + val + '</p><div class="clearfix"></div>';
    $(UserResponse).appendTo('#result_div');
    $("#chat-input").val('');
    scrollToBottomOfResults();
    showSpinner();
    $('.suggestion').remove();
}


//---------------------------------- Scroll to the bottom of the results div -------------------------------
function scrollToBottomOfResults() {
    var terminalResultsDiv = document.getElementById('result_div');
    terminalResultsDiv.scrollTop = terminalResultsDiv.scrollHeight;
}


//---------------------------------------- Spinner ---------------------------------------------------
function showSpinner() {
    $('.spinner').show();
}

function hideSpinner() {
    $('.spinner').hide();
}




//------------------------------------------- Buttons(suggestions)--------------------------------------------------
function addSuggestion(textToAdd) {
    setTimeout(function () {
        var suggestions = textToAdd;
        var suggLength = textToAdd.length;
        $('<p class="suggestion"></p>').appendTo('#result_div');
        // Loop through suggestions
        for (i = 0; i < suggLength; i++) {
            $('<span class="sugg-options">' + suggestions[i].title + '</span>').appendTo('.suggestion');
        }
        scrollToBottomOfResults();
    }, 1000);
}


// on click of suggestions get value and send to API.AI
$(document).on("click", ".suggestion span", function () {
    var text = this.innerText;
    setUserResponse(text);
    send(text);
    $('.suggestion').remove();
});
// Suggestions end -----------------------------------------------------------------------------------------


});
