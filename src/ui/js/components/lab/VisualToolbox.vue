
<template>
	<code v-pre>
		<xml id="toolbox" style="display: none">
			<category name="Logic" colour="210">
				<category name="If" colour="210">
					<block type="controls_if" />
					<block type="controls_if">
						<mutation else="1" />
					</block>
					<block type="controls_if">
						<mutation elseif="1" else="1" />
					</block>
				</category>
				<category name="Boolean" colour="210">
					<block type="logic_compare" />
					<block type="logic_operation" />
					<block type="logic_negate" />
					<block type="logic_boolean" />
					<block type="logic_null" />
					<block type="logic_ternary" />
				</category>
			</category>
			<category name="Loops" colour="120">
				<block type="repeat_timing">
					<value name="VALUE">
						<block type="math_number">
							<field name="NUM">1</field>
						</block>
					</value>
				</block>
				<block type="controls_repeat_ext">
					<value name="TIMES">
						<block type="math_number">
							<field name="NUM">10</field>
						</block>
					</value>
				</block>
				<block type="controls_for">
					<field name="VAR">i</field>
					<value name="FROM">
						<block type="math_number">
							<field name="NUM">1</field>
						</block>
					</value>
					<value name="TO">
						<block type="math_number">
							<field name="NUM">10</field>
						</block>
					</value>
					<value name="BY">
						<block type="math_number">
							<field name="NUM">1</field>
						</block>
					</value>
				</block>
				<block type="controls_forEach" />
				<block type="controls_whileUntil" />
				<block type="controls_flow_statements" />
				<block type="delay">
					<value name="millis">
						<block type="math_number">
							<field name="NUM">1000</field>
						</block>
					</value>
				</block>
			</category>
			<category name="Math" colour="230">
				<block type="math_number">
					<field name="NUM">123</field>
				</block>
				<block type="math_arithmetic" />
				<block type="math_single" />
				<block type="math_trig" />
				<block type="math_constant" />
				<block type="math_number_property" />
				<block type="math_round" />
				<block type="math_on_list" />
				<block type="math_modulo" />
				<block type="math_constrain">
					<value name="LOW">
						<block type="math_number">
							<field name="NUM">1</field>
						</block>
					</value>
					<value name="HIGH">
						<block type="math_number">
							<field name="NUM">100</field>
						</block>
					</value>
				</block>
				<block type="math_random_int">
					<value name="FROM">
						<block type="math_number">
							<field name="NUM">1</field>
						</block>
					</value>
					<value name="TO">
						<block type="math_number">
							<field name="NUM">100</field>
						</block>
					</value>
				</block>
				<block type="math_random_float" />
			</category>
			<category name="Lists" colour="260">
				<block type="lists_create_empty" />
				<block type="lists_create_with" />
				<block type="lists_repeat">
					<value name="NUM">
						<block type="math_number">
							<field name="NUM">5</field>
						</block>
					</value>
				</block>
				<block type="lists_length" />
				<block type="lists_isEmpty" />
				<block type="lists_indexOf" />
				<block type="lists_getIndex" />
				<block type="lists_setIndex" />
			</category>
			<sep />
			<category name="Screen and Keyboard" colour="250">
				<block type="print">
					<value name="value">
						<block type="text">
							<field name="TEXT"></field>
						</block>
					</value>
				</block>
				<block type="println">
					<value name="value">
						<block type="text">
							<field name="TEXT"></field>
						</block>
					</value>
				</block>
				<block type="read"></block>
				<block type="readwrite">
					<value name="value">
						<block type="text">
							<field name="TEXT">What is your name? </field>
						</block>
					</value>
				</block>

				<block type="text">
					<field name="TEXT">text</field>
				</block>

			</category>

			<sep />
			
			<category name="Variables" custom="VARIABLE" colour="330" />
			<category name="Functions" custom="PROCEDURE" colour="290" />
			<category name="Pins" colour ="250" >
				<block type="pin"/>
				<block type="pin_analog"/>
				<block type="pin_digital"/>

			</category>
			<sep />
			<!-- <category name="Pin Input" colour="100"></category> -->
			
				<category name="Button" colour="0">

					<block type="variables_set">
						<field name="VAR">button</field>
						<value name="VALUE">
							<block type="button">
								<value name="pin_number">
									<block type="pin_digital"/>
								</value>
							</block>
						</value>
					</block>

					

					<block type="button_is_pressed">
						<value name="button">
							<block type="variables_get">
								<field name="VAR">button</field>
							</block>
						</value>
					</block> 

					

					<block type="button_wait_for_press">
						<value name="button">
							<block type="variables_get">
								<field name="VAR">button</field>
							</block>	
						</value>
					</block>

					<block type = "button_wait_for_release">
						<value name="button">
							<block type="variables_get">
								<field name="VAR">button</field>
							</block>	
						</value>
					</block>
					<block type = "button_held_time">
						<value name="button">
							<block type="variables_get">
								<field name="VAR">button</field>
							</block>	
						</value>
					</block>

					<block type = "button_when_held">
						<value name="pin">
							<block type="variables_get">
								<field name="VAR">button</field>
							</block>	
						</value>
					</block>

					<block type = "button_when_pressed">
						<value name="pin">
							<block type="variables_get">
								<field name="VAR">button</field>
							</block>	
						</value>
					</block>

					<block type = "button_when_released">
						<value name="pin">
							<block type="variables_get">
								<field name="VAR">button</field>
							</block>	
						</value>
					</block>

				</category>
				<category name="Light" colour="40">
					<block type="variables_set">
						<field name="VAR">lightSensor</field>
							<value name="VALUE">
								<block type="light_sensor">
									<value name="pin_number">
										<block type="pin_analog"/>
									</value>
								</block>
							</value>
					</block>

					<block type="light_wait_for_dark">
						<value name="pin_number">
							<block type="variables_get">
								<field name="VAR">lightSensor</field>
							</block>	
						</value>
					</block>
					<block type="light_wait_for_light">
						<value name="pin_number">
							<block type="variables_get">
								<field name="VAR">lightSensor</field>
							</block>	
						</value>
					</block>

					<block type="light_detected">
						<value name="pin_number">
							<block type="variables_get">
								<field name="VAR">lightSensor</field>
							</block>	
						</value>
					</block>

					<block type="light_when_dark">
						<value name="pin">
							<block type="variables_get">
								<field name="VAR">lightSensor</field>
							</block>	
						</value>
					</block>

					<block type="light_when_light">
						<value name="pin">
							<block type="variables_get">
								<field name="VAR">lightSensor</field>
							</block>	
						</value>
					</block>

				</category>
				<category name="Temperature" colour="80">
					<block type="variables_set">
						<field name="VAR">DHTsensor</field>
						<value name="VALUE">
							<block type="dht_sensor">
								<value name="pin">
									<block type="pin_analog"/>
								</value>
							</block>
						</value>
					</block>

					<block type = "dht_temperature">
						<value name = "dht">
							<block type="variables_get">
								<field name="VAR">DHTsensor</field>
							</block>
						</value>						
					</block>

				</category>
				<category name="Humidity" colour="120">
					<block type="variables_set">
						<field name="VAR">DHTsensor</field>
						<value name="VALUE">
							<block type="dht_sensor">
								<value name="pin">
									<block type="pin_analog"/>
								</value>
							</block>
						</value>
					</block>

					
					<block type = "dht_humidity">
						<value name = "dht">
							<block type="variables_get">
								<field name="VAR">DHTsensor</field>
							</block>
						</value>
					</block>

				</category>

				<category name="Power Meter" colour="160">
				</category>
			
			
			<!-- <category name="Pin Output" colour="100"></category> -->
			<sep />
			
				<category name="LED" colour="200">
					<block type="variables_set">
						<field name="VAR">ledName</field>
						<value name="VALUE">
							<block type="led">
								<value name="pin">
									<block type="pin">
										<field name="pin">R4</field>
									</block>
								</value>
							</block>
						</value>
					</block>

					<block type="led_turn_on"> 
						<value name="NAME">
							<block type="variables_get">
								<field name="VAR">ledName</field>
							</block>
						</value>
					</block>

					<block type="led_turn_off"> 
						<value name="NAME">
							<block type="variables_get">
								<field name="VAR">ledName</field>
							</block>
						</value>
					</block>

					<block type="led_toggle"> 
						<value name="NAME">
							<block type="variables_get">
								<field name="VAR">ledName</field>
							</block>
						</value>
					</block>

					<block type="led_blink"> 
						<value name="led">
							<block type="variables_get">
								<field name="VAR">ledName</field>
							</block>
						</value>
					</block>

					<block type="led_is_lit"> 
						<value name="led">
							<block type="variables_get">
								<field name="VAR">ledName</field>
							</block>
						</value>
					</block>

					<block type="variables_set">
						<field name="VAR">pwmLedName</field>
						<value name="VALUE">
							<block type="pwm_led">
								<value name="pin">
									<block type="pin_digital"/>
								</value>
							</block>
						</value>
					</block>

					<block type="pwm_on"> 
						<value name="pwm_led">
							<block type="variables_get">
								<field name="VAR">pwmLedName</field>
							</block>
						</value>
						<value name="value">
							<block type="math_number"/>
						</value>
					</block>

					<block type="pwm_pulse">
						<value name="pwm_led">
							<block type="variables_get">
								<field name="VAR">pwmLedName</field>
							</block>
						</value>
					</block>
				</category>

				<category name="Traffic Light" colour="240">

					<block type="variables_set">
						<field name="VAR">trafficLight</field>
						<value name="VALUE">
							<block type="trafficlight"> 
								<value name="red">
									<block type="pin"/>
								</value>
								<value name="yellow">
									<block type="pin"/>
								</value>
								<value name="green">
									<block type="pin"/>
								</value>
							</block>
						</value>
					</block>
	

					<block type="traffic_light_on"> 
						<value name="NAME">
							<block type="variables_get">
								<field name="VAR">trafficLight</field>
							</block>
						</value>
					</block>

					<block type="traffic_blink"> 
						<value name="pin">
							<block type="variables_get">
								<field name="VAR">trafficLight</field>
							</block>
						</value>
					</block>

					<block type="traffic_close"> 
						<value name="pin">
							<block type="variables_get">
								<field name="VAR">trafficLight</field>
							</block>
						</value>
					</block>

					<block type="traffic_light_off">
						<value name="NAME">
							<block type="variables_get">
								<field name="VAR">trafficLight</field>
							</block>
						</value>
					</block>

					<block type="pwm_pulse">
						<value name="pwm_led">
							<block type="variables_get">
								<field name="VAR">trafficLight</field>
							</block>
						</value>
					</block>

					<block type="led_toggle"> 
						<value name="NAME">
							<block type="variables_get">
								<field name="VAR">trafficLight</field>
							</block>
						</value>
					</block>

				</category>
				<category name="LCD" colour="280">
					<block type="lcd_write">
						<value name="str">
							<block type="text">
								<field name="TEXT">Hello World!</field>
							</block>
						</value>
					</block>
				</category>
			
			<category name="Buzzer" colour = "320">

					<block type="variables_set">
						<field name="VAR">buzzerName</field>
						<value name="VALUE">
							<block type="buzzer">
								<value name="pin">
									<block type="pin">
										<field name="pin">R4</field>
									</block>
								</value>
							</block>
						</value>
					</block>	

					<block type="buzzer_beep">
						<value name="pin">
							<block type="variables_get">
								<field name="VAR">buzzerName</field>
							</block>
						</value>	
					</block>

					<block type="buzzer_on">
						<value name="pin">
							<block type="variables_get">
								<field name="VAR">buzzerName</field>
							</block>
						</value>						
					</block>

					<block type="buzzer_off">
						<value name="pin">
							<block type="variables_get">
								<field name="VAR">buzzerName</field>
							</block>
						</value>						
					</block>

					<block type="buzzer_toggle">
						<value name="pin">
							<block type="variables_get">
								<field name="VAR">buzzerName</field>
							</block>
						</value>						
					</block>		

					<block type="buzzer_is_active">
						<value name="pin">
							<block type="variables_get">
								<field name="VAR">buzzerName</field>
							</block>
						</value>						
					</block>	

			</category>

			<category name="Motors" colour = "40">
				<block type="variables_set">
						<field name="VAR">servoMotor</field>
						<value name="VALUE">
							<block type="servo">
								<value name="pin">
									<block type="pin_digital"/>	
								</value>
							</block>
						</value>
				</block>

				<block type="servo_detach">
						<value name="pin">
							<block type="variables_get">
								<field name="VAR">servoMotor</field>
							</block>
						</value>						
				</block>

				<block type="servo_max">
						<value name="pin">
							<block type="variables_get">
								<field name="VAR">servoMotor</field>
							</block>
						</value>						
				</block>

				<block type="servo_mid">
						<value name="pin">
							<block type="variables_get">
								<field name="VAR">servoMotor</field>
							</block>
						</value>						
				</block>

				<block type="servo_min">
						<value name="pin">
							<block type="variables_get">
								<field name="VAR">servoMotor</field>
							</block>
						</value>						
				</block>

				<block type="servo_value">
						<value name="pin">
							<block type="variables_get">
								<field name="VAR">servoMotor</field>
							</block>
						</value>		
						<value name="value">
							<block type="math_number"/>
						</value>				
				</block>


			</category>	

			<sep />
				
			<category name="Advanced" colour="80">
				<block type="analogread"> 
					<value name="pin">
						<block type="pin_analog"/>
					</value>
				</block>

				<block type="digitalread">
					<value name="pin">
						<block type="pin_digital"/>
					</value>
				</block>

				<block type="analogwrite">
					<value name="pin">
						<block type="pin_analog"/>
					</value>
					<value name="value">
						<block type="math_number"/>
					</value>
				</block>

				<block type="digitalwrite" > 
					<value name="pin">
						<block type="pin_digital"/>
					</value>
					<value name="value">
						<block type="logic_boolean"/>
					</value>
				</block>

				<block type="pinmode">
					<value name="NAME">
						<block type="pin_analog"/>
					</value>
				</block>

				<block type="pinmode">
					<value name="NAME">
						<block type="pin_digital"/>
					</value>
				</block>

				<block type="pause" /> 

				</category>

				<category name="Lab Network" colour="120">
					<block type="lab_network_send_all">
						<value name="message">
							<block type="text">
								<field name="TEXT">message</field>
							</block>
						</value>
						
					</block>
					<!-- <block type="lab_network_get_one">
						
						<value name="board">
							<block type="text">
								<field name="TEXT">board</field>
							</block>
						</value>
						<value name="varname">
							<block type="variables_get">
								<field name="VAR">variable</field>
							</block>
						</value>
				
						<value name="topic">
							<block type="text">
								<field name="TEXT">default</field>
							</block>
						</value>
					</block> -->

					<block type="lab_network_send_one">
						
						<value name="board">
							<block type="text">
								<field name="TEXT">board</field>
							</block>
						</value>

						<value name="message">
							<block type="text">
								<field name="TEXT">message</field>
							</block>
						</value>
						<value name="topic">
							<block type="text">
								<field name="TEXT">default</field>
							</block>
						</value>
					</block>

					<block type="lab_network_get_all">
						<value name="varname">
							<block type="variables_get">
								<field name="VAR">variable</field>
							</block>
						</value>
						<value name="topic">
							<block type="text">
								<field name="TEXT">default</field>
							</block>
						</value>
					</block>

					<!-- <block type="lab_network_when_changed">
						<value name="variable">
							<block type="variables_get">
								<field name="VAR">variable</field>
							</block>
						</value>
						<value name="msg">
							<block type="variables_get">
								<field name="VAR">message</field>
							</block>
						</value>
					</block> -->
					<block type = "got_values">
						<value name="var">
							<block type="variables_get">
								<field name="VAR">variable</field>
							</block>
						</value>
					</block>

					<block type = "got_broadcast">
						<value name="var">
							<block type="variables_get">
								<field name="VAR">variable</field>
							</block>
						</value>
					</block>

					<block type = "get_value">
						<value name="var">
							<block type="variables_get">
								<field name="VAR">variable</field>
							</block>
						</value>
					</block>

					<block type = "get_broadcast">
						<value name="var">
							<block type="variables_get">
								<field name="VAR">variable</field>
							</block>
						</value>
					</block>

					<block type = "link">
						<value name="var">
							<block type="variables_get">
								<field name="VAR">variable</field>
							</block>
						</value>
					</block>
					<!-- <block type="start_labnetwork" /> -->
				</category>


			


		</xml>
	</code>
</template>

<script>
module.exports = {
	name: 'VisualToolbox'
};
</script>

