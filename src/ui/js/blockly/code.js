
Blockly.Python.setUp = function() {
    if (!Blockly.Python.definitions_['setUp']) {
        Blockly.Python.definitions_['setUp'] = 'from wyliozero import * \n';
    }
};

Blockly.Python.importtime = function() {
    if (!Blockly.Python.definitions_['time']) {
        Blockly.Python.definitions_['time'] = 'from time import * \n';
    }
};

Blockly.Python.uniqueName = function(string) {
    return Blockly.Python.variableDB_.getDistinctName(string, Blockly.Generator.NAME_TYPE);
}

Blockly.Python['analogread'] = function(block) {
    Blockly.Python.setUp();
    var value_pin = Blockly.Python.valueToCode(block, 'pin', Blockly.Python.ORDER_ATOMIC);
    // TODO: Assemble Python into code variable.
    var code = 'analogRead(' + value_pin.toString() + ')\n';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['digitalread'] = function(block) {
    Blockly.Python.setUp();
    var value_pin = Blockly.Python.valueToCode(block, 'pin', Blockly.Python.ORDER_ATOMIC);
    // TODO: Assemble Python into code variable.
    var code = 'digitalRead(' + value_pin.toString() + ')\n';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['analogwrite'] = function(block) {
    Blockly.Python.setUp();
    var value_pin = Blockly.Python.valueToCode(block, 'pin', Blockly.Python.ORDER_ATOMIC);
    var value_value = Blockly.Python.valueToCode(block, 'value', Blockly.Python.ORDER_ATOMIC);
    // TODO: Assemble Python into code variable.
    var code = 'analogWrite(' + value_pin.toString() + ',' + value_value.toString() + ')\n';
    return code;
};

Blockly.Python['digitalwrite'] = function(block) {
    Blockly.Python.setUp();
    let valueToWrite = null;
    var value_pin = Blockly.Python.valueToCode(block, 'pin', Blockly.Python.ORDER_ATOMIC);
    var value_value = Blockly.Python.valueToCode(block, 'value', Blockly.Python.ORDER_ATOMIC);
    // TODO: Assemble Python into code variable.
    if (value_value.toString() === 'True') {
        valueToWrite = 1;
    } else {
        valueToWrite = 0;
    }
    var code = 'digitalWrite(' + value_pin.toString() + ',' + valueToWrite + ')\n';
    return code;
};

Blockly.Python['pinmode'] = function(block) {
    Blockly.Python.setUp();
    var value_name = Blockly.Python.valueToCode(block, 'NAME', Blockly.Python.ORDER_ATOMIC);
    var dropdown_mode = block.getFieldValue('mode');
    // TODO: Assemble Python into code variable.
    var code = 'pinMode(' + value_name.toString() + ',' + dropdown_mode.toString() + ')\n';
    return code;
};

Blockly.Python['pin_analog'] = function(block) {
    Blockly.Python.setUp();
    var dropdown_pin = block.getFieldValue('pin');
    // TODO: Assemble Python into code variable.
    var code = dropdown_pin.toString();
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['pin'] = function(block) {
    Blockly.Python.setUp();
    var dropdown_pin = block.getFieldValue('pin');
    // TODO: Assemble Python into code variable.
    var code = dropdown_pin.toString();
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['pin_digital'] = function(block) {
    Blockly.Python.setUp();
    var dropdown_pin = block.getFieldValue('pin');
    // TODO: Assemble Python into code variable.
    var code = dropdown_pin.toString();
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['pin_raspi'] = function(block) {
    Blockly.Python.setUp();
    var dropdown_pin = block.getFieldValue('pin');
    // TODO: Assemble Python into code variable.
    var code = dropdown_pin.toString();
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.Python.ORDER_NONE];
};


Blockly.Python['led'] = function(block) {
    Blockly.Python.setUp();
    var value_pin = Blockly.Python.valueToCode(block, 'pin', Blockly.Python.ORDER_NEW);
    // TODO: Assemble Python into code variable.
    var code = 'LED(' + value_pin.toString() + ')';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.Python.ORDER_NEW];
};

Blockly.Python['pwm_led'] = function(block) {
    Blockly.Python.setUp();
    var value_led = Blockly.Python.valueToCode(block, 'led', Blockly.Python.ORDER_NEW);
    // TODO: Assemble Python into code variable.
    var code = 'PWMLED(' + value_led.toString() + ')';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.Python.ORDER_NEW];
};

Blockly.Python['button'] = function(block) {
    Blockly.Python.setUp();
    var value_pin_number = Blockly.Python.valueToCode(block, 'pin_number', Blockly.Python.ORDER_ATOMIC);
    // TODO: Assemble Python into code variable.
    var code = 'Button(' + value_pin_number.toString() + ')';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.Python.ORDER_NONE];
};

// Blockly.Python['button_when_held'] = function(block) {
//     var value_pin_number = Blockly.Python.valueToCode(block, 'pin_number', Blockly.Python.ORDER_ATOMIC);
//     var value_function = Blockly.Python.valueToCode(block, 'function', Blockly.Python.ORDER_ATOMIC);
//     // TODO: Assemble Python into code variable.
//     var code = value_pin_number.toString() + '.when_held = ' + value_function + ' ';
//     return code;
// };

Blockly.Python['button_is_pressed'] = function(block) {
    Blockly.Python.setUp();
    var value_button = Blockly.Python.valueToCode(block, 'button', Blockly.Python.ORDER_ATOMIC);
    // TODO: Assemble Python into code variable.
    var code = value_button.toString() + '.is_pressed';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.Python.ORDER_NONE];
};



Blockly.Python['button_wait_for_release'] = function(block) {
    var value_button = Blockly.Python.valueToCode(block, 'button', Blockly.Python.ORDER_ATOMIC);
    // TODO: Assemble Python into code variable.
    var code = value_button.toString() + '.wait_for_release()';
    return code;
};


Blockly.Python['led_blink'] = function(block) {
    Blockly.Python.setUp();
    var value_led = Blockly.Python.valueToCode(block, 'led', Blockly.Python.ORDER_ATOMIC);
    // TODO: Assemble Python into code variable.
    var code = value_led.toString() + '.blink()\n';
    return code;
};

Blockly.Python['button_when_held'] = function(block) {
    Blockly.Python.setUp();
    var value_pin = Blockly.Python.valueToCode(block, 'pin', Blockly.Python.ORDER_ATOMIC);
    var statements_function = Blockly.Python.statementToCode(block, 'function');
    var functionName = Blockly.Python.uniqueName('function');
    // TODO: Assemble Python into code variable.
    var code =  'def ' + functionName + '():\n' + statements_function.toString()
    		+ value_pin + '.when_held = ' + functionName + '\n';
    return code;
};

Blockly.Python['button_when_pressed'] = function(block) {
    Blockly.Python.setUp();
    var value_pin = Blockly.Python.valueToCode(block, 'pin', Blockly.Python.ORDER_ATOMIC);
    var statements_function = Blockly.Python.statementToCode(block, 'function');
    var functionName = Blockly.Python.uniqueName('function');
    // TODO: Assemble Python into code variable.
    var code =  'def ' + functionName + '():\n' + statements_function.toString()
    		+ value_pin + '.when_pressed = ' + functionName + '\n';
    return code;
};

Blockly.Python['button_when_released'] = function(block) {
    Blockly.Python.setUp();
    var value_pin = Blockly.Python.valueToCode(block, 'pin', Blockly.Python.ORDER_ATOMIC);
    var statements_function = Blockly.Python.statementToCode(block, 'function');
    var functionName = Blockly.Python.uniqueName('function');
    // TODO: Assemble Python into code variable.
    var code =  'def ' + functionName + '():\n' + statements_function.toString()
    		+ value_pin + '.when_released = ' + functionName + '\n';
    return code;
};

Blockly.Python['pwm_on'] = function(block) {
    Blockly.Python.setUp();
    var value_pwm_led = Blockly.Python.valueToCode(block, 'pwm_led', Blockly.Python.ORDER_ATOMIC);
    var value_value = Blockly.Python.valueToCode(block, 'value', Blockly.Python.ORDER_ATOMIC);
    // TODO: Assemble Python into code variable.
    var code = value_pwm_led.toString() + '.value = ' + value_value.toString() + ' / 255.0\n';
    return code;
};

Blockly.Python['button_wait_for_press'] = function(block) {
    Blockly.Python.setUp();
    var value_button = Blockly.Python.valueToCode(block, 'button', Blockly.Python.ORDER_ATOMIC);
    // TODO: Assemble Python into code variable.
    var code = value_button.toString() + '.wait_for_press()';
    return code;
};

Blockly.Python['button_held_time'] = function(block) {
    var value_button = Blockly.Python.valueToCode(block, 'button', Blockly.Python.ORDER_ATOMIC);
    // TODO: Assemble Python into code variable.
    var code = value_button.toString() + '.held_time';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['pause'] = function(block) {
    Blockly.Python.setUp();
    // TODO: Assemble Python into code variable.
    var code = 'pause()';
    return code;
};

Blockly.Python['trafficlight'] = function(block) {
    Blockly.Python.setUp();
    var value_red = Blockly.Python.valueToCode(block, 'red', Blockly.Python.ORDER_ATOMIC);
    var value_yellow = Blockly.Python.valueToCode(block, 'yellow', Blockly.Python.ORDER_ATOMIC);
    var value_green = Blockly.Python.valueToCode(block, 'green', Blockly.Python.ORDER_ATOMIC);
    // TODO: Assemble Python into code variable.
    var code = 'TrafficLights( ' + value_red.toString() + ', ' + value_yellow.toString() + ', ' + value_green.toString() + ') ';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['led_turn_on'] = function(block) {
    Blockly.Python.setUp();
    var value_name = Blockly.Python.valueToCode(block, 'NAME', Blockly.Python.ORDER_FUNCTION_CALL);
    // TODO: Assemble Python into code variable.
    var code = value_name.toString() + '.on()\n';
    return code;
};

Blockly.Python['led_turn_off'] = function(block) {
    Blockly.Python.setUp();
    var value_name = Blockly.Python.valueToCode(block, 'NAME', Blockly.Python.ORDER_FUNCTION_CALL);
    // TODO: Assemble Python into code variable.
    var code = value_name.toString() + '.off()\n';
    return code;
};

Blockly.Python['led_toggle'] = function(block) {
    Blockly.Python.setUp();
    var value_name = Blockly.Python.valueToCode(block, 'NAME', Blockly.Python.ORDER_FUNCTION_CALL);
    // TODO: Assemble Python into code variable.
    var code = value_name.toString() + '.toggle()\n';
    return code;
};

Blockly.Python['led_is_lit'] = function(block) {
    var value_led = Blockly.Python.valueToCode(block, 'led', Blockly.Python.ORDER_ATOMIC);
    // TODO: Assemble Python into code variable.
    var code = value_led.toString() + 'is_lit';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['traffic_light_on'] = function(block) {
    Blockly.Python.setUp();
    var dropdown_light = block.getFieldValue('light');
    var value_name = Blockly.Python.valueToCode(block, 'NAME', Blockly.Python.ORDER_ATOMIC);
    // TODO: Assemble Python into code variable.
    var code = value_name.toString() + '.' + dropdown_light.toString() + '.on() ';
    return code;
};

Blockly.Python['pwm_pulse'] = function(block) {
    Blockly.Python.setUp();
    var value_pwm_led = Blockly.Python.valueToCode(block, 'pwm_led', Blockly.Python.ORDER_FUNCTION_CALL);
    // TODO: Assemble Python into code variable.
    var code = value_pwm_led.toString() + '.pulse()';
    return code;
};

Blockly.Python['traffic_light_off'] = function(block) {
    Blockly.Python.setUp();
    var dropdown_light = block.getFieldValue('light');
    var value_name = Blockly.Python.valueToCode(block, 'NAME', Blockly.Python.ORDER_ATOMIC);
    // TODO: Assemble Python into code variable.
    var code = value_name.toString() + '.' + dropdown_light.toString() + '.off() ';
    return code;
};

Blockly.Python['start_labnetwork'] = function(block) {
    Blockly.Python.setUp();
    // TODO: Assemble Python into code variable.
    var code = '...\n';
    return code;
};

Blockly.Python['lcd_write'] = function(block) {
    Blockly.Python.setUp();
    var value_lcd = 'LabLCD()'
    var value_str = Blockly.Python.valueToCode(block, 'str', Blockly.Python.ORDER_ATOMIC);
    var dropdown_line = block.getFieldValue('line');
    // TODO: Assemble Python into code variable.

    var code;
    if (dropdown_line.toString() === '1') {
        code = value_lcd + '.clear()\n' + value_lcd + '.set_cursor(0,0)\n' + value_lcd + '.message(' + value_str.toString() + ')\n';
    } else {
        code = value_lcd + '.clear()\n' + value_lcd + '.set_cursor(0,1)\n' + value_lcd + '.message(' + value_str.toString() + ')\n';
    }
    return code;
};

Blockly.Python['light_sensor'] = function(block) {
    Blockly.Python.setUp();
    var value_pin_number = Blockly.Python.valueToCode(block, 'pin_number', Blockly.Python.ORDER_ATOMIC);
    // TODO: Assemble Python into code variable.
    var code = 'LightSensor(' + value_pin_number.toString() + ')';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['light_when_dark'] = function(block) {
    Blockly.Python.setUp();
    var value_pin = Blockly.Python.valueToCode(block, 'pin', Blockly.Python.ORDER_ATOMIC);
    var statements_function = Blockly.Python.statementToCode(block, 'function');
    var functionName = Blockly.Python.uniqueName('function');
    // TODO: Assemble Python into code variable.
    var code =  'def ' + functionName + '():\n' + statements_function.toString()
    		+ value_pin + '.when_dark = ' + functionName + '\n';
    return code;
};

Blockly.Python['light_wait_for_dark'] = function(block) {
    var value_pin_number = Blockly.Python.valueToCode(block, 'pin_number', Blockly.Python.ORDER_ATOMIC);
    // TODO: Assemble Python into code variable.
    var code = value_pin_number.toString() + '.wait_for_dark()';
    return code;
};

Blockly.Python['light_wait_for_light'] = function(block) {
    var value_pin_number = Blockly.Python.valueToCode(block, 'pin_number', Blockly.Python.ORDER_ATOMIC);
    // TODO: Assemble Python into code variable.
    var code = value_pin_number.toString() + '.wait_for_light()';
    return code;
};

Blockly.Python['light_detected'] = function(block) {
    var value_pin_number = Blockly.Python.valueToCode(block, 'pin_number', Blockly.Python.ORDER_ATOMIC);
    // TODO: Assemble Python into code variable.
    var code = value_pin_number.toString() + '.light_detected';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['buzzer'] = function(block) {
    var value_pin = Blockly.Python.valueToCode(block, 'pin', Blockly.Python.ORDER_ATOMIC);
    // TODO: Assemble Python into code variable.
    var code = 'Buzzer(' + value_pin.toString() + ')';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['buzzer_beep'] = function(block) {
    var value_pin = Blockly.Python.valueToCode(block, 'pin', Blockly.Python.ORDER_ATOMIC);
    // TODO: Assemble Python into code variable.
    var code = value_pin.toString() + '.beep()';
    return code;
};

Blockly.Python['buzzer_on'] = function(block) {
    var value_pin = Blockly.Python.valueToCode(block, 'pin', Blockly.Python.ORDER_ATOMIC);
    // TODO: Assemble Python into code variable.
    var code = value_pin.toString() + '.on()';
    return code;
};

Blockly.Python['buzzer_off'] = function(block) {
    var value_pin = Blockly.Python.valueToCode(block, 'pin', Blockly.Python.ORDER_ATOMIC);
    // TODO: Assemble Python into code variable.
    var code = value_pin.toString() + '.off()';
    return code;
};

Blockly.Python['buzzer_toggle'] = function(block) {
    var value_pin = Blockly.Python.valueToCode(block, 'pin', Blockly.Python.ORDER_ATOMIC);
    // TODO: Assemble Python into code variable.
    var code = value_pin.toString() + '.toggle()';
    return code;
};

Blockly.Python['buzzer_is_active'] = function(block) {
    var value_pin = Blockly.Python.valueToCode(block, 'pin', Blockly.Python.ORDER_ATOMIC);
    // TODO: Assemble Python into code variable.
    var code = value_pin.toString() + '.is_active';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.Python.ORDER_NONE];
};