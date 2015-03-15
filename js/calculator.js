/*
Shadow Dom Implementation
*/
window.onload = function(){
var shadow = document.querySelector('custom-calculator').createShadowRoot();
shadow.innerHTML = '<content></content>';
var displayStatus = false;

//button onclick
document.querySelector('custom-calculator button').addEventListener('click', function(event) {
    console.log("button clicked");
    if(displayStatus){
    	shadow.innerHTML = '<content></content>';
    	displayStatus = !displayStatus;
    }
    else{
    	shadow.innerHTML = _calculator.template;
    	_calculator.execute();
    	//setting the margin
    	var marginLeft = document.querySelector('custom-calculator input').offsetWidth + "px";
    	document.querySelector('custom-calculator::shadow #calculator').style.marginLeft= marginLeft;
    	displayStatus = !displayStatus;
    }
});
}


/*
Creating Calculator Element
*/

	var CalculatorProto = Object.create(HTMLElement.prototype);
	CalculatorProto.createdCallback = function() {
		this.innerHTML = '<input type="text" readonly/>&nbsp;&nbsp<button style="height: 23px;padding: 5px;width: 30px;"></button>';
	};
	var XFoo = document.registerElement('custom-calculator', {prototype: CalculatorProto});

/*
Calculator Functionality
*/
var _calculator = {};
_calculator.template = '<style>*{margin:0;padding:0;box-sizing:border-box;font:700 14px Arial,sans-serif}html{height:100%;background:#fff;background:radial-gradient(circle,#fff 20%,#ccc);background-size:cover}#calculator{width:152px;height:auto;border:1px solid grey;margin:10px 0;padding:12px 8px 5px;background:#d3d3d3;background:linear-gradient(#ccc,#d3d3d3);border-radius:3px;box-shadow:0 4px grey,0 6px 12px rgba(0,0,0,.2)}.top .screen{height:22px;width:96px;float:right;padding:0 5px;background:rgba(0,0,0,.2);border-radius:3px;box-shadow:inset 0 3px rgba(0,0,0,.2);font-size:12px;line-height:24px;color:#fff;text-shadow:1px 1px 2px rgba(0,0,0,.2);text-align:right;letter-spacing:1px}.keys,.top{overflow:hidden}.keys span,.top span.clear{float:left;position:relative;top:0;cursor:pointer;width:28px;height:20px;background:#fff;border-radius:3px;box-shadow:0 2px rgba(0,0,0,.2);margin:0 7px 11px 0;color:#888;line-height:20px;text-align:center;user-select:none;transition:all .2s ease}.keys span.operator{background:#FFF0F5;margin-right:0}.keys span.eval{background:#f1ff92;box-shadow:0 2px #9da853;color:#888e5f}.top span.clear{background:#ff9fa8;box-shadow:0 3px #ff7c87;color:#fff;width:30px;height:22px;margin:0 5px 9px 0}.keys span:hover{background:#a9a9a9;box-shadow:0 3px grey;color:#fff}.keys span.operator:hover{background:#20b2aa;box-shadow:0 3px grey;color:#fff}.keys span.eval:hover{background:#abb850;box-shadow:0 3px #717a33;color:#fff}.top span.clear:hover{background:#f68991;box-shadow:0 3px #d3545d;color:#fff}.keys span:active{box-shadow:0 0 #6b54d3;top:4px}.keys span.eval:active{box-shadow:0 0 #717a33;top:4px}.top span.clear:active{top:4px;box-shadow:0 0 #d3545d}</style> '+
						'<content></content> '+
						'<div id="calculator"> '+
							'<!-- Screen and clear key -->'+
							'<div class="top"> '+
								'<span class="clear">C</span> '+
								'<div class="screen"></div> '+
							'</div> '+
							'<div class="keys"> '+
								'<span>7</span> '+ 
								'<span>8</span> '+ 
								'<span>9</span> '+
								'<span class="operator">+</span>'+
								'<span>4</span> '+
								'<span>5</span> '+
								'<span>6</span> '+
								'<span class="operator">-</span>'+
								'<span>1</span> '+
								'<span>2</span> '+
								'<span>3</span> '+
								'<span class="operator">÷</span>'+
								'<span>0</span> '+
								'<span>.</span> '+
								'<span class="eval">=</span> '+ 
								'<span class="operator">x</span> '+
							'</div> '+ 
						'</div> ';

_calculator.execute = function(){
//Get all the keys from document
var keys = document.querySelectorAll('custom-calculator::shadow #calculator span');
var operators = ['+', '-', 'x', '÷'];
var decimalAdded = false;

// Add onclick event to all the keys and perform operations
for(var i = 0; i < keys.length; i++) {
	keys[i].onclick = function(e) {
		// Get the input and button values
		var input = document.querySelector('custom-calculator::shadow #calculator .screen');
		var displayInput = document.querySelector('custom-calculator input');
		var inputVal = input.innerHTML;
		var btnVal = this.innerHTML;
		
		// Now, just append the key values (btnValue) to the input string and finally use javascript's eval function to get the result
		// If clear key is pressed, erase everything
		if(btnVal == 'C') {
			input.innerHTML = '';
			displayInput.value = '';
			decimalAdded = false;
		}
		
		// If eval key is pressed, calculate and display the result
		else if(btnVal == '=') {
			var equation = inputVal;
			var lastChar = equation[equation.length - 1];
			
			// Replace all instances of x and ÷ with * and / respectively. This can be done easily using regex and the 'g' tag which will replace all instances of the matched character/substring
			equation = equation.replace(/x/g, '*').replace(/÷/g, '/');
			
			// Final thing left to do is checking the last character of the equation. If it's an operator or a decimal, remove it
			if(operators.indexOf(lastChar) > -1 || lastChar == '.')
				equation = equation.replace(/.$/, '');
			
			if(equation){
				if(eval(equation).toString().split('.')[1] && eval(equation).toString().split('.')[1].length>4){
					input.innerHTML = eval(equation).toFixed(4);
				}
				else{
					input.innerHTML = eval(equation);	
				}
				displayInput.value = input.innerHTML;
			}
				
			decimalAdded = false;
		}
		
		// Basic functionality of the calculator is complete. But there are some problems like 
		// 1. No two operators should be added consecutively.
		// 2. The equation shouldn't start from an operator except minus
		// 3. not more than 1 decimal should be there in a number
		
		// We'll fix these issues using some simple checks
		
		// indexOf works only in IE9+
		else if(operators.indexOf(btnVal) > -1) {
			// Operator is clicked
			// Get the last character from the equation
			var lastChar = inputVal[inputVal.length - 1];
			
			// Only add operator if input is not empty and there is no operator at the last
			if(inputVal != '' && operators.indexOf(lastChar) == -1) 
				input.innerHTML += btnVal;
			
			// Allow minus if the string is empty
			else if(inputVal == '' && btnVal == '-') 
				input.innerHTML += btnVal;
			
			// Replace the last operator (if exists) with the newly pressed operator
			if(operators.indexOf(lastChar) > -1 && inputVal.length > 1) {
				// Here, '.' matches any character while $ denotes the end of string, so anything (will be an operator in this case) at the end of string will get replaced by new operator
				input.innerHTML = inputVal.replace(/.$/, btnVal);
			}
			
			decimalAdded =false;
		}
		
		// Now only the decimal problem is left. We can solve it easily using a flag 'decimalAdded' which we'll set once the decimal is added and prevent more decimals to be added once it's set. It will be reset when an operator, eval or clear key is pressed.
		else if(btnVal == '.') {
			if(!decimalAdded) {
				input.innerHTML += btnVal;
				decimalAdded = true;
			}
		}
		
		// if any other key is pressed, just append it
		else {
			input.innerHTML += btnVal;
		}
		
		// prevent page jumps
		e.preventDefault();
	} 
  }
}