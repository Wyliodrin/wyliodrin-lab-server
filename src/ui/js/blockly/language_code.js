// Screen and Keyboard

Blockly.Python['print'] = function(block) {
	var value_value = Blockly.Python.valueToCode(block, 'value', Blockly.Python.ORDER_ATOMIC);
	// TODO: Assemble Python into code variable.
	console.log ()
	var code = 'print ('+value_value+')\n';
	// TODO: Change ORDER_NONE to the correct strength.
	return code;
  };
  
  Blockly.Python['read'] = function(block) {
	// TODO: Assemble Python into code variable.
	var type = parseInt (block.getFieldValue("type"));
	var code;
	if (type == 0)
	{
	  code = 'raw_input ("")';
	}
	else if (type == 1)
	{
	  code = 'int(raw_input (""))'; 
	}
	else if (type == 2)
	{
	  code = 'float(raw_input (""))';
	}
	// TODO: Change ORDER_NONE to the correct strength.
	return [code, Blockly.Python.ORDER_NONE];
  };
  
  Blockly.Python['readwrite'] = function(block) {
	var value_value = Blockly.Python.valueToCode(block, 'value', Blockly.Python.ORDER_ATOMIC);
	// TODO: Assemble Python into code variable.
	var type = parseInt (block.getFieldValue("type"));
	var code;
	if (type == 0)
	{
	  code = 'raw_input ('+value_value+')';
	}
	else if (type == 1)
	{
	  code = 'int(raw_input ('+value_value+'))'; 
	}
	else if (type == 2)
	{
	  code = 'float(raw_input ('+value_value+'))';
	}
	// TODO: Change ORDER_NONE to the correct strength.
	return [code, Blockly.Python.ORDER_NONE];
  };
  
  Blockly.Python['readwritenr'] = function(block) {
	var value_value = Blockly.Python.valueToCode(block, 'value', Blockly.Python.ORDER_ATOMIC);
	// TODO: Assemble Python into code variable.
	var code = 'int(raw_input ('+value_value+'))';
	// TODO: Change ORDER_NONE to the correct strength.
	return [code, Blockly.Python.ORDER_NONE];
  };
  
  Blockly.Python['println'] = function(block) {
	var value_value = Blockly.Python.valueToCode(block, 'value', Blockly.Python.ORDER_ATOMIC);
	// TODO: Assemble Python into code variable.
	var code = 'print('+value_value+')\n';
	return code;
  };

  Blockly.Python['delay'] = function(block) {
	Blockly.Python.importtime ();
	var value_millis = Blockly.Python.valueToCode(block, 'millis', Blockly.Python.ORDER_ATOMIC);
	var type = parseInt (block.getFieldValue("type"));
	if (isNaN(type)) type = 0;
	// TODO: Assemble Python into code variable.
	var code = '';
	if (type == 0)
	{
	  code = 'sleep (('+value_millis+')/1000.0'+')\n';
	}
	else if (type == 1)
	{
	  code = 'delayMicroseconds ('+value_millis+')\n';
	}
	else
	{
	  code = 'sleep ('+value_millis+')\n';
	}
	return code;
  };


  // Loops

  Blockly.Python.timer = function()
{
	if(!Blockly.Python.definitions_['import_timer'])
	{
		Blockly.Python.definitions_['import_timer'] = 'from threading import Timer\n';
	}
}

Blockly.Python['repeat_timing'] = function(block) {
  var value_value = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_FUNCTION_CALL);
  var dropdown_time = block.getFieldValue('TIME');
  var statements_name = Blockly.Python.statementToCode(block, 'NAME');
  var type = parseInt (dropdown_time);
  Blockly.Python.timer();
  var dfunct = Blockly.Python.variableDB_.getDistinctName(
        'loopCode', Blockly.Generator.NAME_TYPE);
  if(type == 1)
  {
  	value_value = value_value/1000;
  }
  else if(type == 2)
  {
  	value_value = value_value/1000000;
  }
  var globals = Blockly.Variables.allUsedVariables(block);
  for (var i=0; i<globals.length; i++)
  {
    globals[i] = Blockly.Python.variableDB_.getName(globals[i], Blockly.Variables.NAME_TYPE);
  }
  globals = globals.length ? '  global ' + globals.join(', ') + '\n' : '';
  // TODO: Assemble Python into code variable.
  var code = 'def '+dfunct+'():\n'+globals+statements_name+
  			'  Timer('+value_value+', '+dfunct+').start()\n'+
        dfunct+'()\n';
  return code;
};
