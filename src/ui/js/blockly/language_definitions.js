// Screen and Keyboard

Blockly.Blocks['print'] = {
	init: function() {
	  this.setHelpUrl('https://projects.wyliodrin.com/wiki/languages/visual#write');
	  this.setColour(250);
	  this.appendDummyInput()
		  .appendField("Write ");
	  this.appendValueInput("value")
	  this.setInputsInline(true);
	  this.setPreviousStatement(true);
	  this.setNextStatement(true);
	  this.setTooltip('Write the value on the screen and keep the cursor on the same line.');
	}
  };
  
  Blockly.Blocks['read'] = {
	init: function() {
	  this.setHelpUrl('https://projects.wyliodrin.com/wiki/languages/visual#read');
	  this.setColour(250);
	  this.appendDummyInput()
		  .appendField("Read");
	  this.appendDummyInput()
		  .appendField(new Blockly.FieldDropdown([["text", "0"], ["integer number", "1"], ["real number", "2"]]), "type");
	  this.appendDummyInput()
		  .appendField("from keyboard");
	  this.setInputsInline(true);
	  this.setOutput(true);
	  this.setTooltip('Read a text from the keyboard.');
	}
  };
  
  Blockly.Blocks['readwrite'] = {
	init: function() {
	  this.setHelpUrl('https://projects.wyliodrin.com/wiki/languages/visual#write_and_read');
	  this.setColour(250);
	  this.appendDummyInput()
		  .appendField("Write ");
	  this.appendValueInput("value")
	  this.appendDummyInput()
		  .appendField("and read ");
	  this.appendDummyInput()
		  .appendField(new Blockly.FieldDropdown([["text", "0"], ["integer number", "1"], ["real number", "2"]]), "type");
	  this.appendDummyInput()
		  .appendField("from keyboard");
	  this.setInputsInline(true);
	  this.setOutput(true);
	  this.setTooltip('Write the value on the screen and read a text from the keyboard.');
	}
  };
  
  Blockly.Blocks['println'] = {
	init: function() {
	  this.setHelpUrl('https://projects.wyliodrin.com/wiki/languages/visual#print');
	  this.setColour(250);
	  this.appendDummyInput()
		  .appendField("Write Line");
	  this.appendValueInput("value")
	  this.setInputsInline(true);
	  this.setPreviousStatement(true);
	  this.setNextStatement(true);
	  this.setTooltip('Print the value on the screen and set the cursor to the next line.');
	}
  };

  Blockly.Blocks['delay'] = {
	init: function() {
	  this.setHelpUrl('https://projects.wyliodrin.com/wiki/languages/visual#delay');
	  this.setColour(120);
	  this.appendValueInput("millis")
		  .setCheck("Number")
		  .appendField("Sleep");
	  this.appendDummyInput()
		  .appendField(new Blockly.FieldDropdown([["milliseconds", "0"], ["microseconds", "1"], ["seconds", "2"]]), "type");
	  this.setInputsInline(true);
	  this.setPreviousStatement(true);
	  this.setNextStatement(true);
	  this.setTooltip('Sleep for some specified period.');
	}
  };

  // Loops
  Blockly.Blocks['repeat_timing'] = {
	init: function() {
	  this.setHelpUrl('http://www.example.com/');
	  this.setColour(120);
	  this.appendValueInput("VALUE")
		  .setCheck("Number")
		  .setAlign(Blockly.ALIGN_CENTRE)
		  .appendField("Repeat every");
	  this.appendDummyInput()
		  .appendField(new Blockly.FieldDropdown([["seconds", "0"], ["miliseconds", "1"], ["microseconds", "2"]]), "TIME");
	  this.appendStatementInput("NAME")
		  .setCheck("null")
		  .appendField("do");
	  this.setInputsInline(true);
	  this.setPreviousStatement(true);
	  this.setNextStatement(true);
	  this.setTooltip('');
	}
  };