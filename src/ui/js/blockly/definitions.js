Blockly.Blocks['lab_network_send_all'] = {
  init: function() {
    this.appendValueInput("message")
        .setCheck(["Number", "String"])
        .appendField("Send TO ALL lab members message");
    this.appendValueInput("topic")
        .setCheck("String")
        .appendField("on topic");
    this.appendDummyInput()
        .appendField(".");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("https://github.com/Wyliodrin/wyliozero");
  }
};

Blockly.Blocks['lab_network_send_one'] = {
  init: function() {
  	this.appendValueInput("board")
  		.appendField("SEND TO BOARD ");
    this.appendValueInput("message")
        .setCheck(["Number", "String"])
        .appendField("message");
    this.appendValueInput("topic")
        .setCheck("String")
        .appendField("on topic");
    this.appendDummyInput()
        .appendField(".");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(180);
 this.setTooltip("");
 this.setHelpUrl("https://github.com/Wyliodrin/wyliozero");
  }
};

Blockly.Blocks['lab_network_get_all'] = {
  init: function() {
  	
    this.appendValueInput("varname")
        .setCheck(["Number", "String"])
        .appendField("Make variable");
    this.appendValueInput("topic")
        .setCheck("String")
        .appendField("listen to messages SENT TO ME on topic");
    this.appendDummyInput()
        .appendField(".");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(180);
 this.setTooltip("");
 this.setHelpUrl("https://github.com/Wyliodrin/wyliozero");
  }
};

Blockly.Blocks['lab_network_get_one'] = {
  init: function() {
  	
    this.appendValueInput("varname")
        .setCheck(["Number", "String"])
        .appendField("Make variable");
    this.appendValueInput("board")
        .setCheck(["Number", "String"])
        .appendField("listen to ALL messages sent by board");
    this.appendValueInput("topic")
        .setCheck("String")
        .appendField("on topic");
    this.appendDummyInput()
        .appendField(".");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("https://github.com/Wyliodrin/wyliozero");
  }
};

// Blockly.Blocks['lab_network_recieve_all'] = {
//   init: function() {
//     this.appendValueInput("var")
//         .setCheck(null)
//         .appendField("Make variable");
//     this.appendValueInput("topic")
//         .setCheck("String")
//         .appendField("listen to messages on topic");
//     this.appendDummyInput()
//         .appendField("from all lab.");
//     this.setPreviousStatement(true, null);
//     this.setNextStatement(true, null);
//     this.setColour(230);
//  this.setTooltip("");
//  this.setHelpUrl("");
//   }
// };

Blockly.Blocks['lab_network_when_changed'] = {
  init: function() {
    this.appendValueInput("variable")
        .setCheck(null)
        .appendField("When message recieved by");
    this.appendDummyInput()
        .appendField("changes, do:");
    this.appendStatementInput("function")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(200);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Python['lab_network_when_changed'] = function(block) {
  var value_variable = Blockly.Python.valueToCode(block, 'variable', Blockly.Python.ORDER_ATOMIC);
  var statements_function = Blockly.Python.statementToCode(block, 'function');
  // TODO: Assemble Python into code variable.
  var code = '...\n';
  return code;
};

Blockly.Blocks['analogread'] = {
    init: function() {
        this.appendValueInput("pin")
            .setCheck(["String", "pinNumber_analog"])
            .appendField("analogRead");
        this.setOutput(true, "Number");
        this.setColour(320);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['digitalread'] = {
    init: function() {
        this.appendValueInput("pin")
            .setCheck(["String", "pinNumber_digital"])
            .appendField("digitalRead");
        this.setOutput(true, "Number");
        this.setColour(320);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['analogwrite'] = {
    init: function() {
        this.appendValueInput("pin")
            .setCheck(["String", "pinNumber_analog"])
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("analogWrite");
        this.appendValueInput("value")
            .setCheck("Number")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("value");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(320);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['digitalwrite'] = {
    init: function() {
        this.appendValueInput("pin")
            .setCheck(["String", "pinNumber_digital"])
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("digitalWrite");
        this.appendValueInput("value")
            .setCheck("Boolean", "Number")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("value");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(320);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['pinmode'] = {
    init: function() {
        this.appendValueInput("NAME")
            .setCheck(["String", "pinNumber", "pinNumber_analog", "pinNumber_digital"])
            .appendField("pinMode");
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["INPUT", "INPUT"],
                ["OUTPUT", "OUTPUT"]
            ]), "mode");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(320);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['pin'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["A0", "A0"],
                ["A1", "A1"],
                ["A2", "A2"],
                ["A3", "A3"],
                ["A4", "A4"],
                ["A5", "A5"],
                ["D2", "D2"],
                ["D3", "D3"],
                ["D4", "D4"],
                ["D5", "D5"],
                ["D6", "D6"],
                ["D7", "D7"],
                ["D8", "D8"],
                ["D9", "D9"],
                ["D10", "D10"],
                ["D11", "D11"],
                ["D12", "D12"],
                ["D13", "D13"],
                ["R4", "R4"],
                ["R17", "R17"],
                ["R27", "R27"],
                ["R22", "R22"],
                ["R10", "R10"],
                ["R9", "R9"],
                ["R11", "R11"],
                ["R18", "R18"],
                ["R23", "R23"],
                ["R8", "R8"],
                ["R7", "R7"],
                ["R13", "R13"],
                ["R19", "R19"],
                ["R20", "R20"],
                ["R21", "R21"]

            ]), "pin");
        this.setOutput(true, "pinNumber");
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['pin_analog'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["A0", "A0"],
                ["A1", "A1"],
                ["A2", "A2"],
                ["A3", "A3"],
                ["A4", "A4"],
                ["A5", "A5"]

            ]), "pin")
            .appendField("(analog)");
        this.setOutput(true, "pinNumber_analog");
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['pin_digital'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["D2", "D2"],
                ["D3", "D3"],
                ["D4", "D4"],
                ["D5", "D5"],
                ["D6", "D6"],
                ["D7", "D7"],
                ["D8", "D8"],
                ["D9", "D9"],
                ["D10", "D10"],
                ["D11", "D11"],
                ["D12", "D12"],
                ["D13", "D13"],
                ["R4", "R4"],
                ["R17", "R17"],
                ["R27", "R27"],
                ["R22", "R22"],
                ["R10", "R10"],
                ["R9", "R9"],
                ["R11", "R11"],
                ["R18", "R18"],
                ["R23", "R23"],
                ["R8", "R8"],
                ["R7", "R7"],
                ["R13", "R13"],
                ["R19", "R19"],
                ["R20", "R20"],
                ["R21", "R21"]

            ]), "pin")
            .appendField("(digital)");
        this.setOutput(true, "pinNumber_digital");
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};


Blockly.Blocks['led'] = {
    init: function() {
        this.appendValueInput("pin")
            .setCheck(["String", "pinNumber", "pinNumber_analog", "pinNumber_digital"])
            .appendField("LED");
        this.setOutput(true, "LED");
        this.setColour(200);
        this.setTooltip("");
        this.setHelpUrl("https://gpiozero.readthedocs.io/en/stable/api_output.html#led");
    }
};

Blockly.Blocks['servo'] = {
  init: function() {
    this.appendValueInput("pin")
        .setCheck(["String", "pinNumber_digital"])
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Servo Motor");
    this.setInputsInline(true);
    this.setOutput(true, "servo");
    this.setColour(40);
 this.setTooltip("");
 this.setHelpUrl("https://gpiozero.readthedocs.io/en/stable/api_output.html#servo");
  }
};

// Blockly.Blocks['angular_servo'] = {
//   init: function() {
//     this.appendValueInput("pin")
//         .setCheck(["String", "pinNumber_digital"])
//         .setAlign(Blockly.ALIGN_RIGHT)
//         .appendField("Angular Servo Motor");
//     this.setInputsInline(true);
//     this.setOutput(true, "angular_servo");
//     this.setColour(105);
//  this.setTooltip("");
//  this.setHelpUrl("https://gpiozero.readthedocs.io/en/stable/api_output.html#servo");
//   }
// };

Blockly.Blocks['pwm_led'] = {
    init: function() {
        this.appendValueInput("pin")
            .setCheck(["String", "pinNumber_digital"])
            .appendField("PWM LED");
        this.setOutput(true, "PWM_LED");
        this.setColour(200);
        this.setTooltip("");
        this.setHelpUrl("https://gpiozero.readthedocs.io/en/stable/api_output.html#pwmled");
    }
};

Blockly.Blocks['button'] = {
    init: function() {
        this.appendValueInput("pin_number")
            .setCheck(["String", "pinNumber_digital"])
            .appendField("Button");
        this.setOutput(true, "button");
        this.setColour(0);
        this.setTooltip("");
        this.setHelpUrl("https://gpiozero.readthedocs.io/en/stable/api_input.html#button");
    }
};

Blockly.Blocks['button_when_held'] = {
  init: function() {
    this.appendValueInput("pin")
        .setCheck("button")
        .appendField("When button");
    this.appendDummyInput()
        .appendField("is held, do:");
    this.appendStatementInput("function")
        .setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
 this.setTooltip("");
 this.setHelpUrl("https://gpiozero.readthedocs.io/en/stable/api_input.html#gpiozero.Button.when_held");
  }
};

Blockly.Blocks['button_when_pressed'] = {
  init: function() {
    this.appendValueInput("pin")
        .setCheck("button")
        .appendField("When button");
    this.appendDummyInput()
        .appendField("is pressed, do:");
    this.appendStatementInput("function")
        .setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
 this.setTooltip("");
 this.setHelpUrl("https://gpiozero.readthedocs.io/en/stable/api_input.html#gpiozero.Button.when_pressed");
  }
};

Blockly.Blocks['button_when_released'] = {
  init: function() {
    this.appendValueInput("pin")
        .setCheck("button")
        .appendField("When button");
    this.appendDummyInput()
        .appendField("is released, do:");
    this.appendStatementInput("function")
        .setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
 this.setTooltip("");
 this.setHelpUrl("https://gpiozero.readthedocs.io/en/stable/api_input.html#gpiozero.Button.when_released");
  }
};


Blockly.Blocks['button_is_pressed'] = {
    init: function() {
        this.appendValueInput("button")
            .setCheck("button")
            .appendField("button");
        this.appendDummyInput()
            .appendField("is pressed");
        this.setOutput(true, "Boolean");
        this.setColour(0);
        this.setTooltip("");
        this.setHelpUrl("https://gpiozero.readthedocs.io/en/stable/api_input.html#gpiozero.Button.is_pressed");
    }
};

Blockly.Blocks['servo_detach'] = {
  init: function() {
    this.appendValueInput("pin")
        .setCheck("servo")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Detach Servo Motor");
    this.appendDummyInput()
        .appendField(".");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(40);
 this.setTooltip("");
 this.setHelpUrl("https://gpiozero.readthedocs.io/en/stable/api_output.html#gpiozero.Servo.detach");
  }
};

Blockly.Blocks['servo_max'] = {
  init: function() {
    this.appendValueInput("pin")
        .setCheck("servo")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Set Servo Motor");
    this.appendDummyInput()
        .appendField("to its max position.");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(40);
 this.setTooltip("");
 this.setHelpUrl("https://gpiozero.readthedocs.io/en/stable/api_output.html#gpiozero.Servo.max");
  }
};

Blockly.Blocks['servo_mid'] = {
  init: function() {
    this.appendValueInput("pin")
        .setCheck("servo")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Set Servo Motor");
    this.appendDummyInput()
        .appendField("to its mid position.");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(40);
 this.setTooltip("");
 this.setHelpUrl("https://gpiozero.readthedocs.io/en/stable/api_output.html#gpiozero.Servo.mid");
  }
};

Blockly.Blocks['servo_min'] = {
  init: function() {
    this.appendValueInput("pin")
        .setCheck("servo")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Set Servo Motor");
    this.appendDummyInput()
        .appendField("to its min position.");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(40);
 this.setTooltip("");
 this.setHelpUrl("https://gpiozero.readthedocs.io/en/stable/api_output.html#gpiozero.Servo.min");
  }
};

Blockly.Blocks['servo_value'] = {
  init: function() {
    this.appendValueInput("pin")
        .setCheck("servo")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("For Servo Motor");
    this.appendValueInput("value")
            .setCheck("Number")
            .appendField("with value");
    this.appendDummyInput()
        .appendField("(between -1 and 1).");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(40);
 this.setTooltip("");
 this.setHelpUrl("https://gpiozero.readthedocs.io/en/stable/api_output.html#gpiozero.Servo.value");
  }
};

Blockly.Blocks['button_wait_for_release'] = {
    init: function() {
        this.appendValueInput("button")
            .setCheck("button")
            .appendField("Wait until button");
        this.appendDummyInput()
            .appendField("is released.");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(0);
        this.setTooltip("");
        this.setHelpUrl("https://gpiozero.readthedocs.io/en/stable/api_input.html#gpiozero.Button.wait_for_release");
    }
};

Blockly.Blocks['button_held_time'] = {
    init: function() {
        this.appendValueInput("button")
            .setCheck("button")
            .appendField("how many seconds button");
        this.appendDummyInput()
            .appendField("has been held for.");
        this.setOutput(true, "math_number");
        this.setColour(0);
        this.setTooltip("");
        this.setHelpUrl("https://gpiozero.readthedocs.io/en/stable/api_input.html#gpiozero.Button.held_time");
    }
};
Blockly.Blocks['led_blink'] = {
    init: function() {
        this.appendValueInput("led")
            .setCheck(["PWM_LED", "LED", "traffic"])
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Blink LED ");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(200);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['pwm_on'] = {
    init: function() {
        this.appendValueInput("pwm_led")
            .setCheck("PWM_LED")
            .appendField("Turn on PWM LED");
        this.appendValueInput("value")
            .setCheck("Number")
            .appendField("with value");
        //   this.appendDummyInput()
        // 	  .appendField("(between 0 and 255)");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(200);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['button_wait_for_press'] = {
    init: function() {
        this.appendValueInput("button")
            .setCheck("button")
            .appendField("Wait until button");
        this.appendDummyInput()
            .appendField("is pressed");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(0);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['pause'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Pause");
        this.setPreviousStatement(true, null);
        this.setColour(320);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['trafficlight'] = {
    init: function() {
        this.appendValueInput("red")
            .setCheck(["String", "pinNumber", "pinNumber_analog", "pinNumber_digital"])
            .appendField("Traffic Lights");
        this.appendValueInput("yellow")
            .setCheck(["String", "pinNumber", "pinNumber_analog", "pinNumber_digital"]);
        this.appendValueInput("green")
            .setCheck(["String", "pinNumber", "pinNumber_analog", "pinNumber_digital"]);
        this.setOutput(true, "traffic");
        this.setColour(240);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['led_turn_on'] = {
    init: function() {
        this.appendValueInput("NAME")
            .setCheck(["PWM_LED", "LED", "traffic"])
            .appendField("Turn on LED");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(200);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['led_turn_off'] = {
    init: function() {
        this.appendValueInput("NAME")
            .setCheck(["PWM_LED", "LED", "traffic"])
            .appendField("Turn off LED");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(200);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['led_toggle'] = {
    init: function() {
        this.appendValueInput("NAME")
            .setCheck(["PWM_LED", "LED", "traffic"])
            .appendField("Toggle LED");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(200);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['led_is_lit'] = {
    init: function() {
        this.appendValueInput("led")
            .setCheck(["PWM_LED", "LED"])
            .appendField("led");
        this.appendDummyInput()
            .appendField("is lit.");
        this.setOutput(true, ["Number", "Boolean"]);
        this.setColour(200);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['traffic_light_on'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Turn on")
            .appendField(new Blockly.FieldDropdown([
                ["red", "red"],
                ["yellow", "yellow"],
                ["green", "green"]
            ]), "light");
        this.appendValueInput("NAME")
            .setCheck("traffic")
            .appendField("for Traffic Light");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(240);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['traffic_blink'] = {
  init: function() {
    this.appendValueInput("pin")
        .setCheck("traffic")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Blink traffic light");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(240);
 this.setTooltip("");
 this.setHelpUrl("https://gpiozero.readthedocs.io/en/stable/api_boards.html#gpiozero.TrafficLights.blink");
  }
};

Blockly.Blocks['traffic_close'] = {
  init: function() {
    this.appendValueInput("pin")
        .setCheck("traffic")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Close traffic light");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(240);
 this.setTooltip("");
 this.setHelpUrl("https://gpiozero.readthedocs.io/en/stable/api_boards.html#gpiozero.TrafficLights.close");
  }
};

Blockly.Blocks['pwm_pulse'] = {
    init: function() {
        this.appendValueInput("pwm_led")
            .setCheck("PWM_LED", "traffic")
            .appendField("Pulse PWM LED");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(200);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['traffic_light_off'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Turn off")
            .appendField(new Blockly.FieldDropdown([
                ["red", "red"],
                ["yellow", "yellow"],
                ["green", "green"]
            ]), "light");
        this.appendValueInput("NAME")
            .setCheck("traffic")
            .appendField("for Traffic Light");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(240);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['start_labnetwork'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Start LabNetwork");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(180);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['lcd_write'] = {
    init: function() {
        this.appendValueInput("str")
            .setCheck("String")
            .appendField("LCD write");
        this.appendDummyInput()
            .appendField("on line");
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["1", "1"],
                ["2", "2"]
            ]), "line");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(280);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};


Blockly.Blocks['light_sensor'] = {
    init: function() {
        this.appendValueInput("pin_number")
            .setCheck(["String", "pinNumber_analog"])
            .appendField("Light Sensor");
        this.setOutput(true, "light_sensor");
        this.setColour(40);
        this.setTooltip("");
        this.setHelpUrl("https://gpiozero.readthedocs.io/en/stable/api_input.html#gpiozero.LightSensor");
    }
};

Blockly.Blocks['light_when_dark'] = {
  init: function() {
    this.appendValueInput("pin")
        .setCheck("light_sensor")
        .appendField("When light sensor");
    this.appendDummyInput()
        .appendField("senses dark, do:");
    this.appendStatementInput("function")
        .setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(40);
 this.setTooltip("");
 this.setHelpUrl("https://gpiozero.readthedocs.io/en/stable/api_input.html#gpiozero.LightSensor.when_dark");
  }
};

Blockly.Blocks['light_when_light'] = {
  init: function() {
    this.appendValueInput("pin")
        .setCheck("light_sensor")
        .appendField("When light sensor");
    this.appendDummyInput()
        .appendField("senses light, do:");
    this.appendStatementInput("function")
        .setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(40);
 this.setTooltip("");
 this.setHelpUrl("https://gpiozero.readthedocs.io/en/stable/api_input.html#gpiozero.LightSensor.when_light");
  }
};

Blockly.Blocks['light_wait_for_dark'] = {
    init: function() {
        this.appendValueInput("pin_number")
            .setCheck("light_sensor")
            .appendField("Wait until light sensor");
        this.appendDummyInput()
            .appendField("sees dark.");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(40);
        this.setTooltip("");
        this.setHelpUrl("https://gpiozero.readthedocs.io/en/stable/api_input.html#gpiozero.LightSensor.wait_for_dark");
    }
};

Blockly.Blocks['light_wait_for_light'] = {
    init: function() {
        this.appendValueInput("pin_number")
            .setCheck("light_sensor")
            .appendField("Wait until light sensor");
        this.appendDummyInput()
            .appendField("sees light.");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(40);
        this.setTooltip("");
        this.setHelpUrl("https://gpiozero.readthedocs.io/en/stable/api_input.html#gpiozero.LightSensor.wait_for_light");
    }
};

Blockly.Blocks['light_detected'] = {
    init: function() {
        this.appendValueInput("pin_number")
            .setCheck("light_sensor")
            .appendField("sensor");
        this.appendDummyInput()
            .appendField("detects light.");
        this.setOutput(true, ["Boolean", "Number"]);
        this.setColour(40);
        this.setTooltip("");
        this.setHelpUrl("AChttps://gpiozero.readthedocs.io/en/stable/api_input.html#gpiozero.LightSensor.light_detected");
    }
};

Blockly.Blocks['buzzer'] = {
    init: function() {
        this.appendValueInput("pin")
            .setCheck(["String", "pinNumber", "pinNumber_analog", "pinNumber_digital"])
            .appendField("buzzer");
        this.setOutput(true, "buzzer");
        this.setColour(320);
        this.setTooltip("");
        this.setHelpUrl("https://gpiozero.readthedocs.io/en/stable/api_output.html#buzzer");
    }
};

Blockly.Blocks['buzzer_beep'] = {
    init: function() {
        this.appendValueInput("pin")
            .setCheck("buzzer")
            .appendField("Beep buzzer");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(320);
        this.setTooltip("");
        this.setHelpUrl("https://gpiozero.readthedocs.io/en/stable/api_output.html#gpiozero.Buzzer.beep");
    }
};

Blockly.Blocks['buzzer_on'] = {
    init: function() {
        this.appendValueInput("pin")
            .setCheck("buzzer")
            .appendField("Turn on buzzer");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(320);
        this.setTooltip("");
        this.setHelpUrl("https://gpiozero.readthedocs.io/en/stable/api_output.html#gpiozero.Buzzer.on");
    }
};

Blockly.Blocks['buzzer_off'] = {
    init: function() {
        this.appendValueInput("pin")
            .setCheck("buzzer")
            .appendField("Turn off buzzer");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(320);
        this.setTooltip("");
        this.setHelpUrl("https://gpiozero.readthedocs.io/en/stable/api_output.html#gpiozero.Buzzer.off");
    }
};

Blockly.Blocks['buzzer_toggle'] = {
    init: function() {
        this.appendValueInput("pin")
            .setCheck("buzzer")
            .appendField("Toggle buzzer");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(320);
        this.setTooltip("");
        this.setHelpUrl("https://gpiozero.readthedocs.io/en/stable/api_output.html#gpiozero.Buzzer.toggle");
    }
};

Blockly.Blocks['buzzer_is_active'] = {
    init: function() {
        this.appendValueInput("pin")
            .setCheck("buzzer")
            .appendField("buzzer");
        this.appendDummyInput()
            .appendField("is active.");
        this.setOutput(true, ["Number", "Boolean"]);
        this.setColour(320);
        this.setTooltip("");
        this.setHelpUrl("https://gpiozero.readthedocs.io/en/stable/api_output.html#gpiozero.Buzzer.toggle");
    }
};

Blockly.Blocks['dht_sensor'] = {
  init: function() {
    this.appendValueInput("pin")
        .setCheck(["String", "pinNumber_analog"])
        .appendField("DHT sensor on pin");
    this.setOutput(true, "dht_sensor");
    this.setColour(100);
 this.setTooltip("");
 this.setHelpUrl("https://github.com/adafruit/Adafruit_Python_DHT/tree/master/Adafruit_DHT");
  }
};

Blockly.Blocks['dht_temperature'] = {
  init: function() {
    this.appendValueInput("dht")
        .setCheck("dht_sensor")
        .appendField("temperature read from sensor");
    this.appendDummyInput()
        .appendField(".");
    this.setOutput(true, "Boolean");
    this.setColour(120);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['dht_humidity'] = {
  init: function() {
    this.appendValueInput("dht")
        .setCheck("dht_sensor")
        .appendField("humidity read from sensor");
    this.appendDummyInput()
        .appendField(".");
    this.setOutput(true, "Boolean");
    this.setColour(120);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};