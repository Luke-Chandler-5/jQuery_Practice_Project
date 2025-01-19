$(document).ready(function(){
    var currentRotation = 0;
    var scanCode = [45, 90, 135, 90, 135, 180]; // Define the scan sequence
    var currentIndex = 0; // Initialize index for current rotation in the scan sequence
    var selectorOpen = false;
    var buttonActive = false; // Track if the activation button is active or not
	var rechargeMode = false;
	var isScanning = false;
	var transformed = false;

    $("#activation-button").click(function(){
       if(!buttonActive && rechargeMode == true){
            reminder();
        }
		else if (!buttonActive && rechargeMode == false) {
            // If button is not active, activate the effects
            activateButtonEffects();
        } else {
            // If button is active, deactivate the effects
            deactivateButtonEffects();
        }
    });

    function activateButtonEffects() {
        buttonActive = true; // Set button active
        $(".glow").show();
        $(".glow").animate({width: '242px', height: '242px'}, 230, "linear");
        $("#onmitrix, .light").addClass("active-light");
        $(".light").addClass("active-glow");
        $('#faceplate').css('transform', 'translate(-50%, -50%) scale(1.1)');
        $('#onmitrix').css('transform', 'scale(1.1)');
        $(".corner-left, .corner-left-inner").delay(300).animate({left: '-33%'}, "slow", "swing");
        $(".corner-right, .corner-right-inner").delay(300).animate({right: '-33%'}, "slow", "swing");
        $(".selector, .selector-glow").delay(320).animate({width: '150px', height: '150px'}, "slow", "swing", function(){
            selectorOpen = true;
            updateOptionBasedOnRotation();
        });
    }

    function deactivateButtonEffects() {
        buttonActive = false; // Set button inactive
		// Hide all options when deactivating the effects
        $(".option").hide();
        $(".glow").animate({width: '220px', height: '220px'}, 235, "linear");
        $('#faceplate').css('transform', 'translate(-50%, -50%) scale(1)');
        $('#onmitrix').css('transform', 'scale(1)');
        $(".corner-left, .corner-left-inner").delay(300).animate({left: '-95%'}, 800, "swing");
        $(".corner-right, .corner-right-inner").delay(300).animate({right: '-95%'}, 800, "swing", function(){
		$(".glow").hide();
		$("#onmitrix, .light").removeClass("active-light");
		$(".light").removeClass("active-glow");
		$('#onmitrix').removeAttr('style');
		});
        $(".selector, .selector-glow").delay(320).animate({width: '0px', height: '0px'}, 650, "swing", function(){
            selectorOpen = false;
        });
}

    // Listen for left and right arrow key press
    $(document).keydown(function(e) {
        if (e.keyCode == 37) { // Left arrow key
            currentRotation -= 45;
            rotateFacePlateAnimated(currentRotation);
            checkScanSequence();
            updateOptionBasedOnRotation();
        } else if (e.keyCode == 39) { // Right arrow key
            currentRotation += 45;
            rotateFacePlateAnimated(currentRotation);
            checkScanSequence();
            updateOptionBasedOnRotation();
        } else if (e.keyCode == 13 && selectorOpen == true) {
			transform();
	}
    });

    // Function to animate rotation
    function rotateFacePlateAnimated(degrees) {
        $('#face-plate-sec').stop().animate({ rotation: degrees }, {
            step: function(now) {
                $(this).css('transform', 'rotate(' + now + 'deg)');
            },
            duration: 200 // Adjust duration as needed
        });
    }

    // Function to check scan sequence
    function checkScanSequence() {
        if (!transformed && !rechargeMode && currentIndex < scanCode.length && currentRotation === scanCode[currentIndex]) {
            currentIndex++; // Move to the next index in the sequence
            if (currentIndex === scanCode.length) {
                // If all elements in the sequence have been matched
                scanFunction();
                currentIndex = 0; // Reset index for next scan attempt
            }
        } else {
            currentIndex = 0; // Reset index if the rotation does not match the sequence
        }
    }

    function scanFunction() {
    if (!transformed && !isScanning && rechargeMode == false && !selectorOpen && buttonActive == false) {
        isScanning = true; // Set scanning flag
        console.log("scan engaged")
        // Disable activation button during scanning
        $("#activation-button").prop("disabled", true);

        // Add your logic for the scan function here
        $("#onmitrix").addClass("scan-sequence");
        $("#face-plate-sec").addClass("scan-face-plate");
        $(".corner-left, .corner-left-inner").addClass("scan-corner-left");
        $(".corner-right, .corner-right-inner").addClass("scan-corner-right");
        $(".selector").addClass("scan-selector");
        $(".glow").show().addClass("scan-glow");
        $(".light").addClass("scan-dial");

        setTimeout(function() {
            $(".glow").hide().removeClass("scan-glow");
            $(".light").removeClass("scan-dial");
			$("#onmitrix").removeClass("scan-sequence");
        $("#face-plate-sec").removeClass("scan-face-plate");
        $(".corner-left, .corner-left-inner").removeClass("scan-corner-left");
        $(".corner-right, .corner-right-inner").removeClass("scan-corner-right");
        $(".selector").removeClass("scan-selector");

            // Re-enable activation button after scan is complete
            $("#activation-button").prop("disabled", false);

            // Reset scanning flag
            isScanning = false;
        }, 10000); // Adjust the time as needed
    }
}
	
	function transform() {
    if (selectorOpen == true) {
		transformed = true;
        $('#faceplate').css('transform', 'translate(-50%, -50%) scale(1)');
        $(".glow").animate({ width: '220px', height: '220px' }, 235, "linear", function() {
            transformCountDown(100);
        });
        $('#onmitrix').css('transform', 'scale(1)');
    }
    // Hide watch and show transformed after transitions are complete
}
	
	function transformCountDown(seconds) {
    $('#watch').hide();
    $('#transformed').show();
    deactivateButtonEffects();
    const interval = setInterval(() => {
        console.log("Countdown:", seconds); // Debugging statement

        if (seconds <= 50) {
            $('.transformed-corner-left-glow, .transformed-corner-right-glow, .time-out-glow').addClass('time-out-warning');
        }

        if (seconds <= 0) {
            clearInterval(interval); // Clear the interval when counter reaches 0
            console.log("Countdown finished, clearing interval"); // Debugging statement
            $('.transformed-corner-left-glow, .transformed-corner-right-glow, .time-out-glow').removeClass('time-out-warning');
            $('.time-out-glow').addClass('onmitrix-timed-out-glow');
            $('#transformed-onmitrix').addClass('onmitrix-timed-out');
            setTimeout(function() {
                recharge();
				$('.time-out-glow').removeClass('onmitrix-timed-out-glow');
                $('#transformed-onmitrix').removeClass('onmitrix-timed-out');
                transformed = false;
            }, 4500);
        }

        seconds--; // Decrement the counter
    }, 1000);
}
	
	function recharge(){
		console.log("recharging");
		$('#transformed').hide();
        $('#watch').show();
		rechargeMode = true;
		$('#onmitrix').css('background-color', 'red');
		$('.light').css('background-color', 'red');
		setTimeout(function() {
		rechargeMode = false;
                $('#onmitrix').css('background-color', 'chartreuse');
                $('.light').css('background-color', 'chartreuse');
            }, 20000);
		
	}
	
	function reminder(){
		$('.glow').show().addClass('onmitrix-timed-out-glow');
        $('#onmitrix, .light').addClass('reminder-effect');
		$("#activation-button").prop("disabled", true);
            setTimeout(function() {
				$('.glow').removeClass('onmitrix-timed-out-glow');
                $('#onmitrix, .light').removeClass('reminder-effect');
				$('.glow').hide();
				$("#activation-button").prop("disabled", false);
                // Re-enable activation button after scan is complete
            }, 5000);
        }

    function updateOptionBasedOnRotation() {
        // Calculate the current index based on currentRotation
        if (selectorOpen == true && buttonActive == true) {
            // Normalize rotation to be within 0 to 405 degrees
            var normalizedRotation = (currentRotation % 855 + 855) % 855;

            // Adjust for negative rotations
            if (normalizedRotation < 0) {
                normalizedRotation = 855 + normalizedRotation;
            }

        switch (normalizedRotation) {
            case 0:
                $(".option").hide();
                $(".option-1").show();
                break;
            case 45:
                $(".option").hide();
                $(".option-2").show();
                break;
            case 90:
                $(".option").hide();
                $(".option-3").show();
                break;
            case 135:
                $(".option").hide();
                $(".option-4").show();
                break;
            case 180:
                $(".option").hide();
                $(".option-5").show();
                break;
            case 225:
                $(".option").hide();
                $(".option-6").show();
                break;
            case 270:
                $(".option").hide();
                $(".option-7").show();
                break;
            case 315:
                $(".option").hide();
                $(".option-8").show();
                break;
			case 360:
                $(".option").hide();
                $(".option-9").show();
                break;
			case 405:
                $(".option").hide();
                $(".option-10").show();
                break;
			case 450:
                $(".option").hide();
                $(".option-11").show();
                break;
			case 495:
                $(".option").hide();
                $(".option-12").show();
                break;
			case 540:
                $(".option").hide();
                $(".option-13").show();
                break;
			case 585:
                $(".option").hide();
                $(".option-14").show();
                break;
			case 630:
                $(".option").hide();
                $(".option-15").show();
                break;
			case 675:
                $(".option").hide();
                $(".option-16").show();
                break;
			case 720:
                $(".option").hide();
                $(".option-17").show();
                break;
			case 765:
                $(".option").hide();
                $(".option-18").show();
                break;
			case 810:
                $(".option").hide();
                $(".option-19").show();
                break;
            default:
                $(".option").hide();
                $(".option-1").show();
        }
    }
}
});